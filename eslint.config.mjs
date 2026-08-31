import withNuxt from './.nuxt/eslint.config.mjs'

const MAGIC_ALLOW = [-1, 0, 1, 2]

export default withNuxt(
  {
    rules: {
      'func-style': ['error', 'expression'],
      'id-length': ['error', { min: 3, exceptions: ['to', 'as', 'id', '_'] }],
      'no-magic-numbers': [
        'warn',
        { ignore: MAGIC_ALLOW, ignoreArrayIndexes: true },
      ],
    },
  },
  {
    files: ['app/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: ['../*', './*'] }],
    },
  },
  {
    files: ['tests/**/*.ts', 'scripts/**/*.mjs', '*.config.{ts,mjs}'],
    rules: {
      'no-magic-numbers': 'off',
      'no-restricted-imports': 'off',
    },
  },
)
