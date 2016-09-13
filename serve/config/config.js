const milieu = require('milieu');

const config = milieu('task-plan', {
  environment: 'dev',
  server: {
    port: 8122
  },
  mongo: {
    url: 'mongodb://task:task@ds147995.mlab.com:47995/taskdb'
  },
  secret:'jiangnandadao3588'
});


module.exports = config;
