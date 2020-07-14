import fetch from 'node-fetch';
import { uploadJSFile, getChallengePackages, uploadAssets } from './helper';
import { buildSources } from './buildSources';
import { buildTests } from './buildTests';

interface DeployChallengesOptions {
  basedir: string;
  apiUrl: string;
  apiToken: string;
  s3BucketName: string;
}

async function updateChallenge(
  baseUrl: string,
  token: string,
  values: {
    id: number;
    title: string;
    description: string;
    domain: 'frontend' | 'backend' | 'fullstack' | 'styling';
    difficulty: 'easy' | 'medium' | 'hard';
    detailsBundleS3Key: string;
    testsBundleS3Key: string;
    tags: string[];
    testCase: string;
    assets?: { [key: string]: any } | null | undefined;
  }
) {
  const res = await fetch(`${baseUrl}/rpc/challenge.updateChallenge`, {
    method: 'POST',
    body: JSON.stringify([values]),
    headers: {
      'content-type': 'application/json',
      'x-token': token,
    },
  });
  const body = await res.json();
  if (res.status !== 200) {
    console.error('Update challenged failed', body);
    throw new Error('Failed to update challenge. Status: ' + res.status);
  }
}

export async function deployChallenges(options: DeployChallengesOptions) {
  const { apiToken, apiUrl, s3BucketName, basedir } = options;

  await Promise.all([
    buildSources({
      basedir: basedir,
      target: 'challenge',
    }),
    buildTests({
      basedir: basedir,
      target: 'challenge',
    }),
  ]);
  const packages = await getChallengePackages(basedir);

  await Promise.all(
    packages.map(async pkg => {
      try {
        const [
          detailsBundleS3Key,
          testsBundleS3Key,
          assets,
        ] = await Promise.all([
          uploadJSFile(s3BucketName, pkg.detailsFile, 'bundle'),
          uploadJSFile(s3BucketName, pkg.testFile, 'tests'),
          uploadAssets(basedir, s3BucketName, pkg.dirName, pkg.assets),
        ]);
        await updateChallenge(apiUrl, apiToken, {
          id: pkg.id,
          title: pkg.title,
          description: pkg.description,
          domain: pkg.domain,
          difficulty: pkg.difficulty,
          tags: pkg.tags,
          testCase: JSON.stringify(pkg.testInfo),
          detailsBundleS3Key,
          testsBundleS3Key,
          assets,
        });
      } catch (e) {
        console.error('Failed to process ', pkg.id, pkg.title);
        console.error(e);
        process.exit(1);
      }
    })
  );
}
