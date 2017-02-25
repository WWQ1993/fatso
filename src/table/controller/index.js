'use strict';

import Base from './base.js';

async function getAllSubDatas(str, model,control,data) {
  var subData = [],
    idArr = [],
    gen = null;
  // async function inner(str) {
  //   var items = str.match(/\{\{\d*\}\}/g);
  //   for (let item of items) {
  //     let id = item.match(/\d+/)[0];
  //     console.log('---------------', id)
  //     if (idArr.indexOf(id) < 0) {
  //       idArr.push(id);
  //       let data = await model.where({tid: id}).find();
  //
  //       let val = data.val;
  //       data.val = JSON.parse(val);
  //       subData.push(data);
  //         console.log(   '===============')
  //
  //       await inner(val);
  //     }
  //   }
  //   console.log('eeeeeeeeeeeeee  eeeeeeeeeee')
  // }
  // await inner(str);

  function * inner(str) {
    var items = str.match(/\{\{\d*\}\}/g);
    for (let item of items) {
      let id = item.match(/\d+/)[0];
      console.log('---------------', id)
      if (idArr.indexOf(id) < 0) {
        idArr.push(id);
        let data = yield model.where({tid: id}).find().then(function (data){
          gen.next(data);
        });
        let val = data.val;
        data.val = JSON.parse(val);
        subData.push(data);
        console.log('===============')

        yield inner(val);

      }
    }
    var re =gen.next();
    console.log(re.done)
    if(re.done){

      data.subTables =subData;

        control.assign('data', data);

      return control.display();
    }
  }

  gen = inner(str);

 console.log( gen.next())
}


export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    let tid = this.get('tableid')
    if (!tid) {
      this.assign('data', null);
      return this.display();
    }
    var data = {}
    let model = this.model("tables");
    let mainData = await model.where({tid}).find();
    if (think.isEmpty(mainData)) {
      this.http.redirect('/');
      this.assign('data', data);

      return this.display();
    }
    else {
      let val = mainData.val;
      mainData.val = JSON.parse(val);
      data.main = mainData
      // console.log(mainData,val)
      await getAllSubDatas(val, model,this,data)

    }

    // var data = {
    //   main: {
    //     tid: '34f33r',
    //     alias: 'fistTable',
    //     val: {
    //       bannerImg: '/head.png',
    //       date: '10.10-11.00',
    //       items: '{{34234}}'
    //     }
    //   },
    //   subTables: [
    //     {
    //       tid: 34234,
    //       alias: 'secTable',
    //       val: [
    //         {
    //           bannerImg: '/head.png',
    //           date: '10.10-11.00',
    //           items: '{{123}}'
    //         },
    //         {
    //           bannerImg: '/head.png',
    //           date: '10.10-11.00',
    //           items: '{{123}}'
    //         },
    //       ]
    //     },
    //     {
    //       tid: 123,
    //       alias: 'thirdTable',
    //       val: {
    //         bannerImg: '/head.png',
    //         date: '10.10-11.00',
    //       }
    //     }
    //   ]
    // }

  }

  async tableAction() {
    var postObj = JSON.parse(this.http._post.data),
      tid = postObj['tid'],
      alias = postObj['alias'],
      val = JSON.stringify(postObj['val']);

    let model = this.model("tables");

    let data = await model.where({tid}).find();
    if (think.isEmpty(data)) {
      let insertId = await model.add({tid, alias, val});
      return this.success(insertId);
    }
    else {
      let affectedRows = await model.where({tid}).update({tid, alias, val});

      return this.success(affectedRows);
    }

  }
}
