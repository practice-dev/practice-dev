import { deployProject } from '@pvd/tools';
import Path from 'path';

const moduleId = process.argv[2];

if (!moduleId) {
  throw new Error('Missing module id');
}

if (!Number(moduleId)) {
  throw new Error('Invalid module id');
}

deployProject({
  basedir: Path.join(__dirname, '../modules'),
  moduleId: Number(moduleId),
});
