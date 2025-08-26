// eslint.config.cjs
const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');
const tseslint = require('typescript-eslint');
const pluginUnusedImports = require('eslint-plugin-unused-imports');
const pluginReact = require('eslint-plugin-react');
const pluginReactHooks = require('eslint-plugin-react-hooks');
const pluginA11y = require('eslint-plugin-jsx-a11y');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
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
      'dot-notation': 'error',
      'no-else-return': 'error',
      'no-floating-decimal': 'error',
      'no-sequences': 'error',
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
      'array-callback-return': 'off',
      'prefer-const': 'error',
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
      '@typescript-eslint/no-explicit-any': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
