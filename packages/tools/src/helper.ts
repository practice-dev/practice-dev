import fs from 'fs-extra';
import Path from 'path';

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

export function findChallengeDir(
  basedir: string,
  moduleId: number,
  challengeId: number
) {
  const moduleDirName = getValidModuleRoots(basedir).find(name => {
    const exec = /^\d+/.exec(name);
    return exec && Number(exec[0]) === moduleId;
  });
  if (!moduleDirName) {
    throw new Error('Module not found: ' + moduleId);
  }
  const modulePath = Path.join(basedir, moduleDirName);
  const challengeDirName = getValidChallengeRoots(modulePath).find(name => {
    const exec = /^\d+/.exec(name);
    return exec && Number(exec[0]) === challengeId;
  });
  if (!challengeDirName) {
    throw new Error(`Challenge ${challengeId} for module ${moduleId}`);
  }
  const challengePath = Path.join(modulePath, challengeDirName);
  return {
    moduleDirName,
    modulePath,
    challengeDirName,
    challengePath,
  };
}
