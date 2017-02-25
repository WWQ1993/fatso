'use strict';

export default {
  db:{
    type: 'mysql',
    host: '10.0.2.15',
    port: '3306',
    name: 'db', // database name
    user: '58chrtest',
    pwd: 'chrtest@123',
    prefix: 'think_',
    encoding: 'utf8',
    nums_per_page: 10,
    log_sql: true,
    log_connect: true,
    cache: {
      on: true,
      type: '',
      timeout: 3600
    }
  }
};
