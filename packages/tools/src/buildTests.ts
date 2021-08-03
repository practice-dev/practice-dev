import Path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { execWebpack, getWebpackModule } from './helper';
import { ChallengeInfo } from './types';

export interface BuildTestsOptions {
  basedir: string;
}

export async function buildTests(basedir: string, challenges: ChallengeInfo[]) {
  const testsDir = Path.join(basedir, 'dist/tests');

  const entry: Record<string, string[]> = {};
  challenges.forEach(task => {
    entry[task.uniqName] = [task.testPath];
  });
  await execWebpack({
    context: basedir,
    name: 'client',
    target: 'node',
    mode: 'development',
    devtool: false,
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
    },
    entry,
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs',
      path: testsDir,
      publicPath: '/',
    },
    plugins: [new CleanWebpackPlugin()],
    module: getWebpackModule(),
  });
}
