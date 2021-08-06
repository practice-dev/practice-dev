import { APIClient } from './APIClient';

export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export interface ModuleUpload {
  id?: number;
  title: string;
  description: string;
  mainTechnology: string;
  difficulty: Difficulty | 'various';
  tags: string[];
  defaultLibraries?: LibraryDefinition[];
}

export interface ChallengeUpload {
  title: string;
  description: string;
  difficulty: Difficulty;
  practiceTime: number;
  library?: LibraryDefinition[];
  lockedFiles: string[];
  solutionUrl: string;
}

export interface ChallengeInfo {
  challenge: UpdateChallengeValues;
  uniqName: string;
  sourceDir: string;
  detailsPath: string;
  testPath: string;
  distFileName: string;
  distFilePath: string;
  htmlFilePath: string;
  distTestPath: string;
}

export interface LibraryDefinition {
  name: string;
  types: string;
  source: string;
}

type ExtractFirstArg<T> = T extends (arg: infer U) => any ? U : never;

export type UpdateChallengeValues = ExtractFirstArg<
  APIClient['challenge_updateChallenge']
>;

export type ChallengeFile = UpdateChallengeValues['files'][0];
