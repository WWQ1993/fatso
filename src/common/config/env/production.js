'use strict';

export default {
  db:{
    type: 'mysql',
    adapter: {
      mysql: {
        host: 'content-platform.db.chrdns.org',
        port: '3051',
        database: 'dbchr_content_platform',
        user: 'platform_admin',
        password: '2f1bb7f0220b0db7',
        prefix: 'think_',
        encoding: 'utf8mb4'
      },
      mongo: {

      }
    }
  }
};
