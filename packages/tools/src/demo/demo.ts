import webpack from 'webpack';
import Server from 'webpack-dev-server';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import createStyledComponentsTransformer from 'typescript-plugin-styled-components';
import Path from 'path';
import { findChallengeDir } from '../helper';

const styledComponentsTransformer = createStyledComponentsTransformer({
  getDisplayName: (filename: string, bindingName: string) => {
    const name = Path.basename(filename).split('.')[0];
    return `${name}_${bindingName || ''}`;
  },
});

export interface BuildSourcesOptions {
  basedir: string;
  moduleId: number;
  challengeModuleId: number;
}

function createEntry(basedir: string, componentPath: string) {
  fs.writeFileSync(
    Path.join(basedir, 'demo-entry.tsx'),
    `
import React from 'react';
import ReactDOM from 'react-dom';
import { ChallengeDemo } from '@pvd/ui';
import { Details } from '${componentPath}';

const MOUNT_NODE = document.getElementById('root')!;

function render(Component: React.SFC) {
  ReactDOM.unmountComponentAtNode(MOUNT_NODE);
  try {
    ReactDOM.render(
      <ChallengeDemo>
        <Component />
      </ChallengeDemo>,
      MOUNT_NODE
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
}

render(Details);

if (module.hot) {
  module.hot.accept('${componentPath}', () => {
    render(require('${componentPath}').Details);
  });
}
  `
  );
}

function createChallengeEntry(
  basedir: string,
  moduleId: number,
  challengeModuleId: number
) {
  const { challengePath } = findChallengeDir(
    basedir,
    moduleId,
    challengeModuleId
  );

  const componentPath = `./details/index`;
  const fullPath = Path.join(challengePath, componentPath + '.tsx');
  if (!fs.existsSync(fullPath)) {
    throw new Error(`${fullPath} doesn't exist`);
  }
  createEntry(challengePath, componentPath);
}

export async function demo(options: BuildSourcesOptions) {
  const { basedir, moduleId, challengeModuleId: challengeId } = options;
  const { challengePath } = findChallengeDir(basedir, moduleId, challengeId);
  createChallengeEntry(basedir, moduleId, challengeId);

  const webpackConfig = webpack({
    context: challengePath,
    name: 'client',
    target: 'web',
    mode: 'development',
    devtool: 'cheap-module-source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
    },
    entry: {
      app: ['./demo-entry.tsx'],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    stats: 'errors-only',
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[hash].js',
      path: Path.join(__dirname, './dist'),
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: Path.join(__dirname, './index.ejs'),
        hash: false,
        filename: 'index.html',
        inject: false,
        minify: {
          collapseWhitespace: false,
        },
        title: 'Demo',
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
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
                getCustomTransformers: () => ({
                  before: [styledComponentsTransformer],
                }),
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
  });
  const server = new Server(webpackConfig, {
    hot: true,
    contentBase: './dist',
    // quiet: true,
  });
  const port = Number(process.env.PORT || 8011);
  server.listen(port, '0.0.0.0', err => {
    if (err) {
      throw err;
    }
    console.log(`listening on http://localhost:${port}`);
  });
}
