module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  root: true,
  rules: {
    "indent": ['error', 2],
    "semi": ["error", "never"],
    "comma-dangle": ["error", "always-multiline"],
    "prefer-arrow-callback": ["error"],
  },
}
