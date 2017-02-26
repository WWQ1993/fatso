/**
 * @fileOverview 精简DOM库
 * @author 吴万强(email:wuwanqiang@58ganji.com)
 * @version 1.0
 */

/**
 * @param {Object} domain:$作为属性绑定到domain上
 */
!function (domain) {
  var slice = Array.prototype.slice;  //变量别名
  /**
   * @param {String}|{HTMLElement}|{Element}|{Function} arg
   * @return {$Element}|arg
   */
  var $ = domain.$ = function (arg) {
    if (typeof arg === 'string') {  //传入字符串
      if (arg.indexOf('<') > -1) return new Element(string2Dom(arg));//传入符合HTML语法的字符串，返回
      else return new Element(document.querySelectorAll(arg.replace(/(=\d+])/g, '="$1"]')));
    }
    if ($.isHTMLElement(arg)) return new Element([arg]);
    if (typeof arg === 'function') {
      if (document.readyState != 'loading') arg();
      else document.addEventListener('DOMContentLoaded', arg);
      return new Element([document]);
    }
    return arg; //如果传入不合规则的参数，则返回第一个参数。
  };

  /**
   * @desc 此构造函数接受一个HTMLElement组成的数组，返回基础实例（类似$ele)
   * @param {Array}nodeList
   * @constructor
   * @return {Element}
   * @throws "can't read length of undefined":未传入数组
   */
  function Element(nodeList) {
    var length = 0;
    for (var i = 0; i < nodeList.length; i++) {
      this[i] = nodeList[i];
      length++;
    }
    this.length = length;
  }

  $.fn = Element.prototype = {
    constructor: Element,
    //dom

    /**
     * @desc 获取匹配的元素集合中的第一个元素的属性的值 或 设置每一个匹配元素的一个或多个属性。
     * @param {String}attrName
     * @param {String}[attrContent]
     * @return {*}属性值或者调用者
     */
    attr: function (attrName, attrContent) {
      if (!attrContent)
        return this[0] ? this[0].getAttribute(attrName) : undefined;
      else {
        return this.each(function () {
          this.setAttribute(attrName, attrContent);
        });
      }
    },

    /**
     * @desc 获得匹配元素的集合中指定索引的元素。
     * @param {Number}n: 索引值(负数则从集合中的最后一个元素开始倒数。)
     * @return {Element}
     */
    eq: function (n) {
      if (n >= 0) return new Element([this[n]]);
      else return new Element([this[this.length + n]]);
    },

    /**
     * @desc 得到匹配元素集合中每个元素的文本内容结合，包括他们的后代；或设置匹配元素集合中每个元素的文本内容为指定的文本内容。
     * @param [content]文本值
     * @return {*}文本值或者调用者
     */
    text: function (content) {
      if (!content) {
        var str = '';
        this.each(function () {
          str += this.textContent;
        });
        return str;
      }
      else {
        return this.each(function () {
          this.textContent = content.toString();
        });
      }
    },
    /**
     * @desc 获取集合中第一个匹配元素的HTML内容 或 设置每一个匹配元素的html内容。
     * @param {String}[content]
     * @return {*}html内容或者调用者
     */
    html: function (content) {
      if (!content)
        return this[0].innerHTML;
      else {
        return this.each(function (_i, e) {
          e.innerHTML = content.toString()
        });
      }
    },

    /**
     * @desc 从DOM中移除集合中匹配元素的所有子节点。
     * @return {Element}调用者
     */
    empty: function () {
      return this.each(function (_i, e) {
        e.innerHTML = '';
      });
    },

    /**
     * @desc 通过一个选择器，得到当前匹配的元素集合中每个元素的后代。
     * @param {String}str 选择器
     * @return {Element}后代元素
     */
    find: function (str) {
      var arr = [];
      this.each(function () {
        var list = this.querySelectorAll(str),
          listLength = list.length;
        for (var i = 0; i < listLength; i++) {
          arr.push(list[i]);
        }
      });
      return new Element(arr);
    },

    /**
     * @desc  获得匹配元素集合中每个元素的兄弟元素,可以提供一个可选的选择器。
     * @param {String}[str]
     * @return {Element}
     */
    siblings: function (str) {
      var arr = [];
      this.each(function (_i, el) {
        var list = Array.prototype.filter.call(el.parentNode.children, function (child) {
            return child !== el;
          }),
          listLength = list.length;
        for (var i = 0; i < listLength; i++) {
          if ($(list[i]).is(str || '*') && arr.indexOf(list[i]) < 0) arr.push(list[i]);
        }
      });
      return new Element(arr);
    },
    /**
     * @desc 获得匹配元素集合中每个元素的子元素，选择器选择性筛选。
     * @param {String}[str]选择器
     * @returns {Element}
     */
    children: function (str) {
      var arr = [];
      this.each(function (_i, el) {
        var list = el.children,
          listLength = list.length;
        for (var i = 0; i < listLength; i++) {
          if ($(list[i]).is(str || '*')) arr.push(list[i]);
        }
      });
      return new Element(arr);
    },
    /**
     * @desc 取得匹配的元素集合中每一个元素紧邻的后面同辈元素的元素集合。提供一个可选的选择器。
     * @param {String}[arg]选择器
     * @returns {Element}
     */
    next: function (arg) {
      var arr = [];
      this.each(function () {
        var ele = this.nextElementSibling;
        if (ele && (arg ? Array.prototype.indexOf.call(document.querySelectorAll(arg), ele) > -1 : true))
          arr.push(ele);
      });
      return new Element(arr);
    },
    /**
     * @desc 获取集合中每个匹配元素紧邻的前一个兄弟元素。提供一个可选的选择器。
     * @param {String}[arg]选择器
     * @returns {Element}
     */
    prev: function (arg) {
      var arr = [];
      this.each(function () {
        var ele = this.previousElementSibling;
        if (ele && (arg ? Array.prototype.indexOf.call(document.querySelectorAll(arg), ele) > -1 : true))
          arr.push(ele);
      });
      return new Element(arr);
    },

    /**
     * @desc 从匹配的元素中搜索给定元素的索引值，从0开始计数。
     * @param arg
     * @return {number|Number|*}
     */
    index: function (arg) {
      if (!arg)
        return slice.call(this[0].parentNode.children, 0).indexOf(this[0]);
      else if (typeof arg === 'string')
        return slice.call(this, 0).indexOf(document.querySelectorAll(arg)[0]);
      else
        return slice.call(this, 0).indexOf($.isHTMLElement(arg) ? arg : arg[0]);

    },
    /**
     * @desc 取得匹配元素集合中，每个元素的父元素，可以提供一个可选的选择器。
     * @param {String}[selector]选择器
     * @returns {Element}
     */
    parent: function (selector) {
      var nodeList = [];
      this.each(function (_i, ele) {
        var node = ele.parentNode;
        if (nodeList.indexOf(node) < 0 && $(node).is(selector || '*')) nodeList.push(node);
      });

      return new Element(nodeList);
    },
    /**
     * @desc 获得集合中每个匹配元素的祖先元素。可以提供一个可选的选择器。
     * @param {String}[selector]选择器
     * @returns {Element}
     */
    parents: function (str) {
      var arr = [],
        node = this[0],
        nodes = str ? $(str) : [],
        nodesLength = str ? nodes.length : 0;

      while (node !== document.documentElement) {//不是html元素则重复上溯
        node = node.parentNode;
        if (str) {
          var has = false;
          for (var j = 0; j < nodesLength; j++) {
            if (nodes[j] === node) {
              has = true;
              break;
            }
          }
          if (has) return $(node);
        }
        else arr.push(node);
      }
      return arr;
    },
    /**
     * 判断当前匹配的元素集合中的元素，是否为一个选择器，DOM元素，或者jQuery对象，如果这些元素至少一个匹配给定的参数，那么返回true。
     * @param str
     * @returns {boolean}
     */
    is: function (str) {//todo DOM元素，或者jQuery对象
      if (typeof str === 'string') {
        var sel = str;
        var matches = function (el, selector) {
            return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector ||
            el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
          },
          returnVal = false;
        this.each(function (_i, ele) {
          if (matches(ele, sel)) {
            returnVal = true;
            return false;
          }
        });
        return returnVal;
      }
      else {
        throw new Error('please pass a string as parameter')
      }
    },
    /**
     * 将匹配元素集合从DOM中删除。可以提供一个可选的选择器。返回删除的DOM节点所组成的Element。
     * @param str
     * @returns {Element}
     */
    remove: function (str) {
      try {
        var arr = [];
        if (!str) {
          this.each(function () {
            arr.push(this.parentNode.removeChild(this));
          });
        }
        else if (typeof str === 'string') {
          this.each(function (_i, e) {
            if ($(e).is(str)) {
              arr.concat($(e).remove())
            }
          })
        }

        return new Element(arr);
      }
      catch (e) {
      }
    },
    /**
     * @desc 创建一个匹配的元素集合的拷贝副本(不包含事件和数据，第二个参数传入true则包含子节点)。
     * @returns {Element}
     */
    clone: function () {
      var arr = [];
      this.each(function (_i, e) {
        arr.push(e.cloneNode(true));
      });
      return new Element(arr);
    },
    /**
     * @desc 获取或设置页面上的滚动元素或者整个窗口向下滚动的像素值。
     * @param {number}像素值
     * @returns {number|self}
     */
    scrollTop: function (arg) {
      var target = (this[0] === window || this[0] === document) ? document.body : this[0];

      if (arguments.length) {
        target.scrollTop = arg;
        return this;
      }
      else {
        return target.scrollTop;
      }
    },
    /**
     * @desc 获取或设置页面上的滚动元素或者整个窗口向右滚动的像素值。
     * @param {number}像素值
     * @returns {number|self}
     */
    scrollLeft: function (arg) {
      var target = (this[0] === window || this[0] === document) ? document.body : this[0];

      if (arguments.length) {
        target.scrollLeft = arg;
        return this;
      }
      else {
        return target.scrollLeft;
      }
    },

    /**
     * @desc 获得当前元素相对于document的位置。返回一个对象含有： top, left, width和height。当给定一个含有left和top属性对象时，使用这些值来对集合中每一个元素进行相对于document的定位。
     * @param {number}像素值
     * @returns {number|self}
     */
    offset: function () {
      var rect = this[0].getBoundingClientRect();
      return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft,
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      }
    },

    /**
     * @desc 获取对象集合中第一个元素的宽；或者设置对象集合中所有元素的宽。
     * @param {number}宽度
     * @returns {number|self}
     */
    width: function (arg) {
      if (arguments.length) {
        this.eq(0).css('width', arg + 'px');
        return this;
      }
      else {
        if (this[0] === window) {
          return parseInt(window.innerWidth);
        }
        if (this[0] === document) {
          return parseInt(document.body.scrollWidth);
        }
        return this[0] ? this[0].getBoundingClientRect().width : 0;
      }
    },
    /**
     * @desc 获取对象集合中第一个元素的高；或者设置对象集合中所有元素的高。
     * @param {number}高度
     * @returns {number|self}
     */
    height: function (arg) {
      if (arguments.length) {
        this.eq(0).css('height', arg + 'px');
        return this;
      }
      else {
        if (this[0] === window) {
          return parseInt(window.innerHeight);
        }
        if (this[0] === document) {
          return parseInt(document.body.scrollHeight);
        }
        return this[0] ? this[0].getBoundingClientRect().height : 0;
      }
    },
    /**
     * @desc 将集合中的元素插入到指定的目标元素前面。这个有点像 before，但是使用方式相反。
     * 内部通过调用before来实现功能
     * @param {HTMLElement|Element}
     * @returns {number|self}
     */
    insertBefore: function (arg) {
      $(arg).before(this);
      return this;
    },
    /**
     * @desc 将集合中的元素插入到指定的目标元素后面。这个有点像 after，但是使用方式相反。
     * 内部通过调用after来实现功能
     * @param {HTMLElement|Element}
     * @returns {number|self}
     */
    insertAfter: function (arg) {
      $(arg).after(this);
      return this;
    },
    /**
     * @desc 获取或设置匹配元素的值。当没有给定value参数，返回第一个元素的值。
     * @param {arg}
     * @returns {value|self}
     */
    val: function (arg) {
      if (arguments.length) {
        return this.each(function (_i, e) {
          e.value = arg;
        })
      } else {
        return this[0].value;
      }
    },
    /**
     * @desc 用提供的内容替换集合中所有匹配的元素并且返回被删除元素的集合。
     * @param arg：同before参数
     * @returns {Element}
     */
    replaceWith: function (arg) {
      this.before(arg);
      return this.remove();
    },
    /**
     * @desc 用集合的匹配元素替换每个目标元素。.replaceAll()和.replaceWith()功能类似，但是目标和源相反。
     * @param arg
     * @returns {Element}
     */
    replaceAll: function (arg) {
      return $(arg).replaceWith(this);
    },
    //Style
    /**
     * @desc 为每个匹配的元素添加指定的class类名。多个class类名使用空格分隔。
     * @param {string}className
     * @returns {Element}:self
     */
    addClass: function (className) {
      this.each(function () {
        if (this.classList)
          this.classList.add(className);
        else
          this.className += ' ' + className;
      });
      return this;
    },
    /**
     * @desc 移除当前对象集合中所有元素的指定class。如果没有指定name参数，将移出所有的class。多个class参数名称可以利用空格分隔。
     * @param {string}className
     * @returns {Element}:self
     */
    removeClass: function (className) {
      this.each(function () {
        if (className) {
          if (this.classList)
            this.classList.remove(className);
          else
            this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') +
              '(\\b|$)', 'gi'), ' ');
        }
        else {
          this.className = ''
        }
      });
      return this;
    },
    /**
     * @desc 在匹配的元素集合中的每个元素上添加或删除一个或多个样式类。如果class的名称存在则删除它，如果不存在，就添加它。
     * @param {string}className
     * @return {Element}:self
     */
    toggleClass: function (className) {
      this.each(function () {
        if (this.classList) {
          this.classList.toggle(className);
        } else {
          var classes = this.className.split(' '),
            existingIndex = classes.indexOf(className);

          if (existingIndex >= 0)
            classes.splice(existingIndex, 1);
          else
            classes.push(className);

          this.className = classes.join(' ');
        }
      });
      return this;
    },
    /**
     * @desc 读取或设置DOM元素的css属性。当value参数不存在的时候，返回对象集合中第一个元素的css属性。当value参数存在时，
     * 设置对象集合中每一个元素的对应css属性。多个属性可以通过传递一个属性名组成的数组一次性获取。多个属性可以利用对象键值对
     * 的方式进行设置。当value为空(空字符串，null 或 undefined)，那个css属性将会被移出。当value参数为一个无单位的数字，
     * 如果该css属性需要单位，“px”将会自动添加到该属性上。
     * @param {string|object}arg 只有一个参数：对象或者字符串
     * @param {string}[arg2] 两个参数：字符串。
     * @return {*} style属性值或者self
     */
    css: function (arg, arg2) {
      if (arg && typeof arg !== 'object' && !arg2) {
        return this[0] && getComputedStyle(this[0])[arg];
      }
      else {
        this.each(function (_i, e) {
          if (typeof arg === 'object') {
            for (var attr in arg) {
              e.style[attr] = typeof arg[attr] === 'number' ? arg[attr] + 'px' : arg[attr];
            }
          }
          else
            e.style[arg] = typeof arg2 === 'number' ? arg2 + 'px' : arg2;
        });
        return this;
      }
    },
    /**
     * @desc 通过设置css的属性display 为 none来将对象集合中的元素隐藏。
     * @return {Element} self
     */
    hide: function () {
      return this.each(function (_i, e) {
        e.style.display = 'none';
      })
    },
    /**
     * @desc 恢复对象集合中每个元素默认的“display”值。如果你用 hide将元素隐藏，用该属性可以将其显示。相当于去掉了display：none。
     * @return {Element} self
     */
    show: function () {
      return this.each(function (_i, e) {
        e.style.display = '';
        getComputedStyle(e).display === 'none' && (e.style.display = 'block');
      })
    },
    /**
     * @desc 切换元素显示状态
     * @return {Element} self
     */
    toggle: function () {
      return this.each(function (_i, e) {
        if (e.style.display === 'none') {
          e.style.display = '';
          getComputedStyle(e).display === 'none' && (e.style.display = 'block');
        }
        else {
          e.style.display = 'none';
        }
      });
    },
    /**
     * @desc 语法糖：同show();
     */
    slideDown: function () {
      return this.show();
    },
    /**
     * @desc 语法糖：同hide();
     */
    slideUp: function () {
      return this.hide();
    },
    /**
     * @desc 语法糖：同css();
     */
    animate: function (cssObj) {    //不支持动画效果
      this.css(cssObj);
    },

    //tools
    /**
     * @desc 遍历一个对象集合每个元素。在迭代函数中，this关键字指向当前项(作为函数的第二个参数传递)。如果迭代函数返回false，遍历结束。
     * @param {function}f 回调函数
     * @return {Element} self
     */
    each: function (f) {
      var length = this.length,
        ele;
      for (var i = 0; i < length; i++) {
        ele = this[i];
        if (!!f.apply(ele, [i, ele]))
          return ele;
      }
      return this;
    },
    /**
     * @desc 读取或写入dom的 data-* 属性。行为有点像 attr ，但是属性名称前面加上 data-。
     * @param {string}name
     * @param {*}[val]
     * @return {*} value|self
     */
    data: function (name, val) {

      if (this[0] === window || this[0] === document) {
        if (arguments.length === 1) {
          return this[0]['data-' + name];
        }
        else {
          this[0]['data-' + name] = val;
          return this;
        }
      }
      else {
        if (arguments.length === 1) {
          return this.eq(0).attr('data-' + name);
        }
        else {
          this.eq(0).attr('data-' + name, val);
          return this;
        }
      }
    },

    //Event
    /**
     * 添加事件处理程序到对象集合中得元素上。多个事件可以通过空格的字符串方式添加，或者以事件类型为键、以函数为值的对象方式。
     * 如果给定css选择器，当事件在匹配该选择器的元素上发起时，事件才会被触发（即事件委派）。
     * @param {string|object}arg0 一个或多个空格分隔的事件类型和可选的命名空间，比如"keydown.myPlugin"；
     * 或者一个以事件类型为键、以函数为值的对象。
     * @param {string|object|function}[arg1] css选择器，用以事件代理；或者数据对象，这个值将在事件处理程序执行期间
     * 被作为有用的 event.data 属性；或者回调函数(此参数置尾)。
     * @param {object|function}[arg2] data或者回调函数
     * @param {function}arg3 回调函数
     * @return {Element} self
     */
    on: function (arg0, arg1, arg2, arg3) {
      var type = arg0,
        selector = '',
        data = '',
        handler = null,
        that = this;
      if (typeof arg0 === 'object') { //绑定对象中的所有事件

        switch (arguments.length) {
          case 2:
            if (typeof arg1 === 'string') selector = arg1;  //传入选择器
            else data = arg1;   //传入data
            break;
          case 3:
            selector = arg1;
            data = arg2;
            break;
        }
        for (var _type in arg0) {
          handler = arg0[_type];   //回调函数

          this.each(function (_i, ele) {
            bindEvent({
              ele: ele,
              that: that,
              type: _type,
              handler: handler,
              data: data,
              selector: selector
            });
          })
        }
      }
      else if (arguments.length > 1) {

        switch (arguments.length) {
          case 2:
            handler = arg1;
            break;
          case 3:
            if (typeof arg1 === 'string') selector = arg1;
            else data = arg1;
            handler = arg2;
            break;
          case 4:
            selector = arg1;
            data = arg2;
            handler = arg3;
            break;
        }
        this.each(function (_i, ele) {
          bindEvent({
            ele: ele,
            that: that,
            type: type,
            handler: handler,
            data: data,
            selector: selector
          });
        });
      }
      return this;
    },
    /**
     * @desc 移除一个事件处理函数。
     * @param {string}[arg0] 命名空间名称
     * @param {function}[] 回调函数
     * @return {Element} self
     */
    off: function (arg0) {
      var arg = arguments;
      if (!arg0) {    //移除元素上所有事件
        this.each(function (_i, ele) {
          for (var str in ele.event) {
            var handlers = ele.event[str],
              handlersLength = handlers.length;
            for (var i = 0; i < handlersLength; i++) {
              var obj = handlers[i],
                oriHandler = obj['oriHandler'];
              ele.removeEventListener(str.split('.')[0], oriHandler);
            }
            ele.event[str] = [];
          }
        });
      }
      else if (arg.length === 1 && typeof arg0 === 'string') {    //移除命名空间内的事件
        this.each(function (_i, ele) {
          for (var str in ele.event) {
            if (str.indexOf(arg0) > -1) {
              var handlers = ele.event[str],
                handlersLength = handlers.length;
              for (var i = 0; i < handlersLength; i++) {
                var obj = handlers[i],
                  oriHandler = obj['oriHandler'];
                ele.removeEventListener(str.split('.')[0], oriHandler);
              }
              ele.event[str] = [];
            }
          }
        });
      }
      else {  //移除命名空间内且符合回调函数的事件
        var handler = arg[arg.length - 1];
        this.each(function (_i, ele) {
          for (var str in ele.event) {
            if (str.indexOf(arg0) > -1) {
              var handlers = ele.event[str],
                handlersLength = handlers.length,
                newHandlers = [];
              for (var i = 0; i < handlersLength; i++) {
                var obj = handlers[i],
                  oriHandler = obj['oriHandler'],
                  $handler = obj['$handler'];

                if (handler === $handler) {
                  ele.removeEventListener(str.split('.')[0], oriHandler);
                }
                else {
                  newHandlers.push(obj)
                }
              }
              ele.event[str] = newHandlers;
            }
          }
        });
      }
      return this;
    },
    /**
     * @desc 根据绑定到匹配元素的给定的事件类型执行所有的处理程序和行为。
     * @param {string}arg 事件类型
     * @return {Element}self
     */
    trigger: function (arg) {
      var event = document.createEvent('HTMLEvents');
      event.initEvent(arg, true, false);
      return this.each(function () {
        this.dispatchEvent(event);
      });
    },
    /**
     * @desc 元素的事件添加处理函数。处理函数在每个元素上每种事件类型最多执行一次。
     * @param 同on()
     * @return {Element}self
     */
    one: function () {
      this.bindEventOnce = true;
      return this.on.apply(this, arguments);
    },
    /**
     * @desc 语法糖：on()
     * @return {Element}self
     */
    bind: function () {
      return this.on.apply(this, arguments)
    },
    /**
     * @desc 语法糖：off()
     * @return {Element}self
     */
    unbind: function () {
      return this.off.apply(this, arguments)
    },
    /**
     * @desc 语法糖：mouseenter、mouseleave
     * @param {function}arg1
     * @param {function}arg2
     * @return {Element}self
     */
    hover: function (arg1, arg2) {
      return this.mouseenter(arg1).mouseleave(arg2);
    }
  };

  //inner functions

  function bindEvent(obj) {

    var once = obj.that.bindEventOnce;

    obj.ele.addEventListener(obj.type.split('.')[0], oriHandler);
    obj.ele.event = obj.ele.event || {};
    obj.ele.event[obj.type] = obj.ele.event[obj.type] || [];
    obj.ele.event[obj.type].push({
      oriHandler: oriHandler,
      $handler: obj.handler
    });
    function oriHandler(e) {
      var handlerReturnVal = true;
      e.data = obj.data;
      e.target = obj.that; //绑定目标
      e.currentTarget = e.srcElement; //触发目标

      if (obj.selector) { //如果传入了选择器，则在绑定对象的子元素中选择符合的元素，执行回调。
        if ($(obj.ele).find(obj.selector).index(e.srcElement) > -1) {
          handlerReturnVal = obj.handler.call(e.currentTarget, e);
        }
      }
      else {
        handlerReturnVal = obj.handler.call(e.currentTarget, e);
      }

      if (once) {   //通过.one方法绑定的事件，只触发一次
        delete obj.that.bindEventOnce;
        obj.ele.removeEventListener(obj.type.split('.')[0], oriHandler);
      }
      if (handlerReturnVal === false) {   //传入处理函数返回false
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

  }

  /**
   * @desc 传入字符串，创建dom节点数组
   * @param {String}text：html格式的字符串
   * @returns {Array}：HTMLElement数组
   */
  function string2Dom(text) {
    var i,
      a = document.createElement("div"),
      arr = [];

    a.innerHTML = text;
    i = a.firstChild;
    while (i) {
      arr.push(i);
      i = i.nextSibling;
    }
    return arr;
  }

  //批量设置Element.prototype上的相似方法
  !function (methodArr, elementPrototype) {
    function domOperate(method, target, src) {
      if (typeof src === 'string') {  //  对象是htmlString，直接执行
        target.each(function (_i, ele) {
          switch (method) {
            case 'append':
              ele.insertAdjacentHTML('beforeend', src);
              break;
            case 'prepend':
              ele.insertAdjacentHTML('afterbegin', src);
              break;
            case 'after':
              ele.insertAdjacentHTML('afterend', src);
              break;
            case 'before':
              ele.insertAdjacentHTML('beforebegin', src);
              break;
          }
        })
      }
      else if ($.isHTMLElement(src)) { //  对象是html element，取其outerHTML再执行
        if (target.length < 2) {
          $(src).remove();
        }
        domOperate(method, target, src.outerHTML);
      }
      else if (src instanceof Element) {  //是$元素，拆分为各html node再执行
        if (method === 'before' || method === 'append') {
          src.each(function (_i, ele) {
            domOperate(method, target, ele);
          })
        }
        else {   //  纠正插入顺序
          for (var i = src.length; i >= 0; i--) {
            domOperate(method, target, src[i]);
          }
        }
      }
    }

    function addFunction(method) {
      elementPrototype[method] = function (arg) {
        domOperate(method, this, arg);
        return this;
      }
    }

    for (var i = 0; i < methodArr.length; i++) {
      addFunction(methodArr[i])

    }
  }(['append', 'prepend', 'after', 'before'], $.fn);

  //设置原生事件
  !function (arr, elementPrototype) {

    function addFunction(type) {
      elementPrototype[type] = function (arg, arg1) {
        if (!arg) {
          this.trigger(type);
          return this;
        }
        if (typeof arg === 'function') {
          this.on(type, arg);
          return this;
        }
        else {
          this.on(type, '', arg, arg1);
          return this;
        }
      }
    }

    for (var i = 0; i < arr.length; i++) {
      addFunction(arr[i]);
    }
  }(['blur', 'focusin', 'mousedown', 'mouseup', 'change', 'focusout', 'mouseenter', 'resize', 'click', 'keydown',
    'mouseleave', 'scroll', 'dbclick', 'keypress', 'mousemove', 'select', 'error', 'keyup', 'mouseout', 'submit',
    'focus', 'load', 'mouseover', 'unload', 'tap', 'touchstart', 'touchmove', 'touchend'], $.fn);

  //static function
  /**
   * @desc 将两个或更多对象的内容合并到第一个对象。在默认情况下，通过$.extend()合并操作不是递归的;如果第一个对象的属性本身是一个对象
   * 或数组，那么它将完全用第二个对象相同的key重写一个属性。这些值不会被合并。若设置了 deep 参数，对象和数组也会被合并进来，但是对象
   * 包裹的原始类型，比如String, Boolean, 和 Number是不会被合并进来的。
   * @param {object}arg0 一个对象，如果有后续参数传递给这个方法将那么它将接收新的属性，如果它是唯一的参数将扩展jQuery的命名空间。
   * @param {boolean}arg0 确定是否深拷贝，其后一个参数将作为接受后续参数属性的目标对象。
   * @param {object}argn 后续参数，用以传递要复制的属性给目标对象
   */
  $.extend = function (arg0) {
    var arg = arguments;

    function shallowCopy() {
      var arg_s = arguments;
      var out = arg_s[0];
      for (var i = 1; i < arg_s.length; i++) {
        var obj = arg_s[i];

        if (!obj)
          continue;

        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            out[key] = obj[key];
          }
        }
      }
      return out;
    }

    function deepCopy(arg_i) {
      var arg_d = arguments;
      arg_i = arg_i || {};
      for (var i = 1; i < arg_d.length; i++) {
        var obj = arg_d[i];
        if (!obj)
          continue;

        if(Array.isArray(obj)){
          arg_i=[];
          for(var j=0;j<obj.length;j++)
            if(typeof obj[j]==='object')
              arg_i[j] = deepCopy(arg_i[j], obj[j]);
            else
              arg_i.push(obj[j]);
        }
        else
          for (var key in obj)
            if (obj.hasOwnProperty(key)) {
              if (typeof obj[key] === 'object')
                arg_i[key] = deepCopy(arg_i[key], obj[key]);
              else
                arg_i[key] = obj[key];
            }
      }
      return arg_i;
    }

    if (arg.length === 1) return $.extend($, arg0); //扩展$命名空间

    else if (typeof arg0 === 'boolean') {
      if (arg0)   //深拷贝
        return deepCopy.apply(this, slice.call(arg, 1));
      else    //浅拷贝
        return shallowCopy.apply(this, slice.call(arg, 1));
    }
    else {  //浅拷贝
      return shallowCopy.apply(this, slice.call(arg, 0))
    }
  };
  /**
   * @desc 语法糖：$(f)
   * @param {function}cb:回调函数
   */
  $.ready = function (cb) {
    if (typeof cb === 'function')
      $(cb);
  };
  /**
   * @desc 判断是否为数组
   * @param {*}arg
   * @return {boolean}
   */
  $.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === "[object Array]"
  };
  /**
   * @desc 判断是否为原生HTMLElement
   * @param {*}arg
   * @return {boolean}
   */
  $.isHTMLElement = function (arg) {
    return (arg instanceof HTMLElement) || arg === window || arg === document
  };
  /**
   * @desc 一个通用的迭代函数，它可以用来无缝迭代对象和数组。数组和类似数组的对象通过一个长度属性（如一个函数的参数对象）来迭代，
   * 从0到length - 1。其他对象通过其属性名进行迭代。回调函数返回 false 停止遍历。
   * @param {Array|object}elements 迭代目标
   * @param {function}callback 该函数会在每个对象上（迭代）调用。
   * @return {*}elements
   */
  $.each = function (elements, callback) {
    var i, key;
    if (elements.length) {  //数组
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements) //object
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements;
  };

  //ajax模块，无外部耦合，可独立使用。传入一个对象，执行后ajax方法绑定到传入对象上。只提供.ajax()这个通用方法
  !function ($) {
    /**
     * @desc 扁平化对象
     * @param {object}target
     * @return {string} 对象的字符串化
     */
    $.param = function (target) {
      var scope = [],
        inner = function (tgt) {
          if (typeof tgt === 'object') {
            var result = '';
            for (var name in tgt) {

              if (tgt.hasOwnProperty(name)) {
                scope.push(name);
                result += inner(tgt[name]);
              }
            }
            scope.pop();
            return result;
          }
          else {
            var str = scope.join('][');
            scope.pop();
            return (str + ']=' + tgt + '&').replace(/]/, '');
          }
        },
        re = inner(target);
      return re.substring(0, re.length - 1);
    };
    /**
     * @desc 执行一个异步的HTTP（Ajax）的请求。
     * @param {object}option ajax配置项。目前支持的配置及其默认值如下
     * type:GET';
     * url:window.location.href;
     * data:'';
     * dataType:'text';
     * timeout:'-1';
     * beforeSend:'';
     * success:'';
     * error:'';
     * complete:'';
     * async:true;
     * headers:'';
     * jsonp:'callback';
     * jsonpCallback:('jsonp' + new Date().getTime())
     */
    $.ajax = function (option) {
      var type = option.type && option.type.toUpperCase() || 'GET',
        url = option.url || window.location.href,
        data = option.data && $.param(option.data) || '',
        dataType = option.dataType || 'text',
        timeout = option.timeout || -1,
        nullFunction = function () {
        },
        beforeSend = option.beforeSend || nullFunction,
        success = option.success || nullFunction,
        error = option.error || nullFunction,
        complete = option.complete || nullFunction,
        async = option.async || true,
        headers = option.headers || '',
        jsonp = option.jsonp || 'callback', //设置函数名的键名
        jsonpCallback = option.jsonpCallback || ('jsonp' + new Date().getTime());//函数名键值

      if (dataType.toLocaleLowerCase() === 'jsonp') {//jsonp
        var xhr = {},
          timeoutId = timeout >= 0 ? setTimeout(function () {    //设置超时
              delete window[jsonpCallback];
              error(xhr, 'timeout', null);
              complete(xhr, 'timeout');
            }, timeout) : null,
          afterJsExec = function (obj) {//执行js后触发
            clearTimeout(timeoutId);
            document.getElementsByTagName("head")[0].removeChild(script);
            delete window[jsonpCallback];
            success(obj, 'success', xhr);
            complete(obj, 'success');
          };
        window[jsonpCallback] = function (obj) {  //设置全局回调函数，在后端返回的脚本中会调用此函数，并把数据作为参数传入
          afterJsExec(obj);
        };

        beforeSend(xhr);    //调用beforeSend

        //引用外部脚本
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url + (url.indexOf('?') < 0 ? '?' : '&') + jsonp + '=' + jsonpCallback;
        document.getElementsByTagName("head")[0].appendChild(script);
      }
      else {  //xhr
        var request = new XMLHttpRequest();
        if (type === 'GET') { //设置数据
          url += (url.indexOf('?') < 0 ? '?' : '&') + data;
        }
        request.open(type, url, async);
        if (type === 'POST') {
          request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//post需要设置头部content-type字段
        }
        if (typeof headers === 'object') {  //设置头部
          for (var name in headers) {
            var val = headers[name];
            request.setRequestHeader(name, val);
          }
        }
        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {    //成功回调
            // Success!
            var data = null,
              str = request.responseText
            switch (dataType.toLocaleLowerCase()) {
              case 'json':
                data = JSON.parse(str);
                break;
              case 'xml':
                data = string2Dom(str);
                break;
              default:
                data = str;
                break;
            }
            success(data, request.status, request);
          } else {    //网络正常的失败回调
            error(request, 'error', request.statusText)
          }
          complete(request, request.status);
        };
        request.onerror = function () { //网络错误
          error(request, 'abort', null)
        };

        beforeSend(request);    //调用beforeSend

        request.send(data);

        if (timeout >= 0) {  //设置超时
          setTimeout(function () {
            if (request.readyState !== 4) {
              request.abort();
            }
          }, timeout);
        }
      }
    };
  }($);

}(window);
