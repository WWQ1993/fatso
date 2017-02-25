/**
 * Created by wwq on 16/11/24.
 */
var variable = {
    list: null,
    edit: {
      data: null,
      addTaskQueue: [],
      deleteTaskQueue: [],
      modifyTaskQueue: [],
      dirty: false
    }
  },
  //路由
  router = {
    hash: null,//保存当前路由值
    //初始化路由：绑定window的hashchange事件
    init: function () {
      $(window).on('hashchange', function () {
        var newHash = window.location.hash && window.location.hash.split('#!')[1];
        router.controller(newHash);
      });
    },
    goBack: function () {
      method.edit.checkDirty();
      if (variable.edit.dirty) {
        var r = confirm("修改未保存，是否离开此页");
        if (r == true) {
          window.history.back()
        }
      }
      else {
        window.history.back()
      }
    },
    //改变路由语法糖
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
    getTemplateId: function () {
      return router.hash.split('/')[1];
    },
    //内部方法
    inner: {
      //根据二级id显示不同界面
      showController: function (showId) {
        if (!showId) {
          method.edit.objectToView(variable.edit.data.template, variable.edit.data.field);
        }
        else {
          method.edit.showField(showId)
        }
      }
    },
    controller: function (hash) {
      var oldHash = router.hash,
        oldParamArr = [],
        paramArr = [];

      //清除修改队列
      method.edit.clearQueues();
      variable.edit.dirty = false;


      hash = hash && hash.replace(/\/+/g, '/');
      paramArr = hash.split('/'); //[0]:'edit',[1]:模板id,[2]:字段列表id

      //显示编辑页面
      if (hash && hash.indexOf('edit') > -1) {
        if (!paramArr[1]) { //无模板id，跳回list
          router.hash = hash;
          router.change('list');
          return;
        }

        //之前页面不为编辑页面
        if (!oldHash || oldHash.indexOf('edit') < 0) {
          method.edit.showEdit();
          method.edit.getData_fields(paramArr[1], function () {
            router.inner.showController(paramArr[2]);
          });

        }
        //之前页面是编辑页面
        else {
          oldParamArr = oldHash.split('/');
          //field id改变
          if (oldParamArr[1] !== paramArr[1]) {
            method.edit.getData_fields(paramArr[1], function () {
              router.inner.showController(paramArr[2]);
            });
          }
          else {
            router.inner.showController(paramArr[2]);
          }
        }
      }
      else {
        method.list.showList();
      }
      router.hash = hash;

    }
  },
  method = {
    about:function () {
      alert('powered by 吴万强:wwqin1993@163.com')
    },
    uploadTemplateData:function (event) {
      if($('.input-file')[0].files[0]){

      }else{
        alert('请选择一个文件')
        event.preventDefault();
      }

    },
    addEventListener: function () {

    },
    edit: {
      clearQueues: function () {
        variable.edit.addTaskQueue = [];
        variable.edit.modifyTaskQueue = [];
        variable.edit.deleteTaskQueue = [];
      },

      //检查是否有更改
      checkDirty: function () {
        variable.edit.modifyTaskQueue = [];
        $('.check-value-val').each(function () {
          if ($(this).val() !== $(this).attr('value')) {
            var id = $(this).parents('.item').attr('data-item-id');
            if (variable.edit.modifyTaskQueue.indexOf(+id) < 0 && variable.edit.addTaskQueue.indexOf(+id) < 0) {
              variable.edit.modifyTaskQueue.push(+id);
            }
          }
        });

        variable.edit.dirty = !!variable.edit.modifyTaskQueue.length || !!variable.edit.addTaskQueue.length || !!variable.edit.deleteTaskQueue.length
        return variable.edit.dirty;
      },

      //遍历dom并保存
      saveList: function () {
        method.edit.checkDirty()
        if (!variable.edit.dirty) {
          return
        }
        var addQueue = variable.edit.addTaskQueue,
          modiQueue = variable.edit.modifyTaskQueue,
          add = [],
          modi = [],
          setArr = function (queue, arr) {
            $.each(queue, function (i, id) {
              var $item = $('.item[data-item-id=' + id + ']'),
                type = $item.find('.item-type').attr('data-type'),
                field_name = $item.find('input').eq(0).val(),
                desc = $item.find('input').eq(1).val(),
                parentType = $('.listAreaInfo').attr('data-parent-type'),
                parent_id = parentType === 'main' ? 0 : $('.listAreaInfo').attr('data-id'),
                template_id = router.getTemplateId();
              arr.push({
                id: id,
                d_type: type,
                field_name: field_name,
                d_desc: desc,
                parent_id: parent_id,
                template_id: template_id
              })
            });
          };
        setArr(addQueue, add);
        setArr(modiQueue, modi);

        var title = (function () {
          var type = $('.listAreaInfo').attr('data-parent-type'),
            id = $('.listAreaInfo').attr('data-id'),
            titleVal = $('.inner-title').find('.alias').val();
          return {
            type: type,
            id: id,
            val: titleVal
          }
        }());

        $('html').addClass('loading');

        $.ajax({
          method: 'POST',
          url: '/template/update',
          data: {
            data: JSON.stringify({
                add: add,
                del: variable.edit.deleteTaskQueue,
                modi: modi,
                title: title
              }
            )
          },
          dataType: 'JSON',
          success: function (e) {
            if (!e.errno) {
              $('html').removeClass('loading');

              console.log(e);
              router.hash = '';
              $(window).trigger('hashchange');
            }
          }
        })
      },
      //添加列表或者文本
      addItem: function (type) {
        var parentType = $('.listAreaInfo').attr('data-parent-type'),
          templateId = router.getTemplateId(),
          id = parseInt((Date.now() + Math.random()) * 100),
          parentId = parentType === 'main' ? 0 : $('.listAreaInfo').attr('data-id'),
          item = {
            d_desc: "",
            field_name: "",
            id: id,
            parent_id: parentId,
            template_id: templateId,
            d_type: type
          };
        $('.listAreaInfo').append(method.edit.objectToItemStr(item));
        variable.edit.addTaskQueue.push(id);
        method.edit.checkDirty();

      },
      showEdit: function () {
        $('.main').html($('#edit').html());
      },
      getData_fields: function (id, cb) {
        $('html').addClass('loading');
        $.ajax({
          method: 'GET',
          url: '/template/' + id,
          dataType: 'json',
          success: function (e) {
            if (!e.errno) {
              variable.edit.data = e.data;
              $('html').removeClass('loading');
              cb();
            }
          }
        })
      },

      deleteItem: function (e) {
        var target = $(e),
          $item = target.parents('.item'),
          id = $item.attr('data-item-id'),
          addQueue = variable.edit.addTaskQueue,
          deleteQueue = variable.edit.deleteTaskQueue,
          modiQueue = variable.edit.modifyTaskQueue,
          index1 = addQueue.indexOf(+id),
          index2 = modiQueue.indexOf(+id)
        $item.remove();
        console.log(index1)
        if (index1 > -1) {
          addQueue.splice(index1, 1);
        }
        else {
          deleteQueue.push(+id);
        }

        if (index2 > -1) {
          modiQueue.splice(index2, 1);
        }

        method.edit.checkDirty();
      },
      showField: function (id) {
        var item = null,
          fields = variable.edit.data.field;
        for (var i = 0; i < fields.length; i++) {
          if (+id === fields[i].id) {
            item = fields[i]
          }
        }
        method.edit.objectToView(item, fields);
      },
      objectToItemStr: function (item) {
        var substitutes1 = '',
          substitutes2 = '';
        if (item.d_type === "text") {
          substitutes1 = '<div class="item-type" data-type="text">类型：文本</div>';
          substitutes2 = '<div class=" col-xs-3 ">' + '</div>';

        }
        else {
          substitutes1 = '<div class="item-type" data-type="list">类型：列表</div>';
          substitutes2 = '<div class=" col-xs-3">' +
            '            <div class="input-group">' +
            '              <span class="input-group-addon">编辑列表</span>' +
            '              <button type="button" style="width: 100%;padding: 7px 0;" ' +
            'onclick="router.change(\'edit/' + variable.edit.data.template.id + '/' +
            item.id + '\')"' +
            'class="btn btn-default btn-sm"><span class="glyphicon glyphicon-pencil"></span></button>' +
            '            </div>' +
            '          </div>';

        }
        return ('<div class="item row item-' + item.type + '" data-item-id="' + item.id + '" >' +
        ' <div class="col-xs-1">' +
        '    <button type="button" class="btn btn-default btn-sm " onclick="method.edit.deleteItem(this)">' +
        '      <span class="glyphicon glyphicon-remove"></span>' +
        '    </button>' +
        '  </div>' +
        '  <div class="col-xs-2">' + substitutes1 +
        '  </div>' +
        '  <div class=" col-xs-3 ">' +
        '    <div class="input-group">' +
        '      <span class="input-group-addon">字段名</span>' +
        '      <input type="text" class="form-control check-value-val" onkeyup="method.edit.checkDirty()" onblur="method.edit.checkDirty()" value="' +
        item.field_name +
        '" placeholder="英文、数字、下划线">' +
        '    </div>' +
        '  </div>' +
        '  <div class=" col-xs-3 ">' +
        '    <div class="input-group" >' +
        '      <span class="input-group-addon">描述</span>' +
        '      <input type="text" value="' + item.d_desc +
        '" class="form-control check-value-val" onkeyup="method.edit.checkDirty()" onblur="method.edit.checkDirty()" placeholder="可选">' +
        '    </div>' +
        '  </div>' +
        substitutes2 +
        '</div>');
      },
      objectToView: function (tarObj, srcArray) {
        var str = '',
          parentId = 0,
          changeTitle = function (type, alias) {
            var $type = $('.inner-title').find('.type')
            console.log(('data-' + type))
            $type.text($type.attr('data-' + type))
            $('.inner-title').find('.alias').attr('value', alias);
          }

        if (!tarObj.d_type) { //渲染主模板
          str = '<div class="listAreaInfo" data-id="' + tarObj.id + '" data-parent-type="main">';
          changeTitle('template', tarObj.name);
        }
        else {  //渲染field列表
          str = '<div class="listAreaInfo" data-id="' + tarObj.id + '" data-parent-type="sub">';
          parentId = tarObj.id;
          changeTitle('field', tarObj.d_desc);
        }

        for (var i = 0; i < srcArray.length; i++) {
          var item = srcArray[i];
          if (item.parent_id === parentId) {
            str += method.edit.objectToItemStr(item);
          }
        }
        str += '</div>';
        setTimeout(function () {
          $('.inner-main').html(str)
        }, 20);

      },
    },
    list: {
      search: function () {
        var text = $('.search-text').val();
        var newArr = [],
          list = variable.list,
          length = list.length;
        for (var i = 0; i < length; i++) {
          if (list[i]['name'].indexOf(text) > -1) {
            newArr.push(list[i])
          }
        }
        method.list.showListArea(newArr)
      },
      showList: function () {
        $('.main').html($('#list').html());
        method.list.getList();
      },
      deleteTemplate: function (id) {

        $('html').addClass('loading');
        var deleteT = function () {
          $.ajax({
            method: 'POST',
            url: '/template/delete',
            data: {id: id},
            dataType: 'JSON',
            success: function (e) {
              if (!e.errno) {
                method.list.showList();
              }
            }
          })
        };

        $.ajax({
          url: '/template/data?tid=' + id,
          method: 'GET',
          dataType: 'JSON',
          success: function (e) {
            $('html').removeClass('loading');
            var arr = e.data,
              resArr =[];
            for(var i =0 ;i<arr.length;i++){
              resArr.push(arr[i]['alias']);
            };
            if(resArr.length>0){
              var res = confirm('删除模板将同时删除以下数据：\n\n'+resArr.join('、')+'\n\n是否继续?');
              if (res == true) {
                deleteT();
              }
            }
            else{
              var re = confirm('确认删除此模板？');
              if (re) {
                deleteT();
              }
            }
          }
        });


      },
      getList: function () {
        $('html').addClass('loading');
        $.ajax({
          method: 'GET',
          url: '/template/list',
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
          str += '<li class="list-group-item" data-id="' + list[i]['id'] + '">' +
            '            <button type="button" style="margin-right: 2rem;" onclick="method.list.deleteTemplate(' +
            list[i]['id'] + '); " class="btn btn-default btn-sm">' +
            '              <span class="glyphicon glyphicon-remove"></span>' +
            '            </button>' +
            '            <span>' + list[i]['name'] + '</span>' +
            '            <button type="button" style="margin-left: 2rem;" onclick="method.list.editTemplate(' + +list[i]['id'] + ');" class="btn btn-default btn-sm">' +
            '              <span class="glyphicon glyphicon-pencil"></span>' +
            '            </button>' +
            '          </li>';
        }
        $('.list-area').html(str);
      },
      editTemplate: function (id) {
        $('html').addClass('loading');

        $.ajax({
          url: '/template/data?tid=' + id,
          method: 'GET',
          dataType: 'JSON',
          success: function (e) {
            $('html').removeClass('loading');
            var arr = e.data,
              resArr =[];
            for(var i =0 ;i<arr.length;i++){
              resArr.push(arr[i]['alias']);
            };
            if(resArr.length>0){
              var res = confirm('编辑此模板将影响以下数据：\n\n'+resArr.join('、')+'\n\n是否继续?');
              if(res){
                router.change('edit/' + id);
              }
            }
            else{
              router.change('edit/' + id);
            }
          }
        });
      },

      addTemplate: function () {  //添加模板
        var name = prompt("请输入模板的名字", "默认模板名称_" + parseInt(Math.random() * 10000))
        if (name != null && name != "") {
          $.ajax({
            method: 'POST',
            url: '/template/add',
            data: {name: name},
            dataType: 'JSON',
            success: function (e) {
              if (!e.errno) {
                $('html').removeClass('loading');
                router.change('edit/' + e.data.id);
              }
            }
          })
        }
      },
      importTemplateData:function () {
        $('.baffle').show();
      },
      closeImport:function () {
        $('.baffle').hide();

      }

    },


    defineProperty: function () {
      var list = null,
        dirty = false;
      Object.defineProperty(variable, 'list', {
        configurable: true,
        enumerable: true,
        get: function () {
          return list
        },
        set: function (val) {
          console.log('set fn', val)
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
      })
    }
  };

!function main() {
  router.init();
  method.defineProperty();
  $(window).trigger('hashchange');
}()
