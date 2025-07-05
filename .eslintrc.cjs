module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',

  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },

    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {

  },
  overrides: [
    {

      files: ['cypress/**/*.ts', 'cypress.config.ts'],
      parserOptions: {

        project: './tsconfig.cypress.json',
        tsconfigRootDir: __dirname,
      },
      extends: [
        'plugin:cypress/recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {

        '@typescript-eslint/no-unused-expressions': 'off',
        'cypress/no-unnecessary-waiting': 'warn',
      },
      env: {
        'cypress/globals': true,
        node: true,
        browser: false
      },
    },
  ],
};
