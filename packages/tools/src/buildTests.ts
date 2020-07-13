import Path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { getEntry, execWebpack, getWebpackModule } from './helper';
import { TargetType } from './types';

export interface BuildTestsOptions {
  basedir: string;
  target: TargetType;
}

export async function buildTests(options: BuildTestsOptions) {
  const { basedir, target } = options;
  const testsDir = Path.join(basedir, 'dist/tests');

  await execWebpack({
    context: basedir,
    name: 'client',
    target: 'node',
    mode: 'development',
    devtool: false,
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
    },
    entry: getEntry(target, basedir, 'tests'),
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
