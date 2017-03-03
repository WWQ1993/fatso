/**
 * Created by wwq on 17/1/20.
 */
!function () {

  var spas = document.getElementsByClassName('spax'),
    length = spas.length,
    ajax = function (option) {

      var param = function (target) {
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
      var type = option.type && option.type.toUpperCase() || 'GET',
        url = option.url || window.location.href,
        data = option.data && param(option.data) || '',
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
  for ( var i = 0;  i < length;  i++ ) {
    spas[i].addEventListener('click',function (e) {
      e.preventDefault();
      var url = e.target.getAttribute('href');

      ajax({
        url: url,
        method: 'GET',
        success: function (e) {
          window.history.pushState({}, null, url);
          document.open('text/html',true);
          document.write(e);
          document.close();
        }
      });
    })
  }

  window.addEventListener('popstate', function (e) {
    console.log('reload')
    this.location.reload();
  }, false);
}();
