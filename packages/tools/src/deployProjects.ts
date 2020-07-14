import fetch from 'node-fetch';
import { uploadJSFile, getProjectPackages, uploadAssets } from './helper';
import { buildSources } from './buildSources';
import { buildTests } from './buildTests';

interface DeployProjectsOptions {
  basedir: string;
  apiUrl: string;
  apiToken: string;
  s3BucketName: string;
}

async function updateProject(
  baseUrl: string,
  token: string,
  values: {
    id: number;
    title: string;
    description: string;
    domain: 'frontend' | 'backend' | 'fullstack' | 'styling';
  },
  challenges: {
    id: number;
    title: string;
    description: string;
    domain: 'frontend' | 'backend' | 'fullstack' | 'styling';
    detailsBundleS3Key: string;
    testsBundleS3Key: string;
    testCase: string;
    assets?: { [key: string]: any } | null | undefined;
  }[]
) {
  const res = await fetch(`${baseUrl}/rpc/project.updateProject`, {
    method: 'POST',
    body: JSON.stringify([values, challenges]),
    headers: {
      'content-type': 'application/json',
      'x-token': token,
    },
  });
  if (res.status !== 200) {
    console.error('Update project failed', await res.text());
    throw new Error('Failed to project project. Status: ' + res.status);
  }
}

export async function deployProjects(options: DeployProjectsOptions) {
  const { apiToken, apiUrl, s3BucketName, basedir } = options;

  await Promise.all([
    buildSources({
      basedir: basedir,
      target: 'project',
    }),
    buildTests({
      basedir: basedir,
      target: 'project',
    }),
  ]);
  const packages = await getProjectPackages(basedir);

  await Promise.all(
    packages.map(async pkg => {
      try {
        const { info } = pkg;
        const challenges = await Promise.all(
          pkg.challenges.map(async challenge => {
            const [
              detailsBundleS3Key,
              testsBundleS3Key,
              assets,
            ] = await Promise.all([
              uploadJSFile(s3BucketName, challenge.detailsFile, 'bundle'),
              uploadJSFile(s3BucketName, challenge.testFile, 'tests'),
              uploadAssets(
                basedir,
                s3BucketName,
                `${pkg.name}-${challenge.id}`,
                challenge.assets
              ),
            ]);
            return {
              id: challenge.id,
              title: challenge.title,
              description: challenge.description,
              domain: challenge.domain,
              testCase: JSON.stringify(challenge.testInfo),
              detailsBundleS3Key,
              testsBundleS3Key,
              assets,
            };
          })
        );
        await updateProject(
          apiUrl,
          apiToken,
          {
            id: info.id,
            title: info.title,
            description: info.description,
            domain: info.domain,
          },
          challenges
        );
      } catch (e) {
        console.error('Failed to process ', pkg.name);
        console.error(e);
        process.exit(1);
      }
    })
  );
}
