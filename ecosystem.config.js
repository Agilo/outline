/* eslint-disable flowtype/require-valid-file-annotation */
module.exports = {
  apps: [
    {
      name: 'handbook-outline',
      script: 'index.js',
      watch: '.',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
