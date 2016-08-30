const milieu = require('milieu');

const config = milieu('task-plan', {
  environment: 'dev',
  server: {
    port: 8122
  },
  mongo: {
    url: 'mongodb://47.89.24.196/taskdb'
  }
});


module.exports = config;
