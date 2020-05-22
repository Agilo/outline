/* eslint-disable flowtype/require-valid-file-annotation */
module.exports = {
  apps: [
    {
      script: 'index.js',
      watch: '.',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
