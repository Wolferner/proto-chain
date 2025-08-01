// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/*.js'],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // I need disabled perfectionist/sort-switch-case rule
  // perfectionist.configs['recommended-natural'],
  // {
  //   rules: {
  //     'perfectionist/sort-switch-case': 'off',
  //     '@typescript-eslint/restrict-template-expressions': 'off',
  //   },
  // },
);
