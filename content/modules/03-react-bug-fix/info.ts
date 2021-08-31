import { ModuleUpload } from '@pvd/tools';

export const info: ModuleUpload = {
  title: 'React Bug Fix',
  description: `Can you fix a bug in the provided code?
  <br />
  Let us know if you are interested to see more challenges in this category.
  `,
  mainTechnology: 'react',
  difficulty: 'various',
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
