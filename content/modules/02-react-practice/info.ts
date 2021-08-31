import { ModuleUpload } from '@pvd/tools';

export const info: ModuleUpload = {
  title: 'React Practice',
  description: `This is a generic React module that contains various challenges using only React library.
      <br />
    Recommended for users who know React basics.
    <br />
      More challenges will be added to this module soon.
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
