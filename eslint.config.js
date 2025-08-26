import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginA11y from 'eslint-plugin-jsx-a11y';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**'],
  },

  // Basis: JavaScript Recommended
  js.configs.recommended,

  // TypeScript Recommended
  ...tseslint.configs.recommended,

  // Prettier (überschreibt widersprüchliche Regeln)
  prettier,

  {
    plugins: {
      'unused-imports': pluginUnusedImports,
      '@typescript-eslint': tseslint.plugin,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginA11y,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-console': 'warn',

      // Best practices
      'dot-notation': 'error',
      'no-else-return': 'error',
      'no-floating-decimal': 'error',
      'no-sequences': 'error',

      // Stylistic
      'array-bracket-spacing': 'error',
      'computed-property-spacing': ['error', 'never'],
      curly: 'error',
      'no-lonely-if': 'error',
      'no-unneeded-ternary': 'error',
      'one-var-declaration-per-line': 'error',
      quotes: [
        'error',
        'single',
        {
          allowTemplateLiterals: false,
          avoidEscape: true,
        },
      ],

      // ES6
      'array-callback-return': 'off',
      'prefer-const': 'error',

      // Imports
      'import/prefer-default-export': 'off',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],

      'no-unused-expressions': 'off',
      'no-prototype-builtins': 'off',

      // React
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/href-no-hash': [0],
      'react/display-name': 0,
      'react/no-deprecated': 'error',
      'react/no-unsafe': [
        'error',
        {
          checkAliases: true,
        },
      ],
      'react/jsx-sort-props': [
        'error',
        {
          ignoreCase: true,
        },
      ],
      'react/function-component-definition': [
        2,
        { namedComponents: 'function-declaration' },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 0,

      // unused imports & vars
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Typescript
      '@typescript-eslint/no-explicit-any': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
