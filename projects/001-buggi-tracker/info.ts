import { ProjectInfo } from '@pvd/tools';

export const info: ProjectInfo = {
  id: 1,
  title: 'Buggi tracker',
  description:
    'Create a new generation bug tracker.\n\nNOTE: This project is still in progress, there will be more iterations!',
  domain: 'fullstack',
  challenges: [
    {
      id: 1,
      title: 'Initial seed',
      description: 'Initialize the project with basic functionality.',
      domain: 'fullstack',
    },
    {
      id: 2,
      title: 'User management',
      description: 'Implement user management functionality for admin.',
      domain: 'fullstack',
    },
    {
      id: 3,
      title: 'Project management',
      description: 'Implement project management functionality for all roles.',
      domain: 'fullstack',
    },
    {
      id: 4,
      title: 'Issue reporting',
      description: 'Implement issue reporting functionality',
      domain: 'fullstack',
    },
  ],
};
