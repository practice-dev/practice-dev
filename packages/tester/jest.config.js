module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],

  globals: {
    'ts-jest': {
      isolatedModules: true,
      diagnostics: false,
    },
  },
};
