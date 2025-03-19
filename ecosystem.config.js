module.exports = {
  apps: [
    {
      name: 'dumpmail-backend-1',
      script: 'npm',
      args: 'run start',
      autorestart: true,
      watch: false,
      env: {
        PORT: 3001,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'dumpmail-backend-2',
      script: 'npm',
      args: 'run start',
      autorestart: true,
      watch: false,
      env: {
        PORT: 3002,
        NODE_ENV: 'production',
      },
    },
  ],
};
