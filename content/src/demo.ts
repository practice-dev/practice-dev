import { demo } from '@pvd/tools';
import Path from 'path';

const moduleId = process.argv[2];
const challengeId = process.argv[3];

if (!moduleId) {
  throw new Error('Missing module id');
}

if (!Number(moduleId)) {
  throw new Error('Invalid module id');
}

if (!challengeId) {
  throw new Error('Missing challenge id');
}

if (!Number(challengeId)) {
  throw new Error('Invalid challenge id');
}

demo({
  basedir: Path.join(__dirname, '../modules'),
  challengeId: Number(challengeId),
  moduleId: Number(moduleId),
});
