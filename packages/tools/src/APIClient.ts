import fetch from 'cross-fetch';

export interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
}

export interface AwsUploadContentAuth {
  bucketName: string;
  credentials: AwsCredentials;
}

export class APIClient {
  constructor(private baseUrl: string, public getToken: () => string | null) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  // SIGNATURES
  aws_getAwsUploadContentAuth(): Promise<AwsUploadContentAuth> {
    return this.call('aws.getAwsUploadContentAuth', {});
  }
  challenge_updateChallenge(values: {
    challengeModuleId: number;
    moduleId: number;
    title: string;
    description: string;
    difficulty: string;
    practiceTime: number;
    detailsS3Key: string;
    htmlS3Key: string;
    solutionUrl: string;
    tests: string[];
    testS3Key: string;
    files: {
      name: string;
      directory: string;
      s3Key: string;
      isLocked?: boolean | null | undefined;
    }[];
    libraries: { name: string; types: string; source: string }[];
  }): Promise<void> {
    return this.call('challenge.updateChallenge', { values });
  }
  module_updateModule(values: {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    mainTechnology: string;
    tags: string[];
  }): Promise<void> {
    return this.call('module.updateModule', { values });
  }
  // SIGNATURES END
  private async call(name: string, params: any): Promise<any> {
    const token = this.getToken();
    const headers: any = {
      'content-type': 'application/json',
    };
    if (token) {
      headers['authorization'] = token;
    }

    const res = await fetch(`${this.baseUrl}/rpc/${name}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    const body = await res.json();
    if (res.status !== 200) {
      const err: any = new Error(body.error || 'Failed to call API');
      err.res = res;
      err.body = body;
      throw err;
    }
    return body;
  }
}
