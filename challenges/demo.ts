import { demo } from '@pvd/tools';

const challengeId = process.argv[2];

if (!challengeId) {
  throw new Error('Missing challenge id as last argument');
}

if (!Number(challengeId)) {
  throw new Error('Invalid challenge id');
}

demo({
  basedir: __dirname,
  type: 'challenge',
  challengeId: Number(challengeId),
});
