export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Void: any;
};

export type AwsCredentials = {
  __typename?: 'AwsCredentials';
  accessKeyId: Scalars['String'];
  secretAccessKey: Scalars['String'];
  sessionToken: Scalars['String'];
};

export type AwsUploadContentAuth = {
  __typename?: 'AwsUploadContentAuth';
  bucketName: Scalars['String'];
  credentials: AwsCredentials;
};

export type ChallengeFileInput = {
  name: Scalars['String'];
  directory: Scalars['String'];
  s3Key: Scalars['String'];
  isLocked?: Maybe<Scalars['Boolean']>;
};

export type LibraryInput = {
  name: Scalars['String'];
  types: Scalars['String'];
  source: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  updateModule?: Maybe<Scalars['Void']>;
  updateChallenge?: Maybe<Scalars['Void']>;
};

export type MutationUpdateModuleArgs = {
  values: UpdateModuleInput;
};

export type MutationUpdateChallengeArgs = {
  values: UpdateChallengeInput;
};

export type Query = {
  __typename?: 'Query';
  getAwsUploadContentAuth: AwsUploadContentAuth;
};

export type UpdateChallengeInput = {
  challengeId: Scalars['Int'];
  moduleId: Scalars['Int'];
  title: Scalars['String'];
  description: Scalars['String'];
  difficulty: Scalars['String'];
  practiceTime: Scalars['Int'];
  detailsS3Key: Scalars['String'];
  htmlS3Key: Scalars['String'];
  testS3Key: Scalars['String'];
  solutionUrl: Scalars['String'];
  files: Array<ChallengeFileInput>;
  libraries: Array<LibraryInput>;
  tests: Array<Scalars['String']>;
};

export type UpdateModuleInput = {
  id: Scalars['Int'];
  title: Scalars['String'];
  description: Scalars['String'];
  mainTechnology: Scalars['String'];
  difficulty: Scalars['String'];
  tags: Array<Scalars['String']>;
};

export type GetAwsUploadContentAuthQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetAwsUploadContentAuthQuery = { __typename?: 'Query' } & {
  getAwsUploadContentAuth: { __typename?: 'AwsUploadContentAuth' } & Pick<
    AwsUploadContentAuth,
    'bucketName'
  > & {
      credentials: { __typename?: 'AwsCredentials' } & Pick<
        AwsCredentials,
        'accessKeyId' | 'secretAccessKey' | 'sessionToken'
      >;
    };
};

export type UpdateModuleMutationVariables = Exact<{
  values: UpdateModuleInput;
}>;

export type UpdateModuleMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'updateModule'
>;

export type UpdateChallengeMutationVariables = Exact<{
  values: UpdateChallengeInput;
}>;

export type UpdateChallengeMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'updateChallenge'
>;
