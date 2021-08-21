import { ModuleUpload } from '@pvd/tools';

export const info: ModuleUpload = {
  title: 'React Basics',
  isComingSoon: true,
  description:
    'Learn React from basics step by step. No previous React experience required. This module will be published soon!',
  mainTechnology: 'react',
  difficulty: 'beginner',
  tags: [],
  defaultLibraries: [
    {
      name: 'react',
      types: 'https://cdn.jsdelivr.net/npm/@types/react@17.0.2/index.d.ts',
      source:
        'https://unpkg.com/@esm-bundle/react@17.0.2/esm/react.development.js',
    },
    {
      name: 'react-dom',
      types: 'https://cdn.jsdelivr.net/npm/@types/react-dom@17.0.2/index.d.ts',
      source:
        'https://unpkg.com/@esm-bundle/react-dom@17.0.2/esm/react-dom.development.js',
    },
  ],
};
