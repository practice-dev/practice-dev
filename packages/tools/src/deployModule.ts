import * as React from 'react';
import * as R from 'remeda';
import * as ReactDOMServer from 'react-dom/server';
import * as Path from 'path';
import fs from 'fs-extra';
import tmp from 'tmp';
import mime from 'mime-types';
import { Tester } from '@pvd/tester';
import {
  findModuleDir,
  getNumberPrefix,
  getValidChallengeRoots,
  md5,
  walk,
} from './helper';
import { S3Upload } from './S3Upload';
import {
  ChallengeFile,
  ChallengeInfo,
  ChallengeUpload,
  ModuleUpload,
  UpdateChallengeValues,
} from './types';
import { buildDetails } from './buildDetails';
import { buildTests } from './buildTests';
import { api } from './api';

function _nodeToMarkup(component: string) {
  const node = React.createElement(component);
  return ReactDOMServer.renderToStaticMarkup(node);
}

function _getChallengeFiles(sourceDir: string, lockedFiles: string[]) {
  return walk(sourceDir).map(filePath => {
    const relativePath = Path.relative(sourceDir, filePath);
    const fileInput: ChallengeFile = {
      name: Path.basename(relativePath),
      directory: Path.dirname(relativePath),
      isLocked: lockedFiles.includes(relativePath),
      s3Key: '',
    };
    return fileInput;
  });
}

function _getChallengesInfo(moduleUpload: ModuleUpload, moduleDir: string) {
  const moduleId = getNumberPrefix(Path.basename(moduleDir));
  const challenges: ChallengeInfo[] = [];
  const challengeRoots = getValidChallengeRoots(moduleDir);

  challengeRoots.map(challengeDirName => {
    const challengeModuleId = getNumberPrefix(challengeDirName);
    const challengeDir = Path.join(moduleDir, challengeDirName);
    const detailsPath = Path.join(challengeDir, 'details', 'index.tsx');
    const sourceDir = Path.join(challengeDir, 'source');
    const infoPath = Path.join(challengeDir, 'info.ts');
    const testPath = Path.join(challengeDir, 'test-case.ts');
    if (!fs.existsSync(detailsPath)) {
      throw new Error(`${detailsPath} doesn't exist`);
    }
    if (!fs.existsSync(infoPath)) {
      throw new Error(`${infoPath} doesn't exist`);
    }
    if (!fs.existsSync(testPath)) {
      throw new Error(`${testPath} doesn't exist`);
    }
    const info = require(infoPath).info as ChallengeUpload;
    const uniqName = challengeDirName;
    const distFileName = `${uniqName}.js`;
    const detailsHTML = _nodeToMarkup(require(detailsPath).Details);
    const htmlFilePath = tmp.fileSync({
      postfix: '.html',
    }).name;
    fs.writeFileSync(htmlFilePath, detailsHTML);
    const libraries = info.library ?? moduleUpload.defaultLibraries;
    if (!libraries) {
      throw new Error('No libraries for: ' + challengeModuleId);
    }
    challenges.push({
      challenge: {
        challengeModuleId: challengeModuleId,
        title: info.title,
        description: info.description,
        difficulty: info.difficulty,
        practiceTime: info.practiceTime,
        solutionUrl: info.solutionUrl,
        detailsS3Key: '',
        files: _getChallengeFiles(sourceDir, info.lockedFiles),
        htmlS3Key: '',
        testS3Key: '',
        moduleId,
        libraries,
        tests: [],
      },
      testPath,
      sourceDir,
      detailsPath,
      distFileName,
      uniqName,
      htmlFilePath,
      distFilePath: Path.join(moduleDir, 'dist', distFileName),
      distTestPath: Path.join(moduleDir, 'dist/tests', distFileName),
    });
  });
  return challenges;
}

function _getChallengePrefix(challenge: UpdateChallengeValues) {
  return `c_${challenge.moduleId}_${challenge.challengeModuleId}`;
}

async function _prepareFileUpload(
  path: string,
  baseName: string,
  noContent = false
) {
  const contentType = mime.lookup(path);
  const ext = path.endsWith('.tar.gz') ? '.tar.gz' : Path.extname(path);
  if (!ext) {
    throw new Error('No extension');
  }
  if (!contentType && !noContent) {
    throw new Error('Cannot get content type: ' + path);
  }
  const content = await fs.readFile(path);
  const hash = md5(content);
  const hashedName = `${baseName.replace(ext, '')}.${hash}${ext}`;
  return {
    hashedName,
    contentType: contentType ? contentType : undefined,
    content,
  };
}

async function _uploadChallenges(
  s3Upload: S3Upload,
  challenges: ChallengeInfo[]
) {
  await Promise.all([
    ...challenges.map(async info => {
      await Promise.all(
        info.challenge.files.map(async file => {
          const path = Path.join(info.sourceDir, file.directory, file.name);
          const { contentType, hashedName, content } = await _prepareFileUpload(
            path,
            file.name,
            true
          );
          const s3Key = `${_getChallengePrefix(
            info.challenge
          )}/source/${hashedName}`;
          await s3Upload.upload({
            content,
            contentType,
            s3Key,
          });
          file.s3Key = s3Key;
        })
      );
    }),
    ...challenges.map(async info => {
      await Promise.all(
        [
          {
            path: info.htmlFilePath,
            out: 'htmlS3Key' as const,
            prefix: '/details/',
          },
          {
            path: info.distFilePath,
            out: 'detailsS3Key' as const,
            prefix: '/details/',
          },
          {
            path: info.distTestPath,
            out: 'testS3Key' as const,
            prefix: '/test/',
          },
        ].map(async file => {
          const { out, path, prefix } = file;
          const { contentType, hashedName, content } = await _prepareFileUpload(
            path,
            file.out.replace('S3Key', '')
          );
          const s3Key = `cdn/${_getChallengePrefix(
            info.challenge
          )}${prefix}${hashedName}`;
          await s3Upload.upload({
            content,
            contentType,
            s3Key,
          });
          info.challenge[out] = s3Key;
        })
      );
    }),
  ]);
}

async function _getTests(testFile: string) {
  const testConfiguration = require(testFile).default;

  const tester = new Tester(
    {
      notify() {
        throw new Error('Not supported');
      },
    },
    async () => {
      throw new Error('Not supported');
    }
  );
  await testConfiguration.handler({
    tester,
    url: 'mock',
  });
  return tester.tests.map(test => test.name);
}

async function _populateTests(info: ChallengeInfo) {
  info.challenge.tests = await _getTests(info.testPath);
}

interface DeployModuleOptions {
  basedir: string;
  moduleId: number;
}

export async function deployModule(options: DeployModuleOptions) {
  const { basedir, moduleId } = options;
  const { modulePath } = findModuleDir(basedir, moduleId);
  const moduleUpload = require(Path.join(modulePath, 'info.ts'))
    .info as ModuleUpload;
  moduleUpload.id = moduleId;
  const challenges = _getChallengesInfo(moduleUpload, modulePath);
  await Promise.all(challenges.map(challenge => _populateTests(challenge)));
  await buildDetails(modulePath, challenges);
  await buildTests(modulePath, challenges);
  const s3Auth = await api.aws_getAwsUploadContentAuth();
  const s3Upload = new S3Upload(s3Auth);
  await _uploadChallenges(s3Upload, challenges);
  await api.module_updateModule({
    ...R.omit(moduleUpload, ['defaultLibraries']),
    id: moduleId,
  });
  await Promise.all(
    challenges.map(challenge =>
      api.challenge_updateChallenge(challenge.challenge)
    )
  );
}
