'use strict';

import Base from './base.js';
var fs = require("fs");

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  getClientIP=function(http){
    var req=http.req;
    return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  }
  indexAction() {
    //获取客户端ip
    console.log(this.getClientIP(this.http))
    //auto render template file index_index.html
    return this.display();

  }

  descAction() {
    var name = this.get('name')
    return this.display(think.ROOT_PATH + "/view/home/desc/" + name + ".html");
  }

  getData(fileDirectory) {
    var data = [];
    return new Promise((resolve, reject) => {

      if (fs.existsSync(fileDirectory)) {
        fs.readdir(fileDirectory, function (err, files) {
          if (err) {
            console.log('error:  ' + err);
            return;
          }
          resolve(files);

        });
      }
      else {
        console.log(fileDirectory + "  Not Found!");
      }

    }).then((files) => {


      return new Promise((resolve, reject) => {
        for (let i = 0; i < files.length; i++) {
          let filename = files[i];

          fs.readFile(fileDirectory + filename, function (err, d) {
            d = d.toString();
            var titleText = function (str) {
              var arr = str.match(/<title>(.+)<\/title>/);
              return arr[1];
            }(d);
            var obj = {};
            obj.date = titleText.slice(0, 8);
            obj.title = titleText.slice(8)||'工作技术小结';
            obj["content"] = d;

            data.push(obj);

            fs.rename(fileDirectory + filename, fileDirectory + obj.date +obj.title+'.html')

            if (i + 1 === files.length) {
              resolve(data);
            }
          });
        }

      });

    }).then((data) => {
      data.sort(function (before, after) {
        return   +after.date - +before.date;
      });
      return data;
    }).catch((err) => {

    })

  }

  async essayAction() {


    var data = await this.getData(think.ROOT_PATH + "/view/home/essay/");

    this.assign('data', data);
    return this.display(think.ROOT_PATH + "/view/home/essay.html");
  }

}
