import { readdirSync } from 'node:fs';

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import globals from 'globals';

// '@/…' would go around the layer rules below, so only the test helpers may use it.
const noRootAlias = {
  regex: '^@/(?!test/)',
  message: 'Use the layer alias: @app, @pages, @features, @services or @shared.',
};

// The same layers for relative paths, which no-restricted-imports cannot follow.
const layerZones = [
  { target: './src/shared', from: ['./src/app', './src/pages', './src/features'] },
  { target: './src/services', from: ['./src/app', './src/pages', './src/features'] },
  { target: './src/features', from: ['./src/app', './src/pages'] },
  { target: './src/pages', from: ['./src/app', './src/features'] },
  ...readdirSync('./src/features').map((name) => ({
    target: `./src/features/${name}`,
    from: './src/features',
    except: [`./${name}`],
  })),
].map((zone) => ({ ...zone, message: 'Import another layer or feature through its alias.' }));

export default [
  { ignores: ['dist', 'coverage', 'node_modules'] },

  js.configs.recommended,
  importPlugin.flatConfigs.recommended,

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      'import/resolver': {
        node: { extensions: ['.js', '.jsx'] },
      },
    },
    rules: {
      // The `@` alias (vite.config.js / jsconfig.json) is resolved by Vite; `vite build` fails on bad paths.
      'import/no-unresolved': [
        'error',
        { ignore: ['^@/', '^@(app|features|pages|services|shared)/'] },
      ],
      // axios and i18next are meant to be used as `axios.create()` / `i18n.use()`.
      'import/no-named-as-default-member': 'off',

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            { pattern: '@/**', group: 'internal' },
            { pattern: '@{app,features,pages,services,shared}/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
    },
  },

  {
    files: ['src/**/*.{js,jsx}'],
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      // Plain JavaScript without the prop-types package: props are documented with JSDoc.
      'react/prop-types': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['src/**/*.{js,jsx}'],
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Architecture: app → pages → features → shared, features only through their index.js.
  {
    files: ['src/**/*.{js,jsx}'],
    rules: {
      'import/no-restricted-paths': ['error', { zones: layerZones }],
    },
  },
  {
    files: ['src/shared/**/*.{js,jsx}', 'src/services/**/*.{js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            noRootAlias,
            {
              group: ['@app', '@app/*', '@pages', '@pages/*', '@features', '@features/*'],
              message:
                'shared and services are the bottom layer: they never import app, pages or features.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.{js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            noRootAlias,
            {
              group: ['@app', '@app/*', '@pages', '@pages/*'],
              message: 'features never import app or pages.',
            },
            {
              group: ['@features/*/*'],
              message: "Import another feature only through its index.js: '@features/<name>'.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/pages/**/*.{js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            noRootAlias,
            { group: ['@app', '@app/*'], message: 'pages never import app.' },
            {
              group: ['@features/*/*'],
              message: "Import a feature only through its index.js: '@features/<name>'.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ['*.config.js'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // Tooling packages (vite, vitest, ...) are ESM-only with `exports` maps, which the node resolver cannot read.
      'import/no-unresolved': 'off',
    },
  },

  {
    files: ['**/*.test.{js,jsx}', 'src/test/**/*.js'],
    languageOptions: {
      globals: globals.vitest,
    },
  },

  prettier,
];
