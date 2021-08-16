import { demo } from '@pvd/tools';
import Path from 'path';

const moduleId = process.argv[2];
const challengeModuleId = process.argv[3];

if (!moduleId) {
  throw new Error('Missing module id');
}

if (!Number(moduleId)) {
  throw new Error('Invalid module id');
}

if (!challengeModuleId) {
  throw new Error('Missing challenge id');
}

if (!Number(challengeModuleId)) {
  throw new Error('Invalid challenge id');
}

demo({
  basedir: Path.join(__dirname, '../modules'),
  challengeModuleId: Number(challengeModuleId),
  moduleId: Number(moduleId),
});
