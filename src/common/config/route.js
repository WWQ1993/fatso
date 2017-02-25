/**
 * Created by wwq on 16/11/14.
 */
export default [
  ['template/list', 'template/index/list'],
  ['template/update', 'template/index/update'],

  ['template/add', 'template/index/add'],
  ['template/delete', 'template/index/delete'],
  ['template/data', 'template/index/data'],
  ['template/upload', 'template/index/upload'],

  [/^template\/(\d+)$/, 'template/index/template?id=:1'],

  ['data/list', 'data/index/list'],
  ['data/update', 'data/index/update'],

  ['data/add', 'data/index/add'],
  ['data/delete', 'data/index/delete'],

  [/^data\/(\d+)$/, 'data/index/data?id=:1'],
  [/^json\/(\d+)$/, 'data/index/json?id=:1'],
  [/^jsonp\/(\d+)$/, 'data/index/jsonp?id=:1'],

];
