module.exports = {
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
  }
}
