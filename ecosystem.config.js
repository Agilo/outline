/* eslint-disable flowtype/require-valid-file-annotation */
module.exports = {
  apps: [
    {
      name: 'agilo-handbook',
      script: 'build/server/index.js',
      watch: '.',
      env: {
        NODE_ENV: 'production',
        URL: 'https://handbook.agilo.co',
        PORT: 3000,
        GOOGLE_ALLOWED_DOMAINS: 'agilo.co',
      },
    },
    {
      name: 'split-techcity-handbook',
      script: 'build/server/index.js',
      watch: '.',
      env: {
        NODE_ENV: 'production',
        URL: 'https://handbook.split-techcity.com',
        PORT: 4000,
        GOOGLE_ALLOWED_DOMAINS: 'split-techcity.com',
      },
    },
  ],
};
