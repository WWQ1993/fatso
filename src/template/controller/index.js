/**
 * todo list:
 * 1. 校验同list内字段名不能重名
 * 2.
 * 3. 编辑页面，未保存新建而切入新建的下级所产生的问题
 * 4.
 *
 */

'use strict';

import Base from './base.js';

var XLSX= require('xlsx');

export default class extends Base {

  // path:/template 响应html
  indexAction() {
    return this.display();
  };

  //path:/template/list 获取所有模板，按照id倒序
  * listAction() {
    let template = this.model("template");
    let data = yield template.order("id DESC").select();
    return this.success(data)
  };

//path:/template/[id:number] get id=id的模板及template_id=id的字段
  async templateAction() {
    let id = this.get('id'),
      template = this.model("template"),
      field = this.model("field"),
      data = {};
    data.template = await template.where({id}).find();
    data.field = await field.where({template_id: id}).select();
    return this.success(data)
  }

  // path:/template/update  post 增加、删除、修改字段信息；修改父字段的描述或者模板名称。
  async updateAction() {
    var data = JSON.parse(this.http._post.data);
    var add = data['add'],
      modi = data['modi'],
      del = data['del'],
      title = data['title'],
      template = this.model("template"),
      field = this.model("field");

    //添加
    for (let i of add) {
      delete i.id;
    }
    if (add.length > 0) {
      await field.addMany(add);
    }
    //修改
    for (let i of modi) {
      var id = i.id;
      await field.where({id}).update(i);
    }
    //删除
    var tid = null;
    if (del.length) {
      tid = await field.field(['template_id']).where({id: del[0]}).find()
      await field.where({id: ['IN', del]}).delete();
    }
    tid = tid && tid['template_id']
    if (tid) {
      //  异步任务：遍历模板id为被删除字段所属模板id的所有field，在内存中找到没有父节点的数据，并删除数据库中对应数据
      setTimeout(async function () {
        var arr = await field.field(['id', 'parent_id']).where({template_id: tid}).select();

        var otherArr = [];
        for (var i = 0; i < arr.length; i++) {
          var obj = arr[i];
          if (obj.parent_id === 0) {
            otherArr.push(arr.splice(i, 1)[0]);
            i--;
          }
        }
        for (var j = 0; j < otherArr.length; j++) {
          var ob = otherArr[j],
            id = ob['id'];

          for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            if (obj.parent_id === id) {
              otherArr.push(arr.splice(i, 1)[0]);
              i--;
            }
          }
        }
        var idArr = [];
        for (var i = 0; i < arr.length; i++) {
          idArr.push(arr[i]['id']);
        }

        if (idArr.length)
          field.where({id: ["IN", idArr]}).delete();

      }, 1000)
    }
    //改title
    if (title.type === 'main') {
      await template.where({id: title.id}).update({name: title.val});
    }
    else {
      await field.where({id: title.id}).update({d_desc: title.val});
    }
    return this.success()
  }

  // path:/template/add post 添加name=name的模板
  async addAction() {
    var name = this.http._post.name;
    var id = await this.model("template").add({name});
    return this.success({id})
  }

  // path:/template/delete post 删除id=id的模板；template_id=id的模板。
  async deleteAction() {
    var id = this.http._post.id;
    var tNum = await this.model("template").where({id}).delete(),
      dNum = await this.model("data").where({template_id: id}).delete()
    return this.success({deletedTemplateNum: tNum, deletedDataNum: dNum})
  }

  async dataAction() {
    var tid = this.get('tid'),
      data = this.model("data")

    var arr = await data.field(['alias']).where({template_id:tid}).select();
    return this.success(arr)
  }
  async uploadAction(){
    var file =this.http.file("excel");
    var path = file.path;
    var workbook = XLSX.readFile(path);
    const sheetNames = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheetNames[0]];
    const json =XLSX.utils.sheet_to_json(worksheet);

    var id =parseInt((Date.now() + Math.random()) * 100);


    console.log(json,'22 222 22 22 22 222 222 22')

    this.http.redirect('/template')
  }
}
