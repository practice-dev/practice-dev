import * as React from 'react';
import * as R from 'remeda';
import * as ReactDOMServer from 'react-dom/server';
import * as Path from 'path';
import fs from 'fs-extra';
import tmp from 'tmp';
import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import mime from 'mime-types';
import {
  execWebpack,
  findModuleDir,
  getNumberPrefix,
  getValidChallengeRoots,
  getWebpackModule,
  md5,
  walk,
} from './helper';
import {
  getAwsUploadContentAuth,
  updateChallenge,
  updateModule,
} from './queries';
import { S3Upload } from './S3Upload';
import { ChallengeInfo, ChallengeUpload, ModuleUpload } from './types';
import { ChallengeFileInput, UpdateChallengeInput } from './generated';

function _nodeToMarkup(component: string) {
  const node = React.createElement(component);
  return ReactDOMServer.renderToStaticMarkup(node);
}

async function _buildDetails(basedir: string, challenges: ChallengeInfo[]) {
  const entry: Record<string, string[]> = {};
  challenges.forEach(task => {
    entry[task.uniqName] = [task.detailsPath];
  });
  const detailsDir = Path.join(basedir, 'dist');
  await execWebpack({
    context: basedir,
    name: 'client',
    target: 'web',
    mode: 'production',
    devtool: false,
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ] as any,
    },
    entry: entry,
    externals: {
      react: 'root React',
      prismjs: 'root Prism',
      'react-dom': 'root ReactDom',
    },
    output: {
      library: 'ChallengeJSONP',
      filename: '[name].js',
      chunkFilename: '[name].js',
      libraryTarget: 'jsonp',
      path: detailsDir,
      publicPath: '/',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
    ],
    module: getWebpackModule(),
  });
}

function _getChallengeFiles(sourceDir: string, lockedFiles: string[]) {
  return walk(sourceDir).map(filePath => {
    const relativePath = Path.relative(sourceDir, filePath);
    const fileInput: ChallengeFileInput = {
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
    const challengeId = getNumberPrefix(challengeDirName);
    const challengeDir = Path.join(moduleDir, challengeDirName);
    const detailsPath = Path.join(challengeDir, 'details', 'index.tsx');
    const sourceDir = Path.join(challengeDir, 'source');
    const infoPath = Path.join(challengeDir, 'info.ts');
    if (!fs.existsSync(detailsPath)) {
      throw new Error(`${detailsPath} doesn't exist`);
    }
    if (!fs.existsSync(infoPath)) {
      throw new Error(`${infoPath} doesn't exist`);
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
      throw new Error('No libraries for: ' + challengeId);
    }
    challenges.push({
      challenge: {
        challengeId: challengeId,
        title: info.title,
        description: info.description,
        difficulty: info.difficulty,
        practiceTime: info.practiceTime,
        detailsS3Key: '',
        files: _getChallengeFiles(sourceDir, info.lockedFiles),
        htmlS3Key: '',
        moduleId,
        libraries,
      },
      sourceDir,
      detailsPath,
      distFileName,
      uniqName,
      htmlFilePath,
      distFilePath: Path.join(moduleDir, 'dist', distFileName),
    });
  });
  return challenges;
}

function _getChallengePrefix(challenge: UpdateChallengeInput) {
  return `c_${challenge.moduleId}_${challenge.challengeId}`;
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
          { path: info.htmlFilePath, out: 'htmlS3Key' as const },
          { path: info.distFilePath, out: 'detailsS3Key' as const },
        ].map(async file => {
          const { out, path } = file;
          const { contentType, hashedName, content } = await _prepareFileUpload(
            path,
            file.out.replace('S3Key', '')
          );
          const s3Key = `${_getChallengePrefix(
            info.challenge
          )}/details/${hashedName}`;
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
  await _buildDetails(modulePath, challenges);
  const s3Auth = await getAwsUploadContentAuth();
  const s3Upload = new S3Upload(s3Auth);
  await _uploadChallenges(s3Upload, challenges);
  await Promise.all(
    challenges.map(challenge => updateChallenge(challenge.challenge))
  );
  await updateModule({
    ...R.omit(moduleUpload, ['defaultLibraries']),
    id: moduleId,
  });
}
