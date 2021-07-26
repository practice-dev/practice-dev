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
  id?: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  practiceTime: number;
}
