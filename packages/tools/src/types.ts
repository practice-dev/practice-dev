import { UpdateChallengeInput } from './generated';

export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export interface ModuleUpload {
  id?: number;
  title: string;
  description: string;
  mainTechnology: string;
  difficulty: Difficulty | 'various';
  tags: string[];
}

export interface ChallengeUpload {
  title: string;
  description: string;
  difficulty: Difficulty;
  practiceTime: number;
}

export interface ChallengeInfo {
  challenge: UpdateChallengeInput;
  uniqName: string;
  sourceDir: string;
  detailsPath: string;
  distFileName: string;
  distFilePath: string;
  htmlFilePath: string;
}
