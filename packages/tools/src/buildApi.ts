import Path from 'path';
import webpack from 'webpack';
import { execWebpack } from './helper';

export interface BuildApiOptions {
  basedir: string;
  entry?: string;
}

export async function buildApi(options: BuildApiOptions) {
  const { basedir, entry } = options;

  await execWebpack({
    context: basedir,
    mode: 'none',
    devtool: false,
    entry: Path.join(basedir, entry ?? './src/lambda.ts'),
    optimization: {
      namedModules: false,
      namedChunks: true,
      nodeEnv: 'production',
      flagIncludedChunks: true,
      occurrenceOrder: true,
      sideEffects: true,
      usedExports: true,
      concatenateModules: true,
      splitChunks: {
        minSize: 30000,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
      },
      noEmitOnErrors: true,
      minimize: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ],
    resolve: {
      extensions: ['.js', '.ts', '.json'],
    },
    output: {
      path: Path.join(basedir, 'dist'),
      filename: 'app-lambda.js',
      libraryTarget: 'commonjs',
    },
    externals: [
      function (context, request, callback) {
        if (/^aws-sdk/.test(request)) {
          return callback(null, 'commonjs ' + request);
        }
        callback();
      },
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            configFile: Path.resolve(__dirname, '../tsconfig.api-build.json'),
            transpileOnly: true,
          },
        },
      ],
    },
  });
}
