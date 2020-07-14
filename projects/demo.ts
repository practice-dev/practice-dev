import { demo } from '@pvd/tools';

const projectId = process.argv[2];
const challengeId = process.argv[3];

if (!projectId) {
  throw new Error('Missing project id');
}

if (!Number(projectId)) {
  throw new Error('Invalid project id');
}

if (!challengeId) {
  throw new Error('Missing challenge id');
}

if (!Number(challengeId)) {
  throw new Error('Invalid challenge id');
}

demo({
  basedir: __dirname,
  type: 'project',
  challengeId: Number(challengeId),
  projectId: Number(projectId),
});
