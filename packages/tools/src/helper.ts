import fs from 'fs-extra';
import Path from 'path';
import webpack from 'webpack';
import AWS from 'aws-sdk';
import crypto from 'crypto';
import yaml from 'js-yaml';
import {
  ChallengePackage,
  ChallengeInfo,
  FileUpload,
  AssetsInfo,
  ProjectPackage,
  ProjectInfo,
  ProjectChallengePackage,
  SourceType,
  TargetType,
} from './types';
import { Tester } from '@pvd/tester';
import { TestInfo } from '@pvd/types';

let s3: AWS.S3 | null = null;

function getS3() {
  if (!s3) {
    s3 = new AWS.S3(
      process.env.AWS_DEFAULT_CREDENTIALS === 'true'
        ? {}
        : {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
          }
    );
  }
  return s3;
}

function _getSourceTarget(type: SourceType) {
  return type === 'details' ? 'details/index.tsx' : 'test-case.ts';
}

function _assertExists(basedir: string, path: string) {
  if (!fs.existsSync(Path.join(basedir, path))) {
    throw new Error(`"${path}" doesn't exist`);
  }
}

export function getValidRoots(basedir: string) {
  const dir = fs.readdirSync(basedir);
  return dir.filter(name => {
    const stats = fs.statSync(Path.join(basedir, name));
    return stats.isDirectory() && /^\d\d\d\-/.test(name);
  });
}

export function getEntryForChallenges(basedir: string, type: SourceType) {
  const entry: Record<string, string[]> = {};
  getValidRoots(basedir).forEach(name => {
    const target = _getSourceTarget(type);
    const index = `./${name}/${target}`;
    _assertExists(basedir, index);
    entry[name] = [index];
  });

  return entry;
}

export function getEntryForProjects(basedir: string, type: SourceType) {
  const entry: Record<string, string[]> = {};
  getValidRoots(basedir).forEach(name => {
    const dir = fs.readdirSync(Path.join(basedir, name));
    dir.forEach(subName => {
      const exec = /challenge-(\d+)/.exec(subName);
      if (exec) {
        const challengeId = exec[1];
        const target = _getSourceTarget(type);
        const index = `./${name}/${subName}/${target}`;
        _assertExists(basedir, index);
        entry[`${name}/${challengeId}`] = [index];
      }
    });
  });

  return entry;
}

export function getEntry(
  target: TargetType,
  basedir: string,
  type: SourceType
) {
  switch (target) {
    case 'challenge':
      return getEntryForChallenges(basedir, type);
    case 'project':
      return getEntryForProjects(basedir, type);
  }
}

export function execWebpack(options: webpack.Configuration) {
  return new Promise((resolve, reject) => {
    webpack(options).run(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export function getWebpackModule() {
  return {
    rules: [
      {
        test: /\.(html|css)$/i,
        use: 'raw-loader',
      },
      {
        test: /\.(t|j)sx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  };
}

export function md5(data: string | Buffer) {
  return crypto.createHash('md5').update(data).digest('hex');
}

function _getChallengeFileUploadPath(
  basedir: string,
  challengeName: string,
  dir: string
) {
  return Path.join(basedir, 'dist', dir, challengeName + '.js');
}

async function _getChallengeFileUpload(
  basedir: string,
  challengeName: string,
  dir: string
): Promise<FileUpload> {
  const path = _getChallengeFileUploadPath(basedir, challengeName, dir);
  const content = await fs.readFile(path);
  const hash = md5(content);
  return {
    name: `${challengeName}.${hash}.js`,
    path,
    content,
  };
}

function _getProjectChallengeFileUploadPath(
  basedir: string,
  projectName: string,
  challenge: number,
  dir: string
) {
  return Path.join(basedir, 'dist', dir, projectName, challenge + '.js');
}

async function getProjectChallengeFileUpload(
  basedir: string,
  projectName: string,
  challenge: number,
  dir: string
): Promise<FileUpload> {
  const path = _getProjectChallengeFileUploadPath(
    basedir,
    projectName,
    challenge,
    dir
  );
  const content = await fs.readFile(path);
  const hash = md5(content);
  return {
    name: `${projectName}-${challenge}.${hash}.js`,
    path,
    content,
  };
}

async function getTests(testFile: string) {
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
  const tests: TestInfo[] = tester.tests.map(test => ({
    id: test.id,
    name: test.name,
    result: 'pending' as 'pending',
    steps: [],
  }));
  return tests;
}

export async function getChallengePackages(basedir: string) {
  const challengeNames = getValidRoots(basedir);
  const ret = await Promise.all(
    challengeNames.map(async challengeName => {
      const info = require(Path.join(basedir, challengeName, 'info.ts'))
        .info as ChallengeInfo;
      const [detailsFile, testFile] = await Promise.all([
        _getChallengeFileUpload(basedir, challengeName, 'details'),
        _getChallengeFileUpload(basedir, challengeName, 'tests'),
      ]);
      const pkg: ChallengePackage = {
        dirName: challengeName,
        ...info,
        detailsFile,
        testFile,
        testInfo: await getTests(testFile.path),
      };
      return pkg;
    })
  );
  ret.sort((a, b) => a.id - b.id);
  return ret;
}

export async function getProjectPackages(basedir: string) {
  const dir = fs.readdirSync(basedir);
  const projectNames = dir.filter(name => {
    const stats = fs.statSync(Path.join(basedir, name));
    return stats.isDirectory() && /^\d\d\d\-/.test(name);
  });

  const ret = await Promise.all(
    projectNames.map(async projectName => {
      const info = require(Path.join(basedir, projectName, 'info.ts'))
        .info as ProjectInfo;
      const pkg: ProjectPackage = {
        name: projectName,
        info,
        challenges: await Promise.all(
          info.challenges.map(async challenge => {
            const [detailsFile, testFile] = await Promise.all([
              getProjectChallengeFileUpload(
                basedir,
                projectName,
                challenge.id,
                'details'
              ),
              getProjectChallengeFileUpload(
                basedir,
                projectName,
                challenge.id,
                'tests'
              ),
            ]);
            const challengePkg: ProjectChallengePackage = {
              ...challenge,
              detailsFile: detailsFile,
              testFile: testFile,
              testInfo: await getTests(testFile.path),
            };
            return challengePkg;
          })
        ),
      };
      return pkg;
    })
  );

  ret.sort((a, b) => a.name.localeCompare(b.name));

  return ret;
}

interface UploadS3Options {
  content: string | Buffer;
  contentType: string;
  bucketName: string;
  s3Key: string;
}

export async function uploadS3(options: UploadS3Options) {
  const { content, contentType, bucketName, s3Key } = options;
  const exists = await getS3()
    .headObject({
      Bucket: bucketName,
      Key: s3Key,
    })
    .promise()
    .then(
      () => true,
      err => {
        if (err.code === 'NotFound') {
          return false;
        }
        throw err;
      }
    );

  if (!exists) {
    await getS3()
      .upload({
        Bucket: bucketName,
        Key: s3Key,
        Body: content,
        ContentType: contentType,
        ContentLength: content.length,
      })
      .promise();
  }

  return s3Key;
}

export async function uploadJSFile(
  bucketName: string,
  upload: FileUpload,
  prefix: string
) {
  const s3Key = `${prefix}/${upload.name}`;
  return uploadS3({
    content: upload.content,
    contentType: 'text/javascript',
    bucketName,
    s3Key,
  });
}

export async function uploadAssets(
  basedir: string,
  bucketName: string,
  uploadPrefix: string,
  assets?: AssetsInfo
): Promise<Record<string, string> | null> {
  if (!assets) {
    return null;
  }

  const swaggerPath = Path.join(
    basedir,
    uploadPrefix,
    'details',
    'swagger.yaml'
  );
  const content = fs.readFileSync(swaggerPath, 'utf8');
  const hash = md5(content);
  const uploadNameBase =
    'assets/' + `${uploadPrefix}-${hash.substr(0, 8)}-swagger`;
  await Promise.all([
    uploadS3({
      bucketName,
      content,
      contentType: 'text/yaml',
      s3Key: uploadNameBase + '.yaml',
    }),
    uploadS3({
      bucketName,
      content: JSON.stringify(yaml.load(content)),
      contentType: 'application/json',
      s3Key: uploadNameBase + '.json',
    }),
  ]);

  return {
    swagger: uploadNameBase,
  };
}

export function getDirnameById(basedir: string, id: number) {
  return fs.readdirSync(basedir).find(name => {
    const stats = fs.statSync(Path.join(basedir, name));
    if (!stats.isDirectory()) {
      return false;
    }
    const exec = /^(\d\d\d)\-/.exec(name);
    if (!exec) {
      return false;
    }
    const dirId = Number(exec[1]);
    return dirId === Number(id);
  });
}
