const milieu = require('milieu');

const config = milieu('task-plan', {
  environment: 'dev',
  server: {
    port: 8122
  },
  mongo: {
    url: 'mongodb://local'host/taskdb'
  }
});


module.exports = config;
