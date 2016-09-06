const milieu = require('milieu');

const config = milieu('task-plan', {
  environment: 'dev',
  server: {
    port: 8122
  },
  mongo: {
    url: 'mongodb://task:task@ds019876.mlab.com:19876/taskdb'
  },
  secret:'jiangnandadao3588'
});


module.exports = config;
