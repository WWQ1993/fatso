'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {
  /**
   * index action logic
   * @return {} []
   */
  indexAction(){

  }
  tableAction(){
    this.allowMethods = "post"; //只允许 GET 和 POST 请求类型
  }
}
