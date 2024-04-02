module.exports = {
  apps: [
    {
      name: 'tgbot-valorant',
      script: './dist/bot.js',
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      output: './output.log',
      error: './error.log',
      log_date_format: 'HH:mm:ss DD-MM-YYYY',
      merge_logs: true,
    },
  ],
};
