module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended', // Add Prettier plugin
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    indent: 'off',
    'no-console': 'error',
    'no-debugger': 'error',
    camelcase: 'error',
    'linebreak-style': ['error', 'windows'],
    semi: ['error', 'never'],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-namespace': 'off',
  },
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // eslint-disable-next-line no-undef
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      rules: {
        '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
        'no-void': ['error', { allowAsStatement: true }],
      },
    },
  ],
}
