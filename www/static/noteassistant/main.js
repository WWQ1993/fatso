
/**
 * Created by WWQ on 2015/9/1 0001.
 * TODO: bugs： 从前往后的序号重排问题
 */
var $=function(id){
    return document.getElementById(id);
}
var WWQ={};
var Component = {}; //GUI控件命名空间
var Handle ={}; //事件处理函数命名空间
var Paragraph = {}; //段落相关命名空间

Component.toolBar=$('toolBar');
Component.content=$('innerContent');
Component.toolBar_B = $("toolBar_B");
Component.toolBar_I = $("toolBar_I");
Component.toolBar_U=$("toolBar_U");
Component.toolBar_C=$("toolBar_C");
Component.toolBar_E=$("toolBar_E");
Component.toolBar_L=$("toolBar_L");
Component.toolBar_R=$("toolBar_R");
Component.toolBar_N=$("toolBar_N");
Component.toolBar_S=$("toolBar_S");
Component.toolBar_M=$("toolBar_M");
//Component.toolBar_D=$("toolBar_D");

Component.chooseColor=$('chooseColor');
Component.yellowColorBtn=$('yellow');
Component.blueColorBtn=$('blue');
Component.pinkColorBtn=$('pink');
Component.orangeColorBtn=$('orange');
Component.chooseLevelNum = $('chooseLevel');
Component.test1=$('test');
Component.test2=$('test2');
Component.numberList = $('numberList');
Component.symbolList = $('symbols');//符号竖条控件
Component.message = $('message');
WWQ.levelNum = 5;
WWQ.symbolsLevel=[]; //符号竖条字符
WWQ.symbolsOneArr = ['一.','1.','(1)','○','■','□','○','■']; //显示符号横栏字符
WWQ.allSymbolsArr = []; //按符号竖条顺序保存每个符号所有项数组
WWQ.choosedLevel = 0;  //选中的等级
WWQ.currentSymbolsArr=[]; //当前所需级别符号数组。按符号横栏顺序排。
WWQ.choosedLevelBuf={};
WWQ.mouseDown={};
WWQ.selectedText = "";
WWQ.choosedColor = 'rgba(255, 120, 0,0.6)';
WWQ.color={
    yellow:'rgba(255, 255, 0, 0.8)',
    blue:'rgba(0, 0, 255,0.4)',
    pink:'rgba(255, 0, 255,0.4)',
    orange:'rgba(255, 120, 0,0.6)'
};

WWQ.buf = {};

WWQ.storage = {};//缓存本地数据

Component.toolBar_C.style.backgroundColor=WWQ.choosedColor;

Component.toolBar_N.style.textAlign= 'left';



//窗口变化大小相关
(function(){
    var tid ;

    setTimeout(function () {
        $('content').style.marginTop=$('tools').offsetHeight + 'px';
    },100);

    //停止拖动窗口100ms后执行
    window.onresize = function(){

        clearTimeout(tid);
        tid = setTimeout(function(){
            Component.content.style.marginTop=$('tools').offsetHeight + 'px';
            $('content').style.marginTop=$('tools').offsetHeight + 'px';

            var paragraph = document.querySelectorAll('#innerContent>p>p');
            for(var i = 0; i < paragraph.length; i++){
                if(window.innerWidth<400){
                    paragraph[i].style.width = '87%';
                }
                else{
                    paragraph[i].style.width = '87%';
                }
            }
            if(Component.toolBar.offsetTop>20){
                Component.toolBar.style.paddingLeft = '3px';
                Component.toolBar.style.paddingRight = '22px';
            }
            else{
                Component.toolBar.style.paddingLeft = '25px';
                Component.toolBar.style.paddingRight = '0';
            }

        },50);
    };
    window.onresize();
})();




//分级符号初始化
(function(){
    var i,
        str0,
        str1,
        str2,
        str,
        str4,
        str5,
        str6,
        str7,
        str8,
        str9,
        str10

    for(i = 0; i < 9; i++){
        WWQ.allSymbolsArr[i]=[];
    }

    for(i = 1; i < 100; i++){
        str = i;
        str2 = str0 = i.toString();

        if(str0 > 9)
        {
            str0=str0.split("");
            str0.splice(1,0,"A")
            str0=str0.join("");
        }
        str0 = str0.replace(/1/g,'一')
            .replace(/2/g,'二')
            .replace(/3/g,'三')
            .replace(/4/g,'四')
            .replace(/5/g,'五')
            .replace(/6/g,'六')
            .replace(/7/g,'七')
            .replace(/8/g,'八')
            .replace(/9/g,'九')
            .replace(/A0/g,'十')
            .replace(/A/g,'十')
            .replace('一十','十');
        WWQ.allSymbolsArr[0].push(str0);

        str1 = str2 + '.';
        WWQ.allSymbolsArr[1].push(str1);

        str2 ="(" + str2 + ')';
        WWQ.allSymbolsArr[2].push(str2);

        var str30=parseInt(str /10, 10), //十位
            str31= str % 10;
        switch (str30){
            case 0:str30 = '';break;
            case 1:str30 = 'X';break;
            case 2:str30 = 'XX';break;
            case 3:str30 = 'XXX';break;
            case 4:str30 = 'XL';break;
            case 5:str30 = 'L';break;
            case 6:str30 = 'LX';break;
            case 7:str30 = 'LXX';break;
            case 8:str30 = 'LXX';break;
            case 9:str30 = 'XC';break;
        }
        switch (str31){
            case 0:str31 = '';break;
            case 1:str31 = 'I';break;
            case 2:str31 = 'II';break;
            case 3:str31 = 'III';break;
            case 4:str31 = 'IV';break;
            case 5:str31 = 'V';break;
            case 6:str31 = 'VI';break;
            case 7:str31 = 'VII';break;
            case 8:str31 = 'VIII';break;
            case 9:str31 = 'IX';break;
        }
        WWQ.allSymbolsArr[3].push(str30 + str31);

        var str40,  //左位
            str41;
        if (str<27){
            str40 = '';
            str41 = String.fromCharCode(64 + str);
        } else{
            str40 = parseInt(str /26, 10);
            str41= (str) % 26;
            if(str41===0) {
                str40--;
                str41=26;
            }
            str40 = String.fromCharCode(64 + str40);
            str41 = String.fromCharCode(64 + str41);
        }

        WWQ.allSymbolsArr[4].push(str40 + str41);

        var str50,  //左位
            str51;

        if (str<27){
            str50 = '';
            str51 = String.fromCharCode(96 + str);

        } else{
            str50 = parseInt(str /26, 10);
            str51= str % 26;
            if(str51===0) {
                str50--;
                str51=26;
            }
            str50 = String.fromCharCode(96 + str50);
            str51 = String.fromCharCode(96 + str51);
        }
        WWQ.allSymbolsArr[5].push(str50 + str51);
    }
    WWQ.allSymbolsArr[6]='○';
    WWQ.allSymbolsArr[7]='●';
    WWQ.allSymbolsArr[8]='□';
    WWQ.allSymbolsArr[9]='■';
    WWQ.allSymbolsArr[10]='';



    WWQ.levelSymbolsControl={};

    WWQ.levelSymbolsControl.getSymbol=function(currentlevel){
        var arr = WWQ.currentSymbolsArr[currentlevel-1];
        if(Array.isArray(arr)){
            arr.index=arr.index||0;
            arr.index++;
            return arr[arr.index-1];
        }
        return arr;
    };
    WWQ.levelSymbolsControl.resetSymbols=function(currentlevel) {
        if(Array.isArray(WWQ.currentSymbolsArr[currentlevel-1])){
            WWQ.currentSymbolsArr[currentlevel-1].index=0;
        }
        WWQ.currentSymbolsArr[currentlevel-1] = WWQ.allSymbolsArr[WWQ.choosedLevelBuf[currentlevel-1]||(currentlevel-1)];
    }
}());


//缓存相关
(function(){
    WWQ.storage.save = function () {
        localStorage.Note = JSON.stringify(getNodeCopy());
        localStorage.symbols = JSON.stringify(getSymbols());
        localStorage.levelNum = JSON.stringify(WWQ.levelNum);
        WWQ.showMessage('已保存到本地缓存');
        console.log(getNodeCopy());
    };

    WWQ.storage.clear = function () {
        delete localStorage.Note;
        delete localStorage.symbols;
        delete localStorage.levelNum;

        WWQ.showMessage('已清除当前缓存');
        setTimeout(function () {
            location.reload();
        },1000);
    };

    function getSymbols () {
        var symbols = [];
        for(var i = 0; i < 8; i++){
            symbols.push(WWQ.currentSymbolsArr[i]);
        }
        return symbols;
    };

    //对内容节点的拷贝（避免对parentArr循环引用）
    function getNodeCopy(){

        var tree = Paragraph.interface('tree'),
            result = [];

        Paragraph.interface('updateSymbols') ;

        function innerFunction(arr){

            for(var i = 0; i < arr.length; i++){
                if(Array.isArray(arr[i])){
                    arguments.callee(arr[i]);

                } else {

                    result.push({
                        html:arr[i].domNode.firstElementChild.nextElementSibling.innerHTML,
                        level:arr[i].level,
                        index:arr[i].index,
                        center:arr[i].domNode.firstElementChild.nextElementSibling.style.textAlign||
                        'left'
                    });
                }
            }
        };

        innerFunction(tree);
        return result;
    };

    window.onload = function () {
        if( localStorage.Note ){

            var Note = JSON.parse(localStorage.Note);

            if(Note.length>0){
                for(var i = 0; i < Note.length; i++){
                    Paragraph.interface('restore',[Note[i].html,
                        Note[i].level,Note[i].index,Note[i].center])

                }
            }
        };
    };

    if(!localStorage.levelNum){
        localStorage.levelNum  = WWQ.levelNum;
    }

    if(localStorage.symbols ) {
        var symbols = JSON.parse(localStorage.symbols);
        WWQ.levelNum = JSON.parse(localStorage.levelNum);

        for (var i = 0; i < symbols.length; i++) {
            WWQ.currentSymbolsArr[i]=symbols[i];
            WWQ.symbolsOneArr[i] = WWQ.currentSymbolsArr[i][0];
            if(!WWQ.symbolsOneArr[i]){
                WWQ.symbolsOneArr[i] = '×';
            }

        }
        //setTimeout(function () {
        //    Handle.updateLevelDisplay();
        //},100);
    } else{
        //按照横栏初始值初始化符号等级
        WWQ.currentSymbolsArr[0] = WWQ.allSymbolsArr[0];
        WWQ.currentSymbolsArr[1] = WWQ.allSymbolsArr[1];
        WWQ.currentSymbolsArr[2] = WWQ.allSymbolsArr[2];
        WWQ.currentSymbolsArr[3] = WWQ.allSymbolsArr[6];
        WWQ.currentSymbolsArr[4] = WWQ.allSymbolsArr[9];
        WWQ.currentSymbolsArr[5] = WWQ.allSymbolsArr[8];
        WWQ.currentSymbolsArr[6] = WWQ.allSymbolsArr[6];
        WWQ.currentSymbolsArr[7] = WWQ.allSymbolsArr[9];
    }

    //ctrl s
    document.addEventListener('keydown', function (event) {
        if(event.keyCode===83 && event.ctrlKey){
            WWQ.storage.save();
            event.preventDefault();
        }
    });
    // ctrl m
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey ){
            if(event.keyCode===77){
                WWQ.storage.clear();
                event.preventDefault();
            }
        }
    });
}());

//Paragraph模型
(function(){
    var rootNode = [], //根节点
        id = 0; //唯一标识符，只加不减。

    rootNode.domNode = Component.content;

    //设置段落获取焦点时触发事件
    function setFocusEvent(textArea){
        //获取焦点时移除空行;setTimeout解决iE兼容性问题
        setTimeout(function () {
            textArea.addEventListener('focus',function(){
                removeNullParagraph();
                Component.toolBar_N.style.textAlign = document.activeElement.style.textAlign||'left';

            });
        },100);
    };


    //模块接口
    Paragraph.interface = function (func,args) {
        switch (func)  {
            case 'updateSymbols':
                updateSymbols();
                break;
            case 'newline':

                newline();
                break;
            case 'levelUp':
                levelUp();
                break;
            case 'levelDown':
                levelDown();
                break;
            case 'createParagraph':
                createParagraph(args);
                break;
            case 'center':
                center();
            case 'tree':
                return rootNode;
            case 'restore':
                restore.apply(this,args);
        }
    }

    var restore = function (html,level,index,center) {

        var newParagraph = document.createElement("p"),
            span,
            textArea=document.createElement('p');

        newParagraph.style.marginLeft=(25* level) +"px";
        newParagraph.className = 'h'+ level;

        textArea.setAttribute('contenteditable','true');
        textArea.innerHTML = html;
        textArea.style.textAlign = center;
        span = document.createElement('span');
        span.classList.add('spanLevel');

        newParagraph.appendChild(span);
        newParagraph.appendChild(textArea);

        var fatherNode = null,
            newNode = new CreateTreeNode(newParagraph);

        var innerFunction = function (faNode,lev) {
            if(lev === 1){
                faNode.push(newNode);
            }
            else {
                lev--;
                faNode.push([]);
                arguments.callee(faNode[faNode.length-1],lev);
            }
        };
        innerFunction(rootNode,level);
        getNodeById(newNode.id);

        Component.content.appendChild(newNode.domNode);

        newNode.domNode.id=newNode.id;
        newNode.level = level;
        updateSymbols();

        setFocusEvent(textArea);
    };

    //创建树节点
    var CreateTreeNode = function(domNode){
        this.id = id;
        id++;
        this.index = 0; //节点处于父数组下的位置
        this.level = 0; //节点层级
        this.parentArr = []; //当前节点的父数组
        this.domNode = domNode; //指向一个DOM节点。
    };

    //返回id对应节点
    var getNodeById =function(refId){
        var deepthbuf=0;

        function innerFunction(refId,arr){
            deepthbuf++;

            for(var i = 0; i < arr.length; i++){
                if(Array.isArray(arr[i])){
                    var node;
                    if( node = arguments.callee(refId,arr[i])){
                        return node;
                    }
                } else if(arr[i].id==refId){
                    arr[i].index = i;
                    arr[i].level = deepthbuf;
                    arr[i].parentArr = arr;
                    return arr[i];
                }
            }
            deepthbuf--;
        };

        return innerFunction(refId,rootNode);
    };
    //获得传入数组的信息（其父数组、下标索引）
    var getArrData = function(array){

        function innerFunction(inputArray,arr){
            for(var i = 0; i < arr.length; i++){
                if(Array.isArray(arr[i])){
                    if(arr[i]===inputArray){
                        arr[i].inde = i;
                        arr[i].parentArr = arr;
                        return arr[i];
                    }
                    else{
                        //  to be or not to be return——> 递归的关键细节。错误示例：
                        //  arguments.callee(inputArray,arr[i])； 导致最终返回值可能为空（即使找到了）
                        //  return arguments.callee(inputArray,arr[i])； 循环失效
                        var node;
                        if(node= arguments.callee(inputArray,arr[i])){
                            return node;
                        }
                    }
                }
            }
        };
        return innerFunction(array,rootNode);
    }

    //在（本级、上级、下级）建立节点
    var createNodeAfterId = function(refId,domNode,lowerLevel,higherLevel){

        var newNode = new CreateTreeNode(domNode);

        if(refId===null){   //建立rootNode下第一个节点
            rootNode.push(newNode);
            getNodeById(newNode.id);
            return newNode;
        }

        var result = getNodeById(refId);

        if (!result){   //传入id无效
            console.log(refId+" ：传入id无效");
            return false;
        }
        if (lowerLevel){    //在参考节点后建立下层节点

            result.parentArr.splice(result.index+1,0,[newNode]);

        } else if(higherLevel){ //将元素、元素后的兄弟节点构成的数组 移至其父数组后

            var itsParent = getArrData(result.parentArr),
                nodesAfterthisArr = [];

            for(var j = result.index+1; j<itsParent.length; j++){
                nodesAfterthisArr.push(itsParent[j]);
            }

            if(nodesAfterthisArr.length>0){
                itsParent.parentArr.splice(itsParent.inde+1,0,newNode,nodesAfterthisArr);

            } else {
                itsParent.parentArr.splice(itsParent.inde+1,0,newNode);
            }

            removeNodeById(refId);

            getNodeById(newNode.id);

            //如果移动后数组为空则删除原数组
            itsParent.length=result.index;
            if(!itsParent.length){
                itsParent.parentArr.splice(itsParent.inde,1);
            }
        }

        else{ //在参考节点后建立兄弟节点
            result.parentArr.splice(result.index+1,0,newNode);
        }

        getNodeById(newNode.id);
        return newNode;
    };

    //删除id对应节点
    var removeNodeById = function(id){
        var result= getNodeById(id);
        return result.parentArr.splice(result.index,1);
    };

    //更新所有符号
    var updateSymbols=function(){
        var thisParagraph = document.querySelectorAll('#innerContent>p');
        for(var i = 0; i < thisParagraph.length; i++){
            var node = getNodeById(thisParagraph[i].id);

            //如果和前一个节点处于同级，合并两个节点
            if(thisParagraph[i].previousElementSibling &&
                getNodeById(thisParagraph[i].previousElementSibling.id).level===
                node.level ) {

                newNode = createNodeAfterId(thisParagraph[i].previousElementSibling.id,thisParagraph[i]);
                removeNodeById(thisParagraph[i].id);
                newNode.domNode.id=newNode.id;
                node = getNodeById(thisParagraph[i].id);
            }

            // 去除数组节点对同级编号的影响
            var  realIndex = 0;
            node.parentArr.forEach(function(childNode,index){
                if(!Array.isArray(childNode)) {
                    childNode.realIndex = realIndex++;
                }
            });

            //设置编号样式
            thisParagraph[i].firstElementChild.innerHTML=WWQ.currentSymbolsArr[node.level-1][node.realIndex]||
                WWQ.currentSymbolsArr[node.level-1];
        }
    };

    //删除空行
    var removeNullParagraph=function(){
        var textContent = document.querySelectorAll('#innerContent>p>p');
        if(textContent[0])

            for(var i = 0; i < textContent.length; i++){
                if(textContent[i].innerHTML===''||  textContent[i].innerHTML.toLowerCase()=== '<br>'){
                    removeNodeById(textContent[i].parentNode.id);
                    Component.content.removeChild(textContent[i].parentNode) ;
                }
            }
        updateSymbols();
    };

    //"点击文末下方"，新建平级段
    var createParagraph = function(domNode){
        removeNullParagraph();

        var newParagraph = document.createElement("p"),
            lastParagraph = Component.content.lastElementChild||null,
            currentLevel =lastParagraph&&getNodeById(lastParagraph.id).level|| 1,
            span,
            textArea=document.createElement('p'),
            newNode;

        newParagraph.style.marginLeft=(25*currentLevel) +"px";
        newParagraph.className = 'h'+currentLevel;

        textArea.setAttribute('contenteditable','true');
        span = document.createElement('span');
        span.classList.add('spanLevel');

        newParagraph.appendChild(span);
        newParagraph.appendChild(textArea);

        if (lastParagraph) {
            newNode = createNodeAfterId(lastParagraph.id,newParagraph);
        } else{
            newNode = createNodeAfterId(null,newParagraph);
        }
        if(domNode){
            Component.content.appendChild(domNode);
        } else{
            Component.content.appendChild(newNode.domNode);
        }
        textArea.focus();

        newNode.domNode.id=newNode.id;
        updateSymbols();

        setFocusEvent(textArea);
    };

    //"↓"  切割某段至新建的平级段
    var newline=function(){

        var thisTextArea = document.activeElement;
        var oriText = thisTextArea.innerHTML+'';
        document.execCommand('createlink',false,"mark");

        var newString = thisTextArea.innerHTML.replace('<a href="mark">','<#>');
        newString = newString.replace(/<a href="mark">/g,'');   //清除富文本自动<a>嵌套
        newString= newString.replace(/<\/a>/,'');
        newString= newString.split('<#>');

        //解决切割后的特效消失问题
        (function dealTheString(){
            var bString = newString[0],
                aString = newString[1],
                Reg = /<(\/)?([^\s>]+)[^>]*>/g,
                resultArrB = [],
                resultArrA = [],
                tag = {},
                i = 0,
                pushToAfter = [],
                pushToBefore = [],
                regResult;

            //before
            while (regResult = Reg.exec(bString)){
                resultArrB.unshift(regResult);
            }
            for(i = 0; i < resultArrB.length; i++){
                tag[resultArrB[i][2]] = tag[resultArrB[i][2]] || 0;
                if (resultArrB[i][1]==="/"){
                    tag[resultArrB[i][2]]--;
                } else{
                    tag[resultArrB[i][2]]++;
                }
                if(tag[resultArrB[i][2]]===1){
                    tag[resultArrB[i][2]]=0;
                    if(resultArrB[i][0].search(/br/)==-1){
                        pushToAfter.unshift(resultArrB[i][0]);
                    }
                }
            }
            pushToAfter=pushToAfter.join('');

            //after
            tag = {};
            while (regResult = Reg.exec(aString)){
                resultArrA.push(regResult);
            }
            for(i = 0; i < resultArrA.length; i++){
                tag[resultArrA[i][2]] = tag[resultArrA[i][2]] || 0;

                if (resultArrA[i][1]==="/"){
                    tag[resultArrA[i][2]]--;
                } else{
                    tag[resultArrA[i][2]]++;
                }
                if(tag[resultArrA[i][2]]===-1){
                    tag[resultArrA[i][2]]=0;
                    pushToBefore.push(resultArrA[i][0]);
                }
            }
            pushToBefore=pushToBefore.join('');

            newString[0]= newString[0] + pushToBefore ;
            newString[1]=pushToAfter+ newString[1] ;
        }());

        var newParagraph = document.createElement("p"),
            thisParagraph = thisTextArea.parentNode,
            currentLevel =getNodeById(thisParagraph.id).level,
            span,
            textArea=document.createElement('p'),
            newNode;

        newParagraph.style.marginLeft=(25*currentLevel) +"px";
        newParagraph.className = 'h'+currentLevel;

        textArea.setAttribute('contenteditable','true');
        span = document.createElement('span');
        span.classList.add('spanLevel');

        newParagraph.appendChild(span);
        newParagraph.appendChild(textArea);

        newNode = createNodeAfterId(thisParagraph.id,newParagraph);

        newNode.domNode.id=newNode.id;

        Component.content.insertBefore(newNode.domNode,thisParagraph.nextElementSibling);

        textArea.focus();
        thisTextArea.innerHTML = newString[0];
        textArea.innerHTML = newString[1];


        setFocusEvent(textArea);
        removeNullParagraph();
    };
    //<- 本段级别提升
    var levelUp=function(){
        var thisTextArea = document.activeElement,
            thisParagraph = thisTextArea.parentNode,
            currentLevel = getNodeById(thisParagraph.id).level,
            newNode;

        currentLevel--;
        if(currentLevel<1){
            WWQ.showMessage('到头了')
            return;
        }
        thisParagraph.style.marginLeft=(25*currentLevel) +"px";
        thisParagraph.className = 'h'+currentLevel;
        newNode =createNodeAfterId(thisParagraph.id,thisParagraph,false,true);

        newNode.domNode.id=newNode.id;
        updateSymbols();
    };
    //-> 本段级别下降
    var levelDown = function () {
        var thisTextArea = document.activeElement,
            thisParagraph = thisTextArea.parentNode,
            currentLevel = getNodeById(thisParagraph.id).level,
            newNode;

        currentLevel++;
        if(currentLevel>WWQ.levelNum){
            WWQ.showMessage('到尾了')
            return;
        }
        thisParagraph.style.marginLeft=(25*currentLevel) +"px";
        thisParagraph.className = 'h'+currentLevel;

        newNode =createNodeAfterId(thisParagraph.id,thisParagraph,true);

        removeNodeById(thisParagraph.id);
        newNode.domNode.id=newNode.id;
        updateSymbols();

    };

    var center =function(){
        var thisTextArea = document.activeElement;
        thisTextArea.style.textAlign = thisTextArea.style.textAlign==="center"?'left':'center';
        Component.toolBar_N.style.textAlign= Component.toolBar_N.style.textAlign==="left"?'center':'left';
    };


}());

//符号横栏每项点击事件
Handle.levelList = function(event ){
    WWQ.choosedLevel = this.j;

    this.style.background="rgba(212, 212, 212, 1)";
    Component.symbolList.style.display = "block";

    Component.symbolList.style.left=this.offsetLeft +'px';
    if (navigator.userAgent.indexOf('Firefox') >= 0){
        Component.symbolList.style.left=(this.offsetLeft-5) +'px';
    }
};

//按下按钮事件的处理方法
Handle.toolsBtnMouseDown = function(event ){
    this.style.background="#CACACA";
    event.preventDefault();
};

//鼠标从按下的按钮内移出 的处理方法
Handle.toolsBtnMouseOut = function( ){

    this.style.background="rgba(212, 212, 212, 1)";
};

//点击选择分级数目按钮时调用
Handle.chooseNumfunc = function(event){

    //图标切换
    Component.chooseLevelNum.style.backgroundPositionY = Component.chooseLevelNum.style.backgroundPositionY=="-18px"?"10px":"-18px"

    Component.numberList.style.display = "block";
    Component.numberList.style.left=(Component.chooseLevelNum.offsetLeft )+'px';
    if (navigator.userAgent.indexOf('Firefox') >= 0){
        Component.numberList.style.left=(Component.chooseLevelNum.offsetLeft-5) +'px';

    }
    this.style.border = 'outset thin rgba(212, 212, 212, 1)';
};

//符号横条更新
(Handle.updateLevelDisplay=function(){
    var i,
        j,
        childNodes = $('levelDetail').childNodes;

    Component.numberList.style.display = "none";
    Component.chooseLevelNum.style.backgroundPositionY = "10px"
    Component.symbolList.style.display = "none";

    setTimeout(function () {
        Component.content.style.marginTop=$('tools').offsetHeight + 'px';
    },100)

    //横条每项：
    for(i = 0, j = 0; i < childNodes.length; i++) {
        //隐藏每项
        if (childNodes[i].nodeType === 1 ) {
            childNodes[i].style.display="none";
        }
        //设置要显示的项
        if (childNodes[i].nodeType === 1 && j<WWQ.levelNum) {
            childNodes[i].style.display="inline-block";
            childNodes[i].innerHTML=WWQ.symbolsOneArr[j];
            childNodes[i].addEventListener('mousedown',Handle.toolsBtnMouseDown);
            childNodes[i].addEventListener('mouseout',Handle.toolsBtnMouseOut);

            childNodes[i].j = j;
            childNodes[i].addEventListener('click', Handle.levelList);
            j++;
        }
    }
})();

//符号竖条
(function(){
    var i,
        j,
        childNodes = Component.symbolList.childNodes;
    //符号竖条每一项
    for(i = 0, j = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType === 1 ) {

            //保存字条的每一项
            WWQ.symbolsLevel.push(childNodes[i].innerHTML);
            //按下鼠标事件
            childNodes[i].addEventListener('mousedown', function (event) {
                WWQ.underChooseS=true;
                this.style.background="#CACACA";
                event.preventDefault();
            });
            //鼠标移除事件
            childNodes[i].addEventListener('mouseout',Handle.toolsBtnMouseOut);

            //选好某一级符号后触发
            childNodes[i].ind= j;
            childNodes[i].addEventListener('click',function(event ){
                this.style.background="rgba(212, 212, 212, 1)";
                WWQ.underChooseS=false;

                WWQ.symbolsOneArr[WWQ.choosedLevel] = WWQ.symbolsLevel[this.ind];
                Handle.updateLevelDisplay();
                WWQ.choosedLevelBuf[WWQ.choosedLevel] = this.ind;
                WWQ.currentSymbolsArr[WWQ.choosedLevel] = WWQ.allSymbolsArr[WWQ.choosedLevelBuf[WWQ.choosedLevel]];
                Paragraph.interface('updateSymbols') ;
            });
            j++;
        }
    }

})();

//bar点击相关
(function(){

    WWQ.showColorSelector = function(){
        Component.chooseColor.style.opacity='1';
        Component.chooseColor.style.display="block";
        Component.chooseColor.style.left=this.offsetLeft+'px';
        if (navigator.userAgent.indexOf('Firefox') >= 0){
            Component.chooseColor.style.left=(this.offsetLeft-5) +'px';
        }
    }

    Handle.toolBarMouseDown = function(event) {
        if(event.button === 0){
            this.style.backgroundColor="#CACACA";
            Component.chooseColor.style.display="none";
            WWQ.buf.secClick=false;
        }
        event.preventDefault(); //使按钮文字不可选,已选的文本不失焦
    };

    Handle.toolBarMouseUp = function(event){

        this.style.backgroundColor="rgba(212, 212, 212, 1)";

        if(this.id==='toolBar_S'){
            WWQ.storage.save();
            return;
        } else if(this.id==='toolBar_M'){
            WWQ.showMessage('按Ctrl M以清除本地缓存')
            return;
        }
        //else if(this.id==='toolBar_D'){
        //    var textArea = document.querySelectorAll('p[contenteditable]');
        //    for(var i = 0; i < textArea.length; i++){
        //        textArea[i].setAttribute('contenteditable',false);
        //    }
        //    WWQ.showMessage('转化成功'+textArea.length);
        //    return;
        //}

        if(document.activeElement.nodeName!=='P'){
            WWQ.showMessage("请选中文本")
            return;
        }
        if(event.button === 0){
            if(!WWQ.selectedText){   //未选择文字
                switch (this.id){

                    case 'toolBar_B':
                    case 'toolBar_I':
                    case 'toolBar_U':
                        WWQ.showMessage('请选取文字');
                        break;
                }
            }
            else{
                switch (this.id){
                    case 'toolBar_B':
                        document.execCommand('bold',false,null);
                        break;
                    case 'toolBar_I':
                        document.execCommand('italic',false,null);
                        break;
                    case 'toolBar_U':
                        document.execCommand('underline',false,null);
                        break;
                }
            }
            switch (this.id) {
                case 'toolBar_E':
                    if(!WWQ.selectedText){
                        var thisParagraph = document.activeElement.parentNode;
                        if(thisParagraph.nextElementSibling) {
                            thisParagraph.nextElementSibling.firstElementChild.nextElementSibling.focus();
                        } else{
                            Paragraph.interface('createParagraph') ;
                        }
                    }
                    else{
                        Paragraph.interface('newline');
                        WWQ.showMessage('切割文本成功')
                    }
                    break;
                case 'toolBar_L':
                    Paragraph.interface('levelUp');
                    break;
                case 'toolBar_R':
                    Paragraph.interface('levelDown');
                    break;
                case 'toolBar_N':
                    Paragraph.interface('center');
                    break;
            }
        }
        event.stopPropagation(); //避免隐藏bar。

    };
    Handle.toolBarMouseout=function(){
        this.style.backgroundColor="rgba(212, 212, 212, 1)";
    };

    function addListener(target){
        target.addEventListener("mousedown",Handle.toolBarMouseDown);
        target.addEventListener("mouseup",Handle.toolBarMouseUp);;
        target.addEventListener("mouseout",Handle.toolBarMouseout);
    };

    addListener(Component.toolBar_B);
    addListener(Component.toolBar_I);
    addListener(Component.toolBar_U);
    addListener(Component.toolBar_E);
    addListener(Component.toolBar_L);
    addListener(Component.toolBar_R);
    addListener(Component.toolBar_N);
    addListener(Component.toolBar_S);
    addListener(Component.toolBar_M);
    //  addListener(Component.toolBar_D);

    Component.toolBar_C.addEventListener('mousedown', function (event) {
        this.style.opacity='0.6';

        event.preventDefault();  //避免隐藏颜色弹出框

    });
    Component.toolBar_C.addEventListener('mouseup', function (event) {
        if(!WWQ.buf.secClick){
            this.style.opacity='1';

            //弹出选色菜单
            WWQ.showColorSelector.call(this);
            event.stopPropagation(); //避免隐藏bar。
            WWQ.buf.secClick=true;
        }
        else {
            WWQ.buf.secClick=false;
            this.style.opacity='1';
            Component.chooseColor.style.display="none";
        }
    });
    Component.toolBar_C.addEventListener('mouseout', function (event) {
        this.style.opacity='1';
    });

    Component.chooseColorUp=function(event){
        var i = 0;
        WWQ.choosedColor=WWQ.color[this.id];
        Component.chooseColor.style.display="none";
        WWQ.buf.secClick=false;

        Component.toolBar_C.style.backgroundColor=WWQ.choosedColor;
        if(WWQ.selectedText){
            document.execCommand('backcolor',false,WWQ.choosedColor);
        }
        event.stopPropagation(); //避免隐藏bar。
    };
    Component.chooseColorDown=function(event){
        this.classList.add('blackBorder');
        event.preventDefault();
    };

    Component.blueColorBtn.addEventListener('mouseup',Component.chooseColorUp);
    Component.yellowColorBtn.addEventListener('mouseup',Component.chooseColorUp);
    Component.pinkColorBtn.addEventListener('mouseup',Component.chooseColorUp);
    Component.orangeColorBtn.addEventListener('mouseup',Component.chooseColorUp);

    Component.blueColorBtn.addEventListener('mousedown',Component.chooseColorDown);
    Component.yellowColorBtn.addEventListener('mousedown',Component.chooseColorDown);
    Component.pinkColorBtn.addEventListener('mousedown',Component.chooseColorDown);
    Component.orangeColorBtn.addEventListener('mousedown',Component.chooseColorDown);

    Component.chooseColor.addEventListener('mouseout',function(event){
        var nodes=this.childNodes,
            i = 0;
        for (i; i < nodes.length; i++ ){
            if(nodes[i].nodeType==1&& nodes[i].classList.contains('blackBorder'))
            {
                nodes[i].classList.remove('blackBorder');
            }
        }
    });
}());

//文档点击事件
(function () {
    //获取选中的文本
    WWQ.getSelectedText = function () {
        WWQ.selectedText = "";
        if(window.getSelection)
        {
            WWQ.selectedText=window.getSelection().toString();
        }
        else
        {
            WWQ.selectedText=document.selection.createRange().text.toString();
        }
    }

    //mousedown
    document.addEventListener('mousedown',function(event){

        if(event.button!==0){
            return;
        }
        WWQ.mouseDown.clientY=event.clientY;

        if(!WWQ.underChooseN && !WWQ.underChooseS &&   //没点数字条或者符号竖条
            (
                Component.numberList.style.display === "block"||
                Component.symbolList.style.display === "block"
            )
        ){
            Handle.updateLevelDisplay();
            event.preventDefault()
        }
    });

    //mouseup
    document.addEventListener('mouseup',function(event){

        event.preventDefault();

        if(event.button!==0){   //忽略非左击操作
            return;
        }

        WWQ.getSelectedText();

        Component.chooseColor.style.display="none";
        WWQ.buf.secClick=false;
        Component.symbolList.style.display="none";
        Component.numberList.style.display = "none";
        Component.chooseLevelNum.style.backgroundPositionY = "10px"

        //lastchild距离浏览器顶部距离。
        var lastY = 0;
        if(Component.content.lastElementChild){
            lastY=Component.content.lastElementChild.offsetTop + Component.content.lastElementChild.offsetHeight
                - (document.body.scrollTop||document.documentElement.scrollTop);
        } else{
            lastY=$('tools').offsetHeight;
        }

        //新建段落
        if ( WWQ.mouseDown.clientY>=lastY && event.clientY>=lastY){            //新建段落
            Component.toolBar_N.style.textAlign =  'left';
            Paragraph.interface('createParagraph') ;
        }
    });

    //屏蔽右击
    document.oncontextmenu = function(event){
        return false;
    };
})();

//选数按钮
(function(){
    Component.chooseLevelNum.addEventListener('mousedown',function(e){
        this.style.border = 'outset thin black';
    });
    Component.chooseLevelNum.addEventListener('click',Handle.chooseNumfunc);

}());

//数字条
(function () {
    var childNodes = Component.numberList.childNodes,
        arr = [],
        i,
        j;
    for(i = 0, j = 0; i < childNodes.length; i++){
        if(childNodes[i].nodeType === 1){
            j++;
            childNodes[i].ind = j;
            childNodes[i].addEventListener('mousedown',function(event){
                this.style.background="#CACACA";
                event.preventDefault();
                WWQ.underChooseN=true;
            });
            childNodes[i].addEventListener('mouseout',Handle.toolsBtnMouseOut);
            childNodes[i].addEventListener('click',function(event ){    //选好等级数
                WWQ.levelNum=this.ind;
                Handle.updateLevelDisplay();
                WWQ.underChooseN=false;
                this.style.background="rgba(212, 212, 212, 1)";
            });
        }
    }
})();

//通知窗
(function () {
    var tId = 0;
    var ntId = 0;
    WWQ.showMessage = function(str){
        Component.message.style.display = 'block';
        Component.message.style.opacity = 0;
        Component.message.innerHTML = str
        clearTimeout( tId);
        clearTimeout( ntId);
        var opacity = 0,
            showOut = false;

        (function(){
            if (!showOut){
                if(opacity<1.5)
                {
                    opacity+=0.02;
                    Component.message.style.opacity = opacity;
                }
                else{
                    showOut=true;
                }
                ntId = setTimeout(arguments.callee,10);
            }
            else{
                if(opacity<0){
                    return;
                }
                opacity-=0.02;
                Component.message.style.opacity = opacity;
                ntId = setTimeout(arguments.callee,10);
            }
        }());

        tId = setTimeout(function(){
            Component.message.style.display = 'none';
        },1500)
    }
}());

//快捷键
(function () {

    //变对应实体键颜色
    Handle.shortcutDown = function (event) {
        if(event.ctrlKey){
            WWQ.getSelectedText();

            switch (event.keyCode){
                case 66 :   //加粗
                    Component.toolBar_B.style.backgroundColor="#CACACA";

                    event.preventDefault();
                    break;
                case 73 :  //倾斜
                    Component.toolBar_I.style.backgroundColor="#CACACA";

                    event.preventDefault();
                    break;
                case 85 :  //下划线
                    Component.toolBar_U.style.backgroundColor="#CACACA";

                    event.preventDefault();
                    break;
                case  81:  //选色
                    Component.toolBar_C.style.opacity='0.7';
                    event.preventDefault();
                    break;
                case 40 :  //下
                    if(!WWQ.selectedText){
                        var thisParagraph = document.activeElement.parentNode;
                        if(thisParagraph.nextElementSibling) {
                            thisParagraph.nextElementSibling.firstElementChild.nextElementSibling.focus();
                        } else{
                            Paragraph.interface('createParagraph') ;
                        }
                    }
                    event.preventDefault();
                    break;
                case 37 :  //左
                    Component.toolBar_L.style.backgroundColor="#CACACA";

                    event.preventDefault();
                    break;
                case 39 :  //右
                    Component.toolBar_R.style.backgroundColor="#CACACA";

                    event.preventDefault();
                    break;
                case 69 :  //居中
                    Component.toolBar_N.style.backgroundColor="#CACACA";

                    event.preventDefault();
                    break;
                case 38:    //上
                    var thisParagraph = document.activeElement.parentNode;
                    if(thisParagraph.previousElementSibling){
                        thisParagraph.previousElementSibling.firstElementChild.nextElementSibling.focus();
                    }
                    break;
            }
        }
    }

    Handle.shortcutUp = function(event){
        if(event.ctrlKey){

            WWQ.getSelectedText();
            if(WWQ.selectedText){
                switch (event.keyCode) {
                    case 66 :   //加粗
                        document.execCommand('bold', false, null);
                        Component.toolBar_B.style.backgroundColor = "rgba(212, 212, 212, 1)";
                        event.preventDefault();
                        break;
                    case 73 :  //倾斜
                        document.execCommand('italic', false, null);
                        Component.toolBar_I.style.backgroundColor = "rgba(212, 212, 212, 1)";
                        event.preventDefault();
                        break;
                    case 85 :  //下划线
                        document.execCommand('underline', false, null);
                        Component.toolBar_U.style.backgroundColor = "rgba(212, 212, 212, 1)";
                        event.preventDefault();
                        break;
                    case  81:  //选色
                        document.execCommand('backcolor', false, WWQ.choosedColor);
                        Component.toolBar_C.style.opacity = "1";
                        event.preventDefault();
                        break;
                    case 40 :  //下
                        Paragraph.interface('newline') ;
                        WWQ.showMessage('切割文本成功')
                        Component.toolBar_E.style.backgroundColor="rgba(212, 212, 212, 1)";
                        event.preventDefault();
                        break;
                }
            }
            else{
                switch (event.keyCode){
                    case 66:
                    case 73:
                    case 85:
                    case 81:
                        WWQ.showMessage('请选取文字');
                        break;
                }
            }
            switch (event.keyCode){

                case 37 :  //左
                    Paragraph.interface('levelUp') ;
                    Component.toolBar_L.style.backgroundColor="rgba(212, 212, 212, 1)";
                    event.preventDefault();
                    break;
                case 39 :  //右
                    Paragraph.interface('levelDown') ;
                    Component.toolBar_R.style.backgroundColor="rgba(212, 212, 212, 1)";
                    event.preventDefault();
                    break;
                case 69 :  //居中
                    Paragraph.interface('center');
                    Component.toolBar_N.style.backgroundColor="rgba(212, 212, 212, 1)";
                    event.preventDefault();
                    break;
            }
        }
    };
    document.addEventListener('keydown',Handle.shortcutDown);
    document.addEventListener('keyup',Handle.shortcutUp);

}());

