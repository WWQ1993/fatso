/**
 * Created by 万强 on 2016/5/29 0029.
 */
define(function (require, exports, module) {
    var btn = {},
        comp = {},
        firstListStyle = '',
        currentMode = 'READ',
        selectP = null,
        selection = window.getSelection ? window.getSelection() : document.selection,
        tools = {
            getSelectedText: function () {

                if (window.getSelection) {
                    return window.getSelection().toString();
                }
                else {
                    return document.selection.createRange().text.toString();
                }
            },
            showPop: function (type, text, interval) {
                var defaultText = '';
                switch (type) {
                    case 'success':
                        if (!text) {
                            text = '操作成功'
                        }
                        break;
                    case 'fail':
                        text = '操作失败:' + text;
                        break;
                    case 'offline':
                        text = '操作失败：请检查网络连接。';
                        break;


                }
                var node = $('<div class="pop"><span>' + text + '</span></div>');
                comp.wrap.append(node);

                node.css({
                    top: (comp.window.height() - node.height()) / 2
                });
                node.slideDown(interval, function () {
                    setTimeout(function () {
                        node.slideUp(interval, function () {
                            node.remove();
                        })
                    }, interval)
                })

            },

            setFocus: function (node, offset, sp) { //设置焦点
                var sel, range;
                if (window.getSelection && document.createRange) {
                    if (sp) {
                        offset = node.childNodes.length
                    }
                    else {
                        node = node.firstChild;
                    }
                    range = document.createRange();
                    range.selectNodeContents(node);
                    range.collapse(true);
                    range.setStart(node, offset);
                    range.setEnd(node, offset);
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.body.createTextRange) {
                    range = document.body.createTextRange();
                    range.moveToElementText(node);
                    range.collapse(true);
                    range.select();
                }
            },
            creatP: function (data) {

                var $p = $('<li id="' + data.id + '" data-childListStyle="' +
                    data.childListStyle + '" data-parentId="' + data.parentId + '" style="text-align: '
                    + data.textAlign + '">' + data.content + ' </li>');

                $p.bind('mousedown', tools.handler.getSelectP);
                return $p;
            },

            getLevel: function ($p) {
                var level = 0,
                    temp = $p;
                while (temp.attr('id') !== 'contentOl') {

                    if (temp[0].tagName !== 'OL') {
                        level++;
                    }
                    temp = temp.parent();
                }
                $p.attr('data-level', level);

                $p.css('margin-left', 0.8 + 'rem')
            },
            handler: {
                getSelectP: function (immediately) {
                    //清除之前的selectP 的border
                    comp.content.find('li').removeClass('currentP');

                    function f() {
                        selectP = $(selection.focusNode);
                        //todo 双击 bug

                        while (!selectP.attr('id')) {
                            selectP = selectP.parent();
                        }
                        //设置selectP 的border
                        if (currentMode === 'EDIT') {
                            selectP.addClass('currentP')
                        }
                        console.log(selection)
                    }

                    if (immediately === true) {//立刻得到光标所在元素
                        f();
                        return;
                    }
                    else if (immediately) {
                        arguments[0].stopPropagation();
                    }

                    setTimeout(function (e) {   //异步得到光标所在元素
                        f();
                        //解决颜色叠加下划线等导致无法识别光标所处位置的样式
                        var color = null,
                            nodeTemp = $(selection.focusNode.parentElement);
                        while (!color || color === 'rgba(0, 0, 0, 0)') {
                            color = nodeTemp.css('background-color');
                            nodeTemp = nodeTemp.parent();
                        }

                        comp.window.trigger('btnChange.center', {state: selectP.css('text-align')});
                        comp.window.trigger('btnChange.fontSize', {
                            val: $(selection.focusNode.parentElement).css('font-size')
                        });
                        comp.window.trigger('btnChange.color', {val: color});
                        comp.window.trigger('btnChange.underline', {
                            val: $(selection.focusNode.parentElement).css('text-decoration')
                        });
                        comp.window.trigger('btnChange.oblique', {
                            val: $(selection.focusNode.parentElement).css('font-style')
                        });
                        comp.window.trigger('btnChange.bold', {
                            val: $(selection.focusNode.parentElement).css('font-weight')
                        });
                        comp.window.trigger('btnChange.listStyle', {
                            val: selectP.parent().css('list-style-type')
                        });
                    }, 10)

                }
            }
        };

    exports.init = function () {
        getComponent();
        addEventListener();
        initBtns();
        initData();
        comp.window.trigger('ChangeMode', {val: 'READ', first: true});

    };

    function getComponent() {
        comp.content = $('#content');
        comp.head = $('#head');

        comp.contentOl = $('#contentOl');
        comp.wrap = $('#wrap');
        comp.window = $(window);
        comp.headBtns = comp.head.find('.btns');
        comp.headTip = comp.head.find('.tip');

        btn.bold = comp.headBtns.find('.bold');
        btn.oblique = comp.headBtns.find('.oblique');
        btn.underline = comp.headBtns.find('.underline');
        btn.center = comp.headBtns.find('.center');
        btn.color = comp.headBtns.find('.color');
        btn.listStyle = comp.headBtns.find('.listStyle');
        btn.fontSize = comp.headBtns.find('.fontSize');
        btn.levelUp = comp.headBtns.find('.levelUp');
        btn.levelDown = comp.headBtns.find('.levelDown');
        btn.read = comp.headBtns.find('.read');
    }

    function addEventListener() {

        comp.headTip.bind('click', function () {
            comp.window.trigger('ChangeMode', {val: 'EDIT'});
        });
        comp.window.bind('ChangeMode', function (e, data) {
            if (data.val === 'EDIT') {
                currentMode = 'EDIT';
                comp.contentOl.attr('contenteditable', true);
                comp.headBtns.css('display', 'inline-block');
                comp.headTip.hide();
                tools.showPop('success', '按ECS或“读”进入阅读模式', 600)
            }
            else {
                if (!data.first) {
                    tools.showPop('success', '所有更改已保存', 600);
                    //todo save

                  var data = [];
                  $('li').each(function (e) {
                    var obj={
                      content: $(this)[0].firstChild.textContent,
                      id:  $(this).attr('id'),
                      parentId: $(this).attr('data-parentid'),
                      childListStyle: $(this).attr('data-childliststyle'),
                      textAlign: function (that) {
                        var text = $(that).attr('style');
                        var arr = text.match(/text-align:\s(.*?);/);
                        return arr[1];
                      }(this)
                    };
                    data.push(obj);
                  });
                  localStorage.notes=JSON.stringify(data);

                }
                currentMode = 'READ';
                comp.contentOl.attr('contenteditable', false);
                comp.headBtns.css('display', 'none');
                comp.headTip.show();
            }
        });
        comp.window.bind('keydown', function (e) {
            console.log(e.keyCode);
            var keyCode = e.keyCode;

            if (currentMode === 'EDIT') {
                switch (keyCode) {
                    case 13:
                    {
                        tools.handler.getSelectP(true);
                        if (selectP) {
                            selectP.css('border', '1px rgba(0, 0, 255, 0) solid');
                        }
                        if (selectP.html() === '<br>') {    //双击回车
                            var prev = selectP.prev();
                            var newP = $('<br><br>');
                            prev.append(newP);
                            selectP.remove();

                            tools.setFocus(prev[0], prev[0].childNodes[0].length, true);
                            tools.handler.getSelectP(true);
                            return false;
                        }

                        var html = selectP.html().replace(/<br>/g, '');
                        if (!html) {
                            selectP.append('<br>');
                            return false;
                        }


                        selectP.attr('data-id', selectP.attr('id'));
                        selectP.removeAttr('id');

                        setTimeout(function () {
                            selectP = $('*[data-id=' + selectP.attr("data-id") + ']').eq(0);
                            selectP.attr('id', selectP.attr('data-id'));


                            var newP = selectP.next();
                            newP.attr('id', (new Date()).getTime());

                            newP.css({
                                textAlign: selectP.css('text-align')

                            });
                            comp.content.find('li').removeClass('currentP');
                            newP.addClass('currentP');

                            newP.bind('mousedown', tools.handler.getSelectP);
                            selectP = newP;
                        }, 10);
                        break;
                    }
                    case 38://点击上下、删除键
                    case 40:
                    case 8:
                        tools.handler.getSelectP();
                        break;

                    case 66:    //ctrl b
                        if (e.ctrlKey) {
                            e.preventDefault();
                            setTimeout(function () {
                                btn.bold.click();
                            }, 20)
                        }
                        break;
                    case 73:    // i
                    {
                        if (e.ctrlKey) {
                            e.preventDefault();
                            setTimeout(function () {
                                btn.oblique.click();
                            }, 20)
                        }

                        break;
                    }

                    case 85:    //ctrl u
                        if (e.ctrlKey) {
                            e.preventDefault();
                            setTimeout(function () {
                                btn.underline.click();
                            }, 20)
                        }
                        break;
                    case 37: //ctrl ->
                        if (e.ctrlKey) {
                            e.preventDefault();
                            btn.levelUp.click();
                        }
                        break;
                    case 39: //ctrl ->
                        if (e.ctrlKey) {
                            e.preventDefault();
                            btn.levelDown.click();
                        }
                        break;
                    case 27:
                        if (currentMode === 'EDIT') {
                            comp.window.trigger('ChangeMode', {val: 'READ'});
                        }
                        break;
                }
            }
            else if (keyCode === 73) {    //按i进入编辑模式
                comp.window.trigger('ChangeMode', {val: 'EDIT'});
                e.preventDefault();
            }
        })
    }

    function initBtns() {

        (function initReadBtn() {
            btn.read.click(function () {
                comp.window.trigger('ChangeMode', {val: 'READ'});
            })
        })();
        (function initListStyleBtn() {
            var str = '',
                listStyle = {
                    none: ' ',
                    disc: '●',
                    circle: '○',
                    square: '■',
                    'cjk-ideographic': '一',
                    decimal: '1',
                    'lower-latin': 'a',
                    'upper-latin': 'A',
                    'lower-roman': 'ⅰ',
                    'upper-roman': 'Ⅰ',
                    'lower-greek': 'α',
                    'cjk-heavenly-stem': '甲'
                };
            for (var name in listStyle) {
                str += '<option value="' + name + '">' + listStyle[name] + '</option>';
            }
            btn.listStyle.append(str);

            btn.listStyle.bind('change', function () {
                $('ul').css({
                    'list-style-type': $(this).val()
                });
                selectP.parent().css('list-style-type', $(this).val())
            });

            comp.window.bind('btnChange.listStyle', function (e, data) {
                btn.listStyle.find('option').each(function () {
                    if ($(this).val() === data.val) {
                        $(this)[0].selected = true;
                        return false;
                    }
                })

            });
        })();

        (function initColorBtn() {
            var str = '',
                colors = {
                    '白': 'rgb(255, 255, 255)',
                    '红': 'rgb(255, 0, 0)',
                    '橙': 'rgb(255, 165, 0)',
                    '黄': 'rgb(255, 255, 0)',
                    '绿': 'rgb(52, 179, 52)',
                    '青': 'rgb(0, 255, 255)',
                    '蓝': 'rgba(0, 0, 255, 0.6)',
                    '紫': 'rgba(128, 0, 128, 0.6)'
                };

            for (var name in colors) {
                str += '<option value="' + colors[name] + '" style="color:' + colors
                        [name] + ';">' + name + '</option>'
            }
            btn.color.append(str);
            btn.color.bind('change', function (e) {
                chooseThisP();
                btn.color.css('color', $(this).val());
                console.log($(this).val());
                document.execCommand('backcolor', false, $(this).val());

            });
            comp.window.bind('btnChange.color', function (e, data) {
                btn.color.find('option').each(function () {
                    if ($(this).val() == data.val) {
                        $(this)[0].selected = true;
                        btn.color.css('color', $(this).val());
                        return false;
                    }
                    else {
                        btn.color.find('option')[0].selected = true;

                        btn.color.css('color', '');

                    }
                })
            });
        })();

        (function initFontSizeBtn() {
            var str = '<option value=""> </option><option value="increaseFont">↑</option><option value="shrinkFont">↓</option>',
                arr = [12, 13, 16, 18, 24, 32, 48];


            for (var i = 0; i < arr.length; i++) {
                str += '<option value="' + arr[i] + '"  >' + arr[i] + '</option>'
            }
            btn.fontSize.append(str);
            btn.fontSize.bind('change', function (e) {
                console.log(arr[(arr.indexOf(parseInt(comp.content.css('font-size'))) + 1)]);
                if ($(this).val() === 'increaseFont') { //字体放大

                    if (tools.getSelectedText()) {
                        document.execCommand('FontSize', false, String(arr.indexOf(parseInt($(selection.focusNode.parentElement).css('font-size'))) + 2));
                    } else { // 放大文本默认字体大小  todo 保存到config
                        comp.content.css('font-size', arr[(arr.indexOf(parseInt(comp.content.css('font-size'))) + 1)])

                    }
                    btn.fontSize.find('option:eq(0)')[0].selected = true;


                } else if ($(this).val() === 'shrinkFont') {
                    if (tools.getSelectedText()) {
                        document.execCommand('FontSize', false, String(arr.indexOf(parseInt($(selection.focusNode.parentElement).css('font-size')))));
                    } else {
                        comp.content.css('font-size', arr[(arr.indexOf(parseInt(comp.content.css('font-size'))) - 1)])

                    }
                    btn.fontSize.find('option:eq(0)')[0].selected = true;

                }
                else if ($(this).val()) {
                    chooseThisP();
                    document.execCommand('FontSize', false, String(arr.indexOf(parseInt($(this).val())) + 1));
                }


            });

            comp.window.bind('btnChange.fontSize', function (e, data) {
                var fontSize = parseInt(data.val, 10);
                btn.fontSize.find('option').each(function () {
                    if ($(this).val() == fontSize) {
                        $(this)[0].selected = true;
                        return false;
                    }
                })

            })
        })();

        (function initUnderline() {
            comp.window.bind('btnChange.underline', function (e, data) {
                if (data.val === 'underline') {
                    btn.underline.css('text-decoration', 'underline');
                }
                else {
                    btn.underline.css('text-decoration', 'none');
                }
            });

            btn.underline.click(function () {
                chooseThisP();
                document.execCommand('Underline', false);

                comp.window.trigger('btnChange.underline', {
                    val: btn.underline.css('text-decoration') === 'none' ? 'underline' :
                        'none'
                });

            })
        })();

        (function initOblique() {
            comp.window.bind('btnChange.oblique', function (e, data) {
                if (data.val === 'italic') {
                    btn.oblique.css('font-style', 'italic');
                }
                else {
                    btn.oblique.css('font-style', 'normal');
                }
            });

            btn.oblique.click(function () {
                chooseThisP();

                document.execCommand('Italic', false);

                comp.window.trigger('btnChange.oblique', {
                    val: btn.oblique.css('font-style') === 'normal' ? 'italic' : 'normal'
                });

            })
        })();

        (function levelUp() {

            btn.levelUp.click(function () {
                var ol = selectP.parent(),
                    offset = selection.focusOffset;
                if (ol.attr('id') === 'contentOl') {
                    return;
                }
              selectP.attr('data-parentid',selectP.parent().parent().attr('id'))
              selectP.parent().parent().after(selectP);
                if (!ol.html()) {
                    ol.remove();
                }

                tools.getLevel(selectP);
                tools.setFocus(selectP[0], offset);

                comp.window.trigger('btnChange.listStyle', {val: selectP.parent().css('list-style-type')});

            })
        })();
        (function levelDown() {

            btn.levelDown.click(function () {
                var offset = selection.focusOffset;

                if (selectP.prev().html()) {    //本节点有前驱节点
                    if (selectP.prev().find('>ol').length < 1) {    //前一节点没有子节点，本节点作为其子节点
                        var ol = $('<ol></ol>');
                        selectP.prev().append(ol);
                        ol.append(selectP);

                    }
                    else {//前一节点有子节点，本节点作为其子节点添加至首
                        selectP.prev().find('>ol').append(selectP);
                    }
                  selectP.attr('data-parentid',selectP.parent().parent().attr('id'))

                }
                else {  //本节点没有前驱节点

                    //todo
                }

              tools.getLevel(selectP);
                tools.setFocus(selectP[0], offset);

                comp.window.trigger('btnChange.listStyle', {val: selectP.parent().css('list-style-type')});

            })
        })();
        (function initCenterBtn() {
            comp.window.bind('btnChange.center', function (e, data) {
                if (data.state === 'center') {
                    btn.center.css('text-align', 'center');
                }
                else if (data.state === 'left') {
                    btn.center.css('text-align', 'left');
                }
                else if (data.state === 'right') {
                    btn.center.css('text-align', 'right');
                }
            });
            btn.center.click(function () {  //点击居中按钮
                var toAlign;
                if (selectP) {
                    switch (btn.center.css('text-align')) {
                        case 'left':
                            toAlign = 'center';
                            selectP.css('text-align', toAlign);
                            comp.window.trigger('btnChange.center', {state: toAlign});
                            break;
                        case 'center':
                            toAlign = 'right';
                            selectP.css('text-align', toAlign);
                            comp.window.trigger('btnChange.center', {state: toAlign});
                            break;
                        case 'right':
                            toAlign = 'left';
                            selectP.css('text-align', toAlign);
                            comp.window.trigger('btnChange.center', {state: toAlign});
                            break;
                    }

                    // selectP.css('margin-left', selectP.attr('data-level') * 10)

                }
                else {
                    console.log('未选中段落')
                }

            });
        })();

        function chooseThisP() {
            if (!tools.getSelectedText()) {
                if (!selectP) {
                    return
                }
                var node = selectP[0];
                var range = document.createRange();
                range.selectNodeContents(node);
                range.collapse(true);
                range.setStart(node, 0);
                range.setEnd(node, node.childNodes.length);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }

        (function initBold() {
            comp.window.bind('btnChange.bold', function (e, data) {
                if (data.val === 400 || data.val === 'normal') {
                    btn.bold.css('font-weight', 'normal');
                }
                else {
                    btn.bold.css('font-weight', 'bold');
                }
            });

            btn.bold.click(function () {

                chooseThisP();

                document.execCommand('Bold', false);

                comp.window.trigger('btnChange.bold', {
                    val: (btn.bold.css('font-weight') === 'normal') || (btn.bold.css
                    ('font-weight') === 400) ? 'bold' : 'normal'
                });

            })
        })();

    }

    function initData() {
        var config = {
            childListStyle: 'circle',
            fontSize: 16

        };


      var defaultData=[{"content":"欢迎使用笔记助手     ","id":"1","parentId":"content","childListStyle":"circle","textAlign":"center"},{"content":"简介：这是我早期的一个前端项目，使用原生js进行开发。主要使用了富文本技术进了笔记编辑，并进行树状数据格式的存储与解析。    ","id":"2","parentId":"content","childListStyle":"lower-roman","textAlign":"left"},{"content":"项目时间：2015年9月    ","id":"1488208724732","parentId":"content","childListStyle":"lower-roman","textAlign":"left"},{"content":"开发周期：5天    ","id":"1488208876691","parentId":"content","childListStyle":"lower-roman","textAlign":"left"},{"content":"项目特点    ","id":"1488208751058","parentId":"content","childListStyle":"lower-roman","textAlign":"left"},{"content":"html5富文本    ","id":"1488208882281","parentId":"1488208751058","childListStyle":"lower-roman","textAlign":"left"},{"content":"localstorage    ","id":"1488208907540","parentId":"1488208751058","childListStyle":"lower-roman","textAlign":"left"},{"content":"数据存储与解析    ","id":"1488208912429","parentId":"1488208751058","childListStyle":"lower-roman","textAlign":"left"},{"content":"动态改变编号    ","id":"1488208914334","parentId":"1488208751058","childListStyle":"lower-roman","textAlign":"left"},{"content":"维系文档结构    ","id":"1488208916035","parentId":"1488208751058","childListStyle":"lower-roman","textAlign":"left"},{"content":"较多的事件处理    ","id":"1488208917449","parentId":"1488208751058","childListStyle":"lower-roman","textAlign":"left"},{"content":"操作快捷键    ","id":"1488208919238","parentId":"1488208751058","childListStyle":"lower-roman","textAlign":"left"},{"content":"项目意义    ","id":"1488208929986","parentId":"content","childListStyle":"lower-roman","textAlign":"left"},{"content":"认识到HTML5富文本技术的缺陷    ","id":"1488208941437","parentId":"1488208929986","childListStyle":"lower-roman","textAlign":"left"},{"content":"兼容性问题，需要浏览器支持HTML5    ","id":"1488209016576","parentId":"1488208941437","childListStyle":"lower-roman","textAlign":"left"},{"content":"对标准的实现程度。很多标准目前尚未有浏览器进行实现    ","id":"1488209029614","parentId":"1488208941437","childListStyle":"lower-roman","textAlign":"left"},{"content":"由于以上问题，我认为在短期内，富文本无法做到较重的商业用途    ","id":"1488209035837","parentId":"1488208941437","childListStyle":"lower-roman","textAlign":"left"},{"content":"认识到原生js操作dom的繁琐不便    ","id":"1488209042131","parentId":"1488208929986","childListStyle":"lower-roman","textAlign":"left"},{"content":"学习初期一个较重的实战演练，对代码风格、设计思路、编码技巧等起到了很好的锻炼意义，具有    ","id":"1488209053409","parentId":"1488208929986","childListStyle":"lower-roman","textAlign":"left"}];
      var data = localStorage.notes?JSON.parse(localStorage.notes):defaultData;
        comp.content.css('font-size', config.fontSize);

        comp.contentOl.css('list-style-type', config.childListStyle);
        for (var i = 0; i < data.length; i++) {
            var each = data[i];

            var $p = tools.creatP(each);
            var parent = $('#' + each.parentId);
            if (parent.find('>ol').length < 1) {
                parent.append('<ol style="list-style-type: ' + parent.attr("data-childliststyle") + ';"></ol>')
            }
            parent.find('>ol').append($p);

            tools.getLevel($p);

        }

    }


});
