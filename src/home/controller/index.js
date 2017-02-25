'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();

  }
  descAction(){
    var name =this.get('name')
    return this.display(think.ROOT_PATH+"/view/home/desc/"+name+".html");
  }
}
