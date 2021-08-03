import { UpdateChallengeInput } from './generated';

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
  challenge: UpdateChallengeInput;
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
