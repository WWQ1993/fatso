'use strict';

import Base from './base.js';

export default class extends Base {

  // path:/data 响应html
  indexAction() {
    return this.display();
  };

  // path:/data/list 获取所有数据，按照id倒序
  async listAction() {
    let data = this.model("data");
    let list = await data.order("id DESC").field(['id', 'alias']).select();

    return this.success(list)
  };

//path:/data/[id:number] get id=id的数据及template_id=（数据内template_id）的字段
  async dataAction() {
    let id = this.get('id'),
      data = this.model("data"),
      template = this.model("template"),
      field = this.model("field"),
      result = {};
    result.data = await data.where({id}).find();
    result.field = await field.where({template_id: result.data.template_id}).select()
    return this.success(result)
  }

  // path:/data/update  post 修改数据的json、alias值
  async updateAction() {
    var id = this.http._post.id,
      alias = this.http._post.alias,
      json = this.http._post.json,
      data = this.model("data");
    await data.where({id}).update({alias, json});
    return this.success('success');
  }

  // path:/data/add post 添加template_id=template_id，alias=alias，json='[]'的数据
  async addAction() {
    var template_id = this.http._post.tid;
    var alias = this.http._post.alias;
    var id = await this.model("data").add({template_id, alias, json: '[]'});
    return this.success({id})

  }

  // path:/data/delete post 删除id=id的数据。
  async deleteAction() {
    var id = this.http._post.id;
    var id = await this.model("data").where({id}).delete();
    return this.success({id})
  }

  // path:/data/json/[id:number] 获取id=id的数据。
  async jsonAction() {
    let id = this.get('id'),
      data = this.model("data"),
      res = await data.where({id}).find();
    this.http.header('Access-Control-Allow-Origin','*');
    this.http.header("Access-Control-Allow-Methods", "POST, GET");
    this.http.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    return this.success(res)
  }

  // path:/data/json/[id:number] 获取id=id的数据。
  async jsonpAction() {
    let id = this.get('id'),
      data = this.model("data"),
      res = await data.where({id}).find();
    // this.http.header('Access-Control-Allow-Origin','*');
    // this.http.header("Access-Control-Allow-Methods", "POST, GET");
    // this.http.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    // console.log( res ,this.jsonp(res))
    return this.jsonp(res)
  }
}
