import { TestInfo } from '@pvd/types';

export type Domain = 'frontend' | 'backend' | 'fullstack' | 'styling';
export type Difficulty = 'easy' | 'medium' | 'hard';

export type SourceType = 'details' | 'tests';
export type TargetType = 'challenge' | 'project';

export interface ProjectInfo {
  id: number;
  title: string;
  description: string;
  domain: Domain;
  challenges: ProjectChallengeInfo[];
}

export interface AssetsInfo {
  hasSwagger?: boolean;
}

export interface ProjectChallengeInfo {
  id: number;
  title: string;
  description: string;
  domain: Domain;
  assets?: AssetsInfo;
}

export interface FileUpload {
  name: string;
  path: string;
  content: Buffer;
}

export interface ProjectChallengePackage extends ProjectChallengeInfo {
  detailsFile: FileUpload;
  testFile: FileUpload;
  testInfo: TestInfo[];
}

export interface ProjectPackage {
  name: string;
  info: ProjectInfo;
  challenges: ProjectChallengePackage[];
}

export interface ChallengeInfo {
  id: number;
  title: string;
  description: string;
  tags: string[];
  domain: Domain;
  difficulty: Difficulty;
  assets?: AssetsInfo;
}

export interface ChallengePackage extends ChallengeInfo {
  dirName: string;
  detailsFile: FileUpload;
  testFile: FileUpload;
  testInfo: TestInfo[];
}
