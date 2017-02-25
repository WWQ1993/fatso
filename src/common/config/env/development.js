'use strict';

export default {
  db:{
    type: 'mysql',
    adapter: {
      mysql: {
        host: '127.0.0.1',
        port: '3306',
        database: 'dbchr_content_platform',
        user: 'root',
        password: '2wsx3edc',
        prefix: 'think_',
        encoding: 'utf8'
      },
    }
  }
};
