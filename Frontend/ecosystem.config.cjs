/* eslint-disable camelcase */
/* eslint-disable no-undef */
module.exports = {
  apps: [
    {
      name: 'scs-system',
      script: './build/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: ['192.168.0.13', '192.168.0.14', '192.168.0.15'],
      ref: 'origin/master',
      repo: 'git@github.com:Username/repository.git',
      path: '/var/www/my-repository',
      'post-deploy': 'npm install',
    },
  },
}
