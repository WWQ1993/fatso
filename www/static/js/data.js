/**
 * Created by wwq on 16/11/24.
 */
var variable = {
    list: null,
    edit: {
      dataAlias: '',  //数据别名，置于页面顶部，可被修改
      path: [], //当前路径，同步存于localstorage
      currentPid: [], //当前路径的模板id，同步存于localstorage
      fieldList: [],  //当前页的字段列表
      deletedTrList: [],  //被删除的行列表
      addTrList: [],  //缓存添加的行列表，以待提交服务器
      json: '', //数据的json字段
      field: null,  //数据的field字段
      data: null, //数据整体
      renderDataList: [],   //初始化渲染的数据列表，用以判断是否删除了服务器行数据，而非未保存行数据
      dirty: false, //脏标识
    }
  },
  //路由
  router = {
    hash: null,//保存当前路由值
    //初始化路由：绑定window的hashchange事件
    init: function () {
      $(window).on('hashchange', router.controller);
    },
    //清楚localstorage状态
    clearLocalStorage: function () {
      delete localStorage.path;
      delete localStorage.currentPid;
    },
    //修改pid和path
    goBack: function () {
      var popPath = function () {
        var path = variable.edit.path,
          pid = variable.edit.currentPid;
        if (pid.length > 1) {
          path.pop();
          pid.pop();
          variable.edit.currentPid = pid;
          variable.edit.path = path;
        }
        // 跳回list页面
        else {
          router.change('list');
          method.edit.clearList();
          router.clearLocalStorage();
        }

      };
      // 判断是否修改过数据，进行提醒
      method.edit.checkDirty();
      if (variable.edit.dirty) {
        var r = confirm("修改未保存，是否离开此页");
        if (r == true) {
          popPath()
        }
      }
      else {
        popPath()
      }
    },
    //改变路由
    change: function (newHash) {
      method.edit.checkDirty();
      if (variable.edit.dirty) {
        var r = confirm("修改未保存，是否离开此页");
        if (r == true) {
          window.location.hash = "!" + newHash;
        }
      }
      else {
        window.location.hash = "!" + newHash;
      }
    },
    // 获取数据id
    getDataId: function () {
      return router.hash.split('/')[1];
    },

    // hashchange回调函数
    controller: function () {
      //清除脏标志
      variable.edit.dirty = false;

      // 获取hash内容
      var hash = window.location.hash && window.location.hash.split('#!')[1];
      hash = hash && hash.replace(/\/+/g, '/');
      var paramArr = hash.split('/'); //[0]:'data',[1]:数据id

      //显示编辑页面
      if (hash && hash.indexOf('edit') > -1) {
        //无数据id，跳回list
        if (!paramArr[1]) {
          router.hash = hash;
          router.change('list');
          return;
        }
        method.edit.showEdit();
        method.edit.getData_fields(paramArr[1], function () {
          method.edit.showField();
          method.edit.renderData();
        });

      }
      // 显示列表页面
      else {
        router.clearLocalStorage()
        method.list.showList();
      }
      router.hash = hash;
    }
  },
  method = {
    about:function () {
      alert('powered by 吴万强:wwqin1993@163.com')
    },
    edit: {
      //清除临时数据
      clearList: function () {
        variable.edit.addTrList = [];
        variable.edit.deletedTrList = [];
        variable.edit.renderDataList = [];
      },

      // 点击修改列表按钮的回调函数，判断当前修改是否保存，然后改变path和currentPid，引发重绘
      editListHandler: function (e) {
        var $td = $(e).parents('td'),
          $tr = $td.parent(),
          colIndex = $tr.index() - 1,
          rowIndex = $td.index() - 1,
          field_name = variable.edit.fieldList[rowIndex]['field_name'],
          pid = variable.edit.fieldList[rowIndex]['id'],
          path = variable.edit.path,
          parent_id = variable.edit.currentPid,
          changePath_Pid = function () {
            path.push([colIndex, field_name]);
            parent_id.push(pid);
            variable.edit.currentPid = parent_id;
            variable.edit.path = path;
          };

        method.edit.checkDirty();
        if (variable.edit.dirty) {
          var r = confirm("修改未保存，是否离开此页");
          if (r == true) {
            changePath_Pid();
          }
        }
        else {
          changePath_Pid();
        }
      },
      //选中某行，进行class的添加和删除操作
      chooseLine: function (e) {
        var $td = $(e),
          $tr = $td.parent();
        $('.choosedLine').removeClass('choosedLine');
        $tr.addClass('choosedLine');
      },
      //添加数据回调函数，渲染一行。object：填充的数据。newAdd：新增而非还原。不能由object判断newAdd。
      addLine: function (object, newAdd) {
        var length = variable.edit.fieldList.length,
          str = '<td class="chooseAble" onclick="method.edit.chooseLine(this)"><span class="data-delete glyphicon ' +
            'glyphicon-remove" onclick="method.edit.deleteLine(this)"></span><span>数据</span></td>',
          id = parseInt(Math.random() * 100000);
        for (var i = 0; i < length; i++) {
          //字段类型为list
          if (variable.edit.fieldList[i].d_type === 'list') {
            str += '<td contenteditable="true"><button type="button" class="btn btn-default btn-sm " ' +
              ' onclick="method.edit.editListHandler(this)"> <span class="glyphicon glyphicon-list"></span> </button></td>';
          }
          //字段类型为text
          else {
            var val = (object && object[variable.edit.fieldList[i].field_name]) || '';
            str += '<td class="check-value-val" contenteditable="true" data-value="' + encodeURIComponent(val) + '" onkeyup="method.edit.checkDirty()" onblur="method.edit.checkDirty()">' + val + '</td>';
          }

        }
        str = '<tr data-id="' + id + '" class="tr-data">' + str + '</tr>';

        // 如果有选中行，则在该行下新建
        if ($('.choosedLine').length > 0) {
          $('.choosedLine').after(str);
        }
        else {
          $('table tbody').append(str);
        }

        // 存入缓存，以待提交服务器
        if (newAdd) {
          variable.edit.addTrList.push(id + '')
        }
        if (!object) {
          method.edit.checkDirty();
        }
      },
      //删除数据按钮回调函数，删除dom并在添加队列中删除或者加入删除队列以待提交
      deleteLine: function (e) {
        var targetLine = $(e).parents('tr');

        targetLine.remove();

        var id = targetLine.attr('data-id'),
          index = variable.edit.renderDataList.indexOf(id),
          addIndex = variable.edit.addTrList.indexOf(id);
        // 在添加队列中删除
        if (addIndex > -1) {
          variable.edit.addTrList.splice(addIndex, 1);
        }
        // 加入删除队列以待提交
        else if (index > -1) {
          variable.edit.deletedTrList.push(index);
          variable.edit.renderDataList.splice(index, 1);
        }
        method.edit.checkDirty();
        return false;
      },

      //检查是否有更改,根据三个方面：1.类名为check-value-val的数据值是否和其data-value值不一样；2.是否有添加提交；3.是否有删除提交。
      checkDirty: function () {
        var valChange = false;
        $('.check-value-val').each(function () {
          if ($(this).text() !== decodeURIComponent($(this).attr('data-value'))) {
            valChange = true;
            return false;
          }
        });
        variable.edit.dirty = valChange || !!variable.edit.addTrList.length || !!variable.edit.deletedTrList.length;
        return variable.edit.dirty;
      },

      //根据参数和当前数据、当前字段进行合并
      spliceData: function (arg) {
        var obj = JSON.parse(variable.edit.json),
          pathArr = variable.edit.path,
          pointer = obj,
          whiteList = (function () {
            var list = [],
              fieldList = variable.edit.fieldList;
            for (var i = 0; i < fieldList.length; i++) {
              var obj = fieldList[i];
              list.push(obj['field_name']);
            }
            return list;
          })(),
          extend = function (originArr, newArr) {
            originArr = originArr || [];
            var list = variable.edit.deletedTrList;
            for (var j = 0; j < list.length; j++) {
              originArr.splice(list[j], 1);
            }
            //根据模板字段，清除冗余数据
            for (var i = 0; i < originArr.length; i++) {
              var obj = originArr[i];
              for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                  if (whiteList.indexOf(name) < 0) {
                    delete obj[name];
                  }
                }
              }
            }
            return $.extend(true, originArr, newArr);
          };
        if (pathArr.length) {
          //根据path定位到路径下的数据
          for (var i = 0; i < pathArr.length - 1; i++) {
            var innerArr = pathArr[i];
            pointer = pointer[innerArr[0]][innerArr[1]];
          }
          var lastArr = pathArr[pathArr.length - 1];
          var originObj = pointer[lastArr[0]][lastArr[1]];
          pointer[lastArr[0]][lastArr[1]] = extend(originObj, arg);
          return obj;
        }
        else {
          return extend(obj, arg);
        }
      },

      //遍历dom并保存
      saveList: function () {
        method.edit.checkDirty()
        if (!variable.edit.dirty) {
          return
        }
        //遍历表格，获取本级text数据，子list内数据在下级保存
        var dataTrList = $('tr.tr-data'),
          result = [];
        dataTrList.each(function (j, el) {
          result[j] = {};
          $(el).find('td:not(:first-child)').each(function (i, e) {
            var field = variable.edit.fieldList[i];
            if (field.d_type !== 'list') {
              result[j][field.field_name] = $(e).text();
            }
          });
        });
        result = method.edit.spliceData(result);

        var alias = $('.data-alias').text();
        //保存到服务器
        $.ajax({
          method: 'POST',
          url: '/data/update',
          data: {
            id: router.getDataId(),
            alias: alias,
            json: JSON.stringify(result)
          },
          dataType: 'json',
          success: function (e) {
            if (!e.errno) {
              variable.edit.json = JSON.stringify(result)
              method.edit.clearTableData();
              method.edit.renderData();
              variable.edit.dataAlias = alias;
              method.edit.checkDirty();
            }
          }
        })


      },
      clearTableData: function () {
        $('tr.desc').siblings().remove();
        method.edit.clearList();
      },

      showEdit: function () {
        $('.main').html($('#edit').html());
      },
      getData_fields: function (id, cb) {
        $('html').addClass('loading');
        $.ajax({
          method: 'GET',
          url: '/data/' + id,
          dataType: 'json',
          success: function (e) {
            if (!e.errno) {
              variable.edit.data = e.data.data;
              variable.edit.fileds = e.data.field;
              variable.edit.json = e.data.data.json;
              variable.edit.dataAlias = e.data.data.alias;
              $('html').removeClass('loading');
              cb();
            }
          }
        })
      },

      renderData: function () {
        var data = JSON.parse(variable.edit.json);
        var path = variable.edit.path;

        method.edit.clearList();

        //获取子数据
        for (var i = 0; i < path.length; i++) {
          var arr = path[i];
          data = data[arr[0]][arr[1]];
        }
        if (data) {
          $.each(data, function (i, e) {
            method.edit.addLine(e)
          })
          $('.tr-data').each(function (e) {
            var id = $(this).attr('data-id');
            variable.edit.renderDataList.push(id);
          })
          method.edit.checkDirty();
        }


      },
      showField: function () {
        var pid = variable.edit.currentPid[variable.edit.currentPid.length - 1];
        var list = (function getListByPid() {
          return variable.edit.fileds.filter(function (item) {
            return +item.parent_id === +pid;
          })
        })();

        variable.edit.fieldList = list;

        var str = '',
          fieldNameStr = '',
          aliasStr = '',

          title = variable.edit.dataAlias + ' / ' + method.edit.flattenMd(variable.edit.path).join(' / ');

        for (var i = 0; i < list.length; i++) {
          fieldNameStr += '<th>' + list[i]['field_name'] + '</th>';
          aliasStr += '<td>' + (list[i]['d_desc'] || '空') + '</td>';
        }

        str += '  <h4 class="sub-header table-title">' + title + '</h4>' +
          '        <table border="1px solid grey">' +
          '          <thead>' +
          '          <tr>' +
          '             <th>字段名</th>' + fieldNameStr +
          '          </tr>' +
          '          </thead>' +
          '          <tbody>' +
          '          <tr class="desc">' +
          '            <td>描述</td>' + aliasStr +
          '          </tr>' +
          '          </tbody>' +
          '        </table>';

        $('.inner-main').html(str)

      },
      flattenMd: function (arr) {
        var result = [];

        function flatten(arr) {
          for (var i = 0; i < arr.length; i++) {
            if
            (Array.isArray(arr[i])) {
              flatten(arr[i]);
            } else {
              result.push(arr[i]);
            }
          }
        }

        flatten(arr);
        return result;
      },
    },
    list: {
      getURL: function (id) {
        var url = window.location.origin + '/jsonp/' + id;
        var name = prompt("当前数据地址为", url)
      },
      search: function () {
        var text = $('.search-text').val();
        var newArr = [],
          list = variable.list,
          length = list.length;
        for (var i = 0; i < length; i++) {
          if (list[i]['alias'].indexOf(text) > -1) {
            newArr.push(list[i])
          }
        }
        method.list.showListArea(newArr)
      },
      showList: function () {
        $('.main').html($('#list').html());
        method.list.getList();
      },
      getList: function () {
        $('html').addClass('loading');
        $.ajax({
          method: 'GET',
          url: '/data/list',
          dataType: 'json',
          success: function (e) {
            if (!e.errno) {
              variable.list = e['data'];
              $('html').removeClass('loading');
            }
          }
        })
      },
      showListArea: function (list) {
        var str = '';
        for (var i = 0; i < list.length; i++) {
          str += '<li class="list-group-item" data-tid =' + list[i]["template_id"] + ' data-index="' + i + '" data-id="' +
            list[i]['id'] + '">' +
            '            <button type="button" style="margin-right: 2rem;" onclick="method.list.deleteData(' +
            list[i]['id'] + '); " class="btn btn-default btn-sm">' +
            '              <span class="glyphicon glyphicon-remove"></span>' +
            '            </button>' +
            '            <span>' + list[i]['alias'] + '</span>' +
            '            <button type="button" style="margin-left: 2rem;" onclick="router.change(\'edit/' + list[i]['id'] + '\');" class="btn btn-default btn-sm">' +
            '              <span class="glyphicon glyphicon-pencil"></span>' +
            '            </button>' +
            '            <button type="button" style="margin-left: 2rem;" onclick="method.list.getURL(' +
            list[i]['id'] + ')" class="btn btn-default  btn-sm">' +
            '              <span class="glyphicon glyphicon-floppy-save"></span>' +
            '            </button>' +
            '          </li>';
        }
        $('.list-area').html(str);
      },
      chooseTemplate: function () {
        // if()
        $('.baffle').show();
      },
      closeChooseTemplate: function () {
        $('.baffle').hide();
      },
      initTemplateList: function () {
        $.ajax({
          method: 'GET',
          url: '/template/list',
          dataType: 'json',
          success: function (e) {
            if (!e.errno) {
              var list = e.data,
                str = '',
                length = list.length;
              if(length){
                for (var i = 0; i < length; i++) {
                  str += '<li data-id="' + list[i]['id'] + '" onclick="method.list.addData(' + list[i]['id'] + ',\''+list[i]['name']+'\')"' +
                    ' class="list-group-item">' + list[i]['name'] + '</li>'
                }
                $('.template-list').html(str);

                $('.listInner-area h4').text('请选择模板')
              }
              else{
                $('.listInner-area h4').text('请先建立模板')

              }

            }
          }
        })
      },
      addData: function (tid,tName) {
        var name = prompt("请输入数据名字", "模板-"+tName+"-默认数据名称_" + parseInt(Math.random() * 10000))
        if (name != null && name != "") {
          $.ajax({
            method: 'POST',
            data: {tid: tid, alias: name},
            url: '/data/add',
            dataType: 'json',
            success: function (e) {
              if (!e.errno) {
                method.list.closeChooseTemplate();
                method.list.getList();
              }
            }
          })
        }
      },
      deleteData: function (id) {
        var re = confirm('确认删除此数据？');
        if (re) {
          $.ajax({
            method: 'POST',
            data: {id: id},
            url: '/data/delete',
            dataType: 'json',
            success: function (e) {
              if (!e.errno) {
                method.list.getList();
              }
            }
          })
        }
      },
    },


    defineProperty: function () {
      var list = null,
        dirty = false,
        path = [],
        currentPid = [0],
        dataAlias = '';

      Object.defineProperty(variable, 'list', {
        configurable: true,
        enumerable: true,
        get: function () {
          return list
        },
        set: function (val) {
          list = val;
          method.list.showListArea(val);
        }
      });

      Object.defineProperty(variable.edit, 'dirty', {
        configurable: true,
        enumerable: true,
        get: function () {
          return dirty
        },
        set: function (val) {
          var $alert = $('.dirty-alert'),
            $btn = $('.btn-save');

          dirty = val;
          if (dirty) {
            $alert.removeClass('alert-success');
            $alert.addClass('alert-warning');
            $alert.text('更改未保存');
            $btn.removeClass('btn-default');
            $btn.addClass('btn-success');
          }
          else {
            $alert.addClass('alert-success');
            $alert.removeClass('alert-warning');
            $alert.text('数据未改动');
            $btn.removeClass('btn-success');
            $btn.addClass('btn-default');
          }
        }
      });
      Object.defineProperty(variable.edit, 'path', {
        configurable: true,
        enumerable: true,
        get: function () {
          if (path.length > 0)
            return path;
          else {
            var lPath = window.localStorage.path;
            return lPath ? JSON.parse(lPath) : []
          }
        },
        set: function (val) {
          path = val;
          window.localStorage.path = JSON.stringify(val);
          method.edit.showField();
          method.edit.renderData();

        }
      });
      Object.defineProperty(variable.edit, 'currentPid', {
        configurable: true,
        enumerable: true,
        get: function () {
          if (currentPid.length > 1)
            return currentPid;
          else {
            var pid = window.localStorage.currentPid;
            currentPid = pid ? JSON.parse(pid) : [0]
            return currentPid;
          }
        },
        set: function (val) {
          currentPid = val;
          window.localStorage.currentPid = JSON.stringify(val);

        }
      });

      Object.defineProperty(variable.edit, 'dataAlias', {
        configurable: true,
        enumerable: true,
        get: function () {
          return dataAlias;
        },
        set: function (val) {
          dataAlias = val;
          $('.data-alias').text(val);
          $('.data-alias').attr('data-value', encodeURIComponent(val));
          $('.table-title').text(variable.edit.dataAlias + ' / ' +
            method.edit.flattenMd(variable.edit.path).join(' / '))
        }
      });
    }
  };

!function main() {
  router.init();
  method.defineProperty();
  $(window).trigger('hashchange');
  method.list.initTemplateList();
}()
