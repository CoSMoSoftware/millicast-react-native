module.exports = {
  root: true,
  plugins: [
    'import'
  ],
  extends: [
    'standard',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended'
  ],
  settings: {
    react: {
      version: '16.4.1'
    }
  },
  overrides: [
    {
      files: '*',
      rules: {
        'react/display-name': 'off'
      }
    }
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  }
}
