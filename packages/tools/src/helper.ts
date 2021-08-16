import fs from 'fs-extra';
import webpack from 'webpack';
import Path from 'path';
import crypto from 'crypto';

function _getValidRoot(basedir: string, regexp: RegExp) {
  const dir = fs.readdirSync(basedir);
  return dir.filter(name => {
    const stats = fs.statSync(Path.join(basedir, name));
    return stats.isDirectory() && regexp.test(name);
  });
}

export function getValidChallengeRoots(basedir: string) {
  return _getValidRoot(basedir, /^\d\d\d\-/);
}

export function getValidModuleRoots(basedir: string) {
  return _getValidRoot(basedir, /^\d\d\-/);
}

export function getNumberPrefix(dirname: string) {
  const exec = /^(\d+)-/.exec(dirname);
  if (!exec) {
    throw new Error('Cannot get number prefix: ' + dirname);
  }
  return Number(exec[1]);
}

export function findModuleDir(basedir: string, moduleId: number) {
  const moduleDirName = getValidModuleRoots(basedir).find(name => {
    const exec = /^\d+/.exec(name);
    return exec && Number(exec[0]) === moduleId;
  });
  if (!moduleDirName) {
    throw new Error('Module not found: ' + moduleId);
  }
  const modulePath = Path.join(basedir, moduleDirName);
  return { moduleDirName, modulePath };
}

export function findChallengeDir(
  basedir: string,
  moduleId: number,
  challengeModuleId: number
) {
  const { moduleDirName, modulePath } = findModuleDir(basedir, moduleId);
  const challengeDirName = getValidChallengeRoots(modulePath).find(name => {
    const exec = /^\d+/.exec(name);
    return exec && Number(exec[0]) === challengeModuleId;
  });
  if (!challengeDirName) {
    throw new Error(`Challenge ${challengeModuleId} for module ${moduleId}`);
  }
  const challengePath = Path.join(modulePath, challengeDirName);
  return {
    moduleDirName,
    modulePath,
    challengeDirName,
    challengePath,
  };
}

export function execWebpack(options: webpack.Configuration) {
  return new Promise<void>((resolve, reject) => {
    webpack(options).run((err, result) => {
      console.log(result?.toString());
      if (result?.hasErrors()) {
        reject(new Error('webpack compilation failed'));
      }
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

export function walk(dir: string) {
  const results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = Path.join(dir, file);
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results.push(...walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}
