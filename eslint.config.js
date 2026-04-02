// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [// 1. Ignore the dist directory
{
  ignores: ['dist/**', '**/*.d.ts'],
}, // 2. Base JavaScript/TypeScript configuration
js.configs.recommended, // 3. TypeScript ESLint recommended config + custom TS rule
{
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
    globals: {
      ...globals.browser,
      ...globals.es2020,
      ...globals.node,
    },
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
  },
  rules: {
    ...tsPlugin.configs.recommended.rules,
    '@typescript-eslint/no-explicit-any': 'warn',
  },
}, // 4. React plugin recommended config + custom React rule
{
  files: ['**/*.{jsx,tsx}'],
  plugins: {
    react: reactPlugin,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    'react/react-in-jsx-scope': 'off',
  },
}, // 5. React Hooks plugin recommended config
{
  files: ['**/*.{jsx,tsx}'],
  plugins: {
    'react-hooks': reactHooksPlugin,
  },
  rules: {
    ...reactHooksPlugin.configs.recommended.rules,
  },
}, ...storybook.configs["flat/recommended"]];
