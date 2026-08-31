import withNuxt from './.nuxt/eslint.config.mjs'

// -1..2 are the plan's bare-allowed set; 3 covers heading levels (h1–h3).
const MAGIC_ALLOW = [-1, 0, 1, 2, 3]

export default withNuxt(
  {
    rules: {
      'func-style': ['error', 'expression'],
      'id-length': [
        'error',
        { min: 3, properties: 'never', exceptions: ['to', 'as', 'id', 't', '_'] },
      ],
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers': [
        'warn',
        {
          ignore: MAGIC_ALLOW,
          ignoreArrayIndexes: true,
          ignoreNumericLiteralTypes: true,
          ignoreEnums: true,
          ignoreReadonlyClassProperties: true,
        },
      ],
    },
  },
  {
    files: ['app/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: ['../*', './*'] }],
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off',
    },
  },
  {
    files: ['tests/**/*.ts', 'scripts/**/*.mjs', '*.config.{ts,mjs}'],
    rules: {
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      'no-restricted-imports': 'off',
    },
  },
  {
    // constants.ts files are the designated home for tuning literals.
    files: ['app/**/model/constants.ts', 'app/**/*/constants.ts'],
    rules: {
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
    },
  },
)
