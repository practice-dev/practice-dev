import * as Path from 'path';
import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { execWebpack, getWebpackModule } from './helper';
import { ChallengeInfo } from './types';

export async function buildDetails(
  basedir: string,
  challenges: ChallengeInfo[]
) {
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
