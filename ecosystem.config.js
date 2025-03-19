module.exports = {
  apps: [
    {
      name: 'dumpmail-backend',
      script: 'npm',
      args: 'run start',
      exec_mode: 'cluster',
      instances: '2',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
