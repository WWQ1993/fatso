/**
 * Created by WWQ on 2016/3/15 0015.
 */

    //传入父节点选择器、左图片、右图片、事件回调函数
    window.calendar = function (parentNode, leftImgUrl, rightImgUrl, callback) {
        function getWeekResult(inputYear, inputMonth, inputDay) {
            var static = {
                    base: {
                        year: 2000,
                        month: 1,
                        day: 1,
                        week: 6
                    },
                    week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    monthDayCount: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                },
                result = null,
                leapyear = (inputYear % 400 === 0 || (inputYear % 4 === 0 && inputYear % 100 !== 0)) ? true : false,
                yearGap = 0,
                monthGap = 0,
                dayGap = 0,
                leapNum = 0,
                total = 0;

            yearGap = Math.abs(inputYear - static.base.year);
            monthGap = inputMonth - static.base.month;
            dayGap = inputDay - static.base.day;

            if (inputYear >= static.base.year) {
                if (yearGap % 4 !== 0) {
                    leapNum = parseInt(yearGap / 4) + 1;
                }
                else {
                    if ((inputMonth > 2 || (inputMonth === 2 && inputDay === 29)) && (yearGap % 100 !== 0 || yearGap % 400 === 0)) {

                        leapNum = parseInt(yearGap / 4) + 1;
                    }
                    else {
                        leapNum = parseInt(yearGap / 4);
                    }
                }
                for (var i = 0; i < monthGap; i++) {
                    total += static.monthDayCount[i];
                }
                total += dayGap + leapNum + yearGap;
                result = {
                    week: static.week[(total % 7 + 5) % 7],
                    numWeek: (total % 7 + 6) % 7
                }
            }
            else {
                if (yearGap % 4 !== 0) {
                    leapNum = parseInt(yearGap / 4);
                }
                else {
                    if (yearGap === 0) {
                        leapNum = parseInt(yearGap / 4);
                    }
                    if ((inputMonth <= 2 ) && (yearGap % 100 !== 0 || yearGap % 400 === 0)) {

                        if ((inputMonth === 2 && inputDay === 29)) {
                            leapNum = parseInt(yearGap / 4) + 1;

                        } else {
                            leapNum = parseInt(yearGap / 4);

                        }
                    }
                    else {
                        leapNum = parseInt(yearGap / 4) - 1;
                    }
                }
                for (var i = 0; i < monthGap; i++) {
                    total += static.monthDayCount[i];
                }
                total += dayGap - leapNum - yearGap;
                result = {
                    week: static.week[(total % 7 + 5) % 7],
                    numWeek: (total % 7 + 6) % 7
                }
            }
            return result;
        }


        var component = {
                main: $('.w_main'),
                nowYear: $('.w_year', this.main),
                nowMonth: $('.w_month', this.main)
            },
            monthDayCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            thisDate = new Date(),
            nowDate = {
                year: thisDate.getFullYear(),
                month: thisDate.getMonth() + 1,
                day: thisDate.getDate()
            },
            choosedDate = {},
            strBefore = ' <div class="w_main"><div class="chooser"><div class="chooseYear"><div class="before"><</div><div class="w_year">2016</div><div class="after">></div></div><div class="chooseMonth"><div class="before"><</div><div class="w_month">一</div><div class="after">></div></div></div><div class="weekNames"><div class="weekname">日</div><div class="weekname">一</div><div class="weekname">二</div><div class="weekname">三</div><div class="weekname">四</div><div class="weekname">五</div><div class="weekname">六</div></div><div class="w_days">',
            strAfter1 = '</div><div class="upArrow yearArrow"></div><div class="popYear pop">',
            strAfter2 = '</div><div class="upArrow monthArrow"></div><div class="popMonth pop"><div class="item">1</div><div class="item">2</div><div class="item">3</div><div class="item">4</div><div class="item">5</div><div class="item">6</div><div class="item">7</div><div class="item">8</div><div class="item">9</div><div class="item">10</div><div class="item">11</div><div class="item">12</div></div></div> ';

        if (typeof parentNode === 'string') {
            parentNode = $(parentNode);
        }

        setNowDate();
        addEventListener();

        function updateCalendar(year, month) { //更新日期主体
            var strMain = '',
                weekNum = getWeekResult(year, month, 1).numWeek,
                addBeforeNum = weekNum > 6 ? 0 : weekNum,
                leftLimit = 1900,
                rightLimit = 2100,
                popYearStr = '',
                strAfter = '';

            //设置日期开头空格
            for (var i = 0; i < addBeforeNum; i++) {
                strMain += '<div class="not_day"></div>';
            }

            //设置日期块
            monthDayCount = (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            for (var i = 0; i < monthDayCount[month - 1]; i++) {
                strMain += '<div class="w_day">' + (i + 1) + '</div>';
            }
            //设置年份弹出框
            for (var i = leftLimit; i < rightLimit; i++) {
                if (i === nowDate.year) {
                    popYearStr += '<div class="item choose">' + i + '</div>';

                }
                else {
                    popYearStr += '<div class="item">' + i + '</div>';
                }
            }

            strAfter = strAfter1 + popYearStr + strAfter2;

            if ($('.w_main').length < 1) {  //没有日历组件则新建
                $('head').append('<style>.w_main{width:100%;height:100%;position:relative}.w_main *{margin:0;padding:0}.w_main .chooser{width:100%;height:15%}.w_main .chooser div{ display:inline-block; *zoom:1;*display:inline;}.w_main .chooser>div{width:50%;height:100%}.w_main .chooser>div .before,.w_main .chooser>div .after{width:30%;height:100%;vertical-align:middle;cursor:pointer}.w_main .chooser>div .before:hover,.w_main .chooser>div .after:hover{background-color:#4cccc4}.w_main .chooser>div .before:active,.w_main .chooser>div .after:active{cursor:inherit}.w_main .chooser>div .before{ line-height: 38px;text-align: center;}.w_main .chooser>div .after{line-height: 38px;text-align: center;}.w_main .chooser .w_year,.w_main .chooser .w_month{width:40%;line-height:100%;text-align:center;vertical-align:middle;cursor:pointer}.w_main .chooser .w_year:active,.w_main .chooser .w_month:active{cursor:inherit}.w_main .weekNames{width:95%;line-height:2em;text-align:center;margin:auto;border-bottom:solid 1px #4cccc4}.w_main .weekNames .weekname{ display:inline-block; *zoom:1;*display:inline;width:14.25%;*width:14%;line-height:100%;color:#4cccc4}.w_main .w_days{width:95%;height:72%;margin:auto}.w_main .w_days .w_day{width:14.28%;*width:16.6%;height:17%; display:inline-block; *zoom:1;*display:inline;text-align:center;vertical-align:middle;cursor:pointer}.w_main .w_days .not_day{width:14.28%;*width:16.6%;height:17%;display:inline-block;*zoom:1;*display:inline;vertical-align: middle;}.w_main .w_days .w_day:hover{background-color:#4cccc4}.w_main .w_days .w_day:active{cursor:inherit}.w_main .w_days .w_day:before{content:" "; display:inline-block; *zoom:1;*display:inline;vertical-align:middle;width:0;height:100%}.w_main .w_days .choose{background-color:#ffeb3b}.w_main .w_btns{width:34%;text-align:center;height:13%;float:right}.w_main .w_btns>a{ display:inline-block; *zoom:1;*display:inline;color:#4cccc4;text-decoration:none;width:33%;height:100%;vertical-align:middle}.w_main .w_btns>.w_btn0{color:#66cc91}.w_main .w_btns>a:before{content:" "; display:inline-block; *zoom:1;*display:inline;vertical-align:middle;width:0;height:100%}.w_main .w_btns>a:hover{text-decoration:underline}.w_main .w_btns>a:active{cursor:inherit}.w_main .pop{display:none;background-color:white;box-sizing:border-box;width:20%;height:85%;border:solid 1px #dbdbdb;position:absolute;top:15%}.w_main .popYear{overflow-y:auto;left:15%}.w_main .popMonth{overflow-y:hidden;right:15%}.w_main .upArrow{display:none;position:absolute;top:12%;border-style:solid;border-width:6px;border-color:transparent transparent #dbdbdb transparent;height:0;width:0;font-size:0}.w_main .yearArrow{left:23%}.w_main .monthArrow{right:23%}.w_main .pop .item{width:100%;height:8.34%;box-sizing:border-box;border:solid 1px #dbdbdb;text-align:center;font-size:.7em;vertical-align:middle}.w_main .pop .item:before{content:" "; display:inline-block; *zoom:1;*display:inline;vertical-align:middle;width:0;height:100%}.w_main .pop .item:hover{cursor:pointer;background:#e8e8e8}.w_main .pop .item.choose{background-color:#dbdbdb}</style>')
                parentNode.append(strBefore + strMain + strAfter);
                component = {
                    main: $('.w_main'),
                    nowYear: $('.w_year', this.main),
                    nowMonth: $('.w_month', this.main)
                };
                component.nowYear.text(nowDate.year);
                component.nowMonth.text(nowDate.month);

                $('.w_main .pop .item').each(function () {  //设置月份弹出层默认选中当前月份
                    var target = $(this);
                    if (parseInt(target.text()) === nowDate.month) {
                        target.addClass('choose');
                    }
                });
            }
            else {  //有日历组件则更新
                $('.w_days', component.main).html(strMain);
            }

            //设置默认选中1号
            $('.w_days .w_day', component.main).each(function () {
                $(this).removeClass('choose');
                if ($(this).text() == 1) {
                    $(this).addClass('choose');
                }
            });
            choosedDate.day = 1;


            if(year===2017&&month===5){
              console.log('bingo')

              $('.w_day:nth-child(15)').addClass('heart');
              $('.w_day:nth-child(16)').addClass('heart');
              $('.w_day:nth-child(17)').addClass('heart');
              $('.w_day:nth-child(18)').addClass('heart');
              $('.w_day:nth-child(19)').addClass('heart');
              $('.w_day:nth-child(20)').addClass('heart');
              $('.w_day:nth-child(21)').addClass('heart');
            }

        }

        function setNowDate() {//设置当前日
            updateCalendar(nowDate.year, nowDate.month);
            choosedDate = $.extend(true, {}, nowDate);
            component.nowYear.text(nowDate.year);
            component.nowMonth.text(nowDate.month);
            $('.w_days .w_day', component.main).each(function () {
                $(this).removeClass('choose');
                if ($(this).text() == nowDate.day) {
                    $(this).addClass('choose');
                }
            });
        }

        function addEventListener() {
            //设置点击时，文本不可选
            component.main[0].onselectstart = (function () {
                return false;
            });
            //年份上翻
            $('.chooseYear .before', component.main).click(function (e) {
                choosedDate.year -= 1;
                component.nowYear.text(choosedDate.year);
                updateCalendar(choosedDate.year, choosedDate.month);
            });
            //年份下翻
            $('.chooseYear .after', component.main).click(function (e) {
                choosedDate.year += 1;
                component.nowYear.text(choosedDate.year);
                updateCalendar(choosedDate.year, choosedDate.month);
            });
            //月份上翻
            $('.chooseMonth .before', component.main).click(function (e) {
                choosedDate.month--;
                if (choosedDate.month < 1) {
                    choosedDate.month = 12;
                    choosedDate.year--;
                }
                component.nowMonth.text(choosedDate.month);
                component.nowYear.text(choosedDate.year);
                updateCalendar(choosedDate.year, choosedDate.month);
            });
            //月份下翻
            $('.chooseMonth .after', component.main).click(function (e) {
                choosedDate.month++;
                if (choosedDate.month > 12) {
                    choosedDate.month = 1;
                    choosedDate.year++;
                }
                component.nowMonth.text(choosedDate.month);
                component.nowYear.text(choosedDate.year);
                updateCalendar(choosedDate.year, choosedDate.month);
            });
            //‘今天’按钮
            $(' .w_btns>.w_btn0', component.main).click(setNowDate);

            //选择某日事件
            $('.w_days', component.main).click(function (e) {
                var target = $(e.target);
                if (target.hasClass('w_day')) {
                    choosedDate.day = parseInt(target.text());
                    target.siblings().each(function () {
                        $(this).removeClass('choose');
                    });
                    target.addClass('choose');
                    if(target.hasClass('heart')){
                      var $e =$('#diary  h2[data-id="05'+target.text()+'"]').next();
                      $('.detail ul').html($e.html())
                    }
                }

            });
            //‘取消’按钮
            $('.w_btns>.w_btn1', component.main).click(function () {
                callback({action: 'close', choose: null});
            });
            //确定按钮
            $('.w_btns>.w_btn2', component.main).click(function () {
                callback({action: 'choose', choose: choosedDate});
            });

            //点击顶部数字，弹出年份选择器
            $('.chooser .w_year', component.main).click(function (e) {
                component.main.click();
                e.stopPropagation();
                var popYear = $(' .popYear', component.main);
                popYear.toggle();
                $('.yearArrow').toggle();

                $('.popYear .item', component.main).each(function () {
                    if ($(this).text() == choosedDate.year) {
                        $(this).siblings().removeClass('choose');
                        $(this).addClass('choose');
                        return false;
                    }

                });

                popYear.scrollTop($('.choose', popYear).position().top + popYear.scrollTop() - popYear.height() / 2);

            });
            //点击顶部数字，弹出月份选择器
            $(' .chooser .w_month', component.main).click(function (e) {
                component.main.click();
                e.stopPropagation();
                $(' .popMonth', component.main).toggle();
                $('.monthArrow').toggle();
                $('.popMonth .item', component.main).each(function () {
                    if ($(this).text() == choosedDate.month) {
                        $(this).siblings().removeClass('choose');
                        $(this).addClass('choose');
                        return false;
                    }
                });
            });
            //点击弹出的年份
            $('.popYear', component.main).click(function (e) {
                var target = $(e.target);
                if (target.hasClass('item')) {

                    choosedDate.year = parseInt(target.text());
                    component.nowYear.text(choosedDate.year);
                    updateCalendar(choosedDate.year, choosedDate.month);
                }
            });

            //点击弹出的月份
            $('.popMonth', component.main).click(function (e) {
                var target = $(e.target);
                if (target.hasClass('item')) {

                    choosedDate.month = parseInt(target.text());
                    component.nowMonth.text(choosedDate.month);
                    updateCalendar(choosedDate.year, choosedDate.month);
                }
            });
            //点击其他地方时，隐藏弹出层
            $(window).click(function () {
                $('.pop').each(function () {
                    $(this).hide();
                });

                $('.upArrow').each(function () {
                    $(this).hide();
                });
            });


        }
    $('.w_day.choose').click();
    };
