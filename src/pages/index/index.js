import $ from '../../../vendor/jquery';
import WebStorageCache from '../../../vendor/web-storage-cache.min.js';
import Swiper from '../../../vendor/swiper.min';
import {_indexGg_,currChannel,_newsList_} from './index_gg';
import  '../../public-resource/sass/database.scss';
import  '../../public-resource/sass/common.scss';
import  '../../public-resource/sass/newindex.scss';
import  './style.scss';

/*var host = "http://172.18.250.87:8381/dfsports_h5/";//测试服
var hostDsp = "http://106.75.98.65/partner/list";//测试服*/

var host = 'http://dfsports_h5.dftoutiao.com/dfsports_h5/' // 线上
var hostDsp = "http://dftyttd.dftoutiao.com/partner/list";//线上
var homeLuoboApi = 'http://msports.eastday.com/json/msponts/home_lunbo.json';
var orderApi = 'http://dfty.dftoutiao.com/index.php/Home/WechatOrder/yuyue?system_id=9&machid='

var a=4
// module 初始化并将公共方法放这里管理,方便取用

var module = (function (my) {
    my.inits = my.inits || []
    Date.prototype.format = function (format) {
        var dict = {
            'y+': this.getFullYear(),
            'M+': this.getMonth() + 1,
            'd+': this.getDate(),
            'H+': this.getHours(),
            'h+': this.getHours() - 12,
            'm+': this.getMinutes(),
            's+': this.getSeconds()
        }
        for (var k in dict) {
            var reg = new RegExp(k, 'g')
            format = format.replace(reg, function (g0) {
                return ('000000' + dict[k]).slice(-g0.length)
            })
        }
        return format
    }
    // 启用fastclick
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    my.GLOBAL = {//工具函数
        makeJsonp(url, data) {
            return $.ajax({
                type: 'POST',
                data: data,
                url: url,
                dataType: 'jsonp',
                jsonp: 'callback'
            })
        },
        makeGet(url, data) {
            return $.ajax({
                type: 'GET',
                data: data,
                url: url,
                dataType: 'jsonp',
                jsonp: 'jsonpcallback'
            })
        },
        getUrlParam(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg) // 匹配目标参数
            if (r != null) return unescape(r[2])
            return null // 返回参数值
        },
        getScript(url, callback, element) {
            var head = document.getElementsByTagName('head')[0],
                js = document.createElement('script')

            js.setAttribute('type', 'text/javascript')
            js.setAttribute('src', url)
            if (element) {
                element.appendChild(js)
            } else {
                head.appendChild(js)
            }
            // 执行回调
            var callbackFn = function () {
                if (typeof callback === 'function') {
                    callback()
                }
            }

            if (document.all) { // IE
                js.onreadystatechange = function () {
                    if (js.readyState === 'loaded' || js.readyState === 'complete') {
                        callbackFn()
                    }
                }
            } else {
                js.onload = function () {
                    callbackFn()
                }
            }
        },
        CookieUtil: {
            /**
             * 设置cookie
             * @param name 名称
             * @param value 值
             * @param expires 有效时间（单位：小时）（可选） 默认：24h
             */
            set: function (name, value, expires) {
                var expTimes = expires ? (Number(expires) * 60 * 60 * 1000) : (24 * 60 * 60 * 1000) // 毫秒
                var expDate = new Date()
                expDate.setTime(expDate.getTime() + expTimes)
                var expString = expires ? '; expires=' + expDate.toUTCString() : ''
                var pathString = '; path=/'
                document.cookie = name + '=' + encodeURI(value) + expString + pathString
            },
            /**
             * 读cookie
             * @param name
             */
            get: function (name) {
                var cookieStr = '; ' + document.cookie + '; '
                var index = cookieStr.indexOf('; ' + name + '=')
                if (index !== -1) {
                    var s = cookieStr.substring(index + name.length + 3, cookieStr.length)
                    return decodeURI(s.substring(0, s.indexOf('; ')))
                } else {
                    return null
                }
            },
            /**
             * 删除cookie
             * @param name
             */
            del: function (name) {
                this.set(name, 'null', -1)
            }
        },
        isWeiXin() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        },
        computedWidth(arr, num) {//计算宽度 用于计算导航栏下划线位置
            var width = 0
            for (let i = 0; i < arr.length; i++) {
                if (i >= num) {
                    break
                } else {
                    width += arr[i]
                }
            }
            return width
        },
        getOsType() {
            var agent = navigator.userAgent.toLowerCase();
            var os_type = "";
            var version;
            if (/android/i.test(navigator.userAgent)) {
                var index = agent.indexOf("android");
                version = agent.substr(index + 8, 3);
                os_type = "Android " + version;
            }
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                var index = agent.indexOf("os");
                version = agent.substr(index + 3, 3);
                os_type = "iOS " + version;
            }
            if (/Linux/i.test(navigator.userAgent) && !/android/i.test(navigator.userAgent) && !/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                os_type = "Linux";
            }
            if (/windows|win32/i.test(navigator.userAgent)) {
                os_type = "windows32";
            }
            if (/windows|win32/i.test(navigator.userAgent)) {
                os_type = "windows64";
            }
            return os_type;
        },
        browserType() {
            var agent = navigator.userAgent.toLowerCase();
            var browser_type = "";
            if (agent.indexOf("msie") > 0) {
                browser_type = "IE";
            }
            if (agent.indexOf("firefox") > 0) {
                browser_type = "firefox";
            }
            if (agent.indexOf("chrome") > 0 && agent.indexOf("mb2345browser") < 0 && agent.indexOf("360 aphone browser") < 0) {
                browser_type = "chrome";
            }
            if (agent.indexOf("360 aphone browser") > 0 || agent.indexOf("qhbrowser") > 0) {
                browser_type = "360";
            }
            if (agent.indexOf("ucbrowser") > 0) {
                browser_type = "UC";
            }
            if (agent.indexOf("micromessenger") > 0) {
                browser_type = "WeChat";
            }
            if ((agent.indexOf("mqqbrowser") > 0 || agent.indexOf("qq") > 0) && agent.indexOf("micromessenger") < 0) {
                browser_type = "QQ";
            }
            if (agent.indexOf("miuibrowser") > 0) {
                browser_type = "MIUI";
            }
            if (agent.indexOf("mb2345browser") > 0) {
                browser_type = "2345";
            }
            if (agent.indexOf("sogoumobilebrowser") > 0) {
                browser_type = "sogou";
            }
            if (agent.indexOf("liebaofast") > 0) {
                browser_type = "liebao";
            }
            if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0 && agent.indexOf("ucbrowser") < 0 && agent.indexOf("micromessenger") < 0 && agent.indexOf("mqqbrowser") < 0 && agent.indexOf("miuibrowser") < 0 && agent.indexOf("mb2345browser") < 0 && agent.indexOf("sogoumobilebrowser") < 0 && agent.indexOf("liebaofast") < 0 && agent.indexOf("qhbrowser") < 0) {
                browser_type = "safari";
            }
            return browser_type;
        },
        getReferrer() {
            /**
             * Javascript获取页面来源(referer)
             * @from http://www.au92.com/archives/javascript-get-referer.html
             * @return {[type]} [description]
             */
            var referrer = '';
            try {
                referrer = window.top.document.referrer;
            } catch (e) {
                if (window.parent) {
                    try {
                        referrer = window.parent.document.referrer;
                    } catch (e2) {
                        referrer = '';
                    }
                }
            }
            if (referrer === '') {
                referrer = document.referrer;
            }
            return referrer;
        },
        getPageQid() {
            var qid = my.GLOBAL.getUrlParam('qid');
            var specialChannel;
            if (qid) {
                my.GLOBAL.CookieUtil.set('qid', qid)
            } else {
                // 通过搜索引擎进入的（渠道处理）
                specialChannel = [
                    { referer: 'baidu.com', qid: 'baiducom' }/*,
                     {referer: 'so.com', qid: '360so'},
                     {referer: 'sogou.com', qid: 'sogoucom'},
                     {referer: 'sm.cn', qid: 'smcn'},
                     {referer: 'm.tq1.uodoo.com', qid: 'smcn'}*/
                ];
                for (var i = 0; i < specialChannel.length; i++) {
                    if (my.GLOBAL.getReferrer() && my.GLOBAL.getReferrer().indexOf(specialChannel[i].referer) !== -1) {
                        my.GLOBAL.CookieUtil.set('qid', specialChannel[i].qid);//这个值为baiducom
                        break;
                    }
                }
            }
            qid = my.GLOBAL.CookieUtil.get('qid')
            if (!qid) {
                qid = 'null'
            }
            return qid
        },
        getUid() {
            var uid = my.GLOBAL.CookieUtil.get('uid')
            if (!uid) {
                uid = (+new Date()) + Math.random().toString(10).substring(2, 6);
                my.GLOBAL.CookieUtil.set('uid', uid, { expires: 365, path: '/', domain: 'eastday.com' });
            }
            return uid
        },
        formatTimeToMatch(currentServerTime, startTime) {
            var timestamp = Date.parse(startTime.replace(/-/g, '/'))
            var date = new Date(timestamp).format('MM月dd日')
            var time = startTime.substring(11)
            var todayTime = new Date(new Date(currentServerTime / 1).format('yyyy/MM/dd')).getTime()//今天12点的时间戳大小
            var chazhi = (new Date(timestamp).getTime() - todayTime) / (24 * 60 * 60 * 1000)
            if (chazhi >= 0 && chazhi < 1) {
                return time + '开始'
            } else if (chazhi >= 1 && chazhi < 2) {
                return '明天' + time
            } else if (chazhi >= 2 && chazhi < 3) {
                return '后天' + time
            } else {
                return date
            }
        }
    }
    return my
})(module || {})
// 首页数据 index_new
var module = (function (my) {
    var $swiperSlides = $('#mainSection').children('.swiper-wrapper').children('.swiper-slide') //外层swiper
    //导航条元素
    var $body = $('body');
    var $header = $('header')
    var $headNav = $('#headNav')
    var $headNavLi = $headNav.find('.nav-new ul li')
    var $headNavNew = $headNav.find('.nav-new')
    var $line = $headNav.find('.nav-new .line')
    var $pullDownLoadTips = $headNav.children('.pull-down-load-tips')
    var wsCache = new WebStorageCache()
    $body.append(`<div class="popup" id="popup"></div>`)  //加入弹窗
    var $popup = $('#popup');
    //定义需要传入接口的值
    var os = my.GLOBAL.getOsType()
    var recgid = my.GLOBAL.getUid()
    var qid = my.GLOBAL.getPageQid()
    var domain = 'dfsports_h5'
    var pixel = window.screen.width + '*' + window.screen.height
    class EastSport {
        constructor() {
            this.curPos = my.GLOBAL.CookieUtil.get('curPos') || 0;
            this.mySwiper = '' //记录全局的swiper
            this.eastState = {//用来管理每个模块的状态
                0: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//轮播图状态
                1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//赛程状态
                2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  //新闻状态
            }
            this.channel = '' //根据这个值去加载相应的新闻内容
            this.pullUpFinished = [true, true, true, true, true, true, true, true, true, true, true] //下拉加载用 防止重复加载

            this.startkeyArr = wsCache.get('startkeyArr') || ['', '', '', '', '', '', '', '', '', '', ''] // 用来拉取分页
            this.newkeyArr = wsCache.get('newkeyArr') || ['', '', '', '', '', '', '', '', '', '', ''] // 用来拉取分页

            this.ggIndexArr = wsCache.get('ggIndexArr') || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  // 广告下标
            this.headerHeight = 0
            this.loadingHeight = wsCache.get('loadingHeight') || 0
            this.slideHeight = '' //模块的固定高度
            this.dataType = ''
            this.hasmLinks = [false, false, false, false, false, false, false, false, false, false, false]
            this.pgnumState = {
                0: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                1: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
            } //2、3、4 -1、-2、-3正值代表上拉 负值代表下拉
            this.pgnum = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            //下拉所需值
            this.startPos = 0			// 滑动开始位置
            this.touchDistance = 0		// 滑动距离
            this.isTop = false				// 顶部判断标志
            this.TOUCH_DISTANCE = 100		// 规定滑动加载距离
            this.direction = ''            // 规定手指滑动的方向slideDown向下
            this.clientWidth = $(window).width()
            this.isTouchBottom = false//判断是否拉到最底端
            this.pullDownFinished = true//只有接口调用完成后才能下一次调用
            this.isSlideMove = false
            //this.slideDownAnimate=false   //下拉动画
            this.firstIntoPage = true  //第一次进入页面
            this.focusRequest = ''
            this.indexmatchRequest = ''
            this.newspoolRequest = ''
            this.action = wsCache.get('action') || false  //没行动   加载其他模块就为true
            this.dspData = ''
            this.init()

        }
        init() {
            //this.registMySwiper() //先注册全局的swiper
            this.computedSlideHeight() //计算栏目的高度
            this.changeNavPos() //在注册导航栏点击事件
            $headNavLi.eq(this.curPos).click() //加载当前栏目数据
        }
        computedSlideHeight() {
            let wHeight = window.screen.height;
            this.headerHeight = $header.outerHeight();
            let headNavHeight = $headNav.outerHeight();
            this.slideHeight = wHeight - this.headerHeight - headNavHeight;
            var that = this
            $swiperSlides.each(function () {
                $(this).css({
                    'height': that.slideHeight + 'px',
                    'overflowY': 'scroll'
                })
            })
        }
        changeNavPos() {
            var liWArr = []
            var that = this
            $headNavLi.each(function () {
                liWArr.push($(this).innerWidth())
            })
            $headNavLi.click(function () {
                let i = $(this).index()
                if (!that.firstIntoPage && i == that.curPos) return
                if (!that.firstIntoPage) {
                    wsCache.set(`scrollTop${that.curPos}`, $swiperSlides.eq(that.curPos).scrollTop(), { exp: 10 * 60 });
                }

                $swiperSlides.eq(that.curPos).html(`<div class="loading-tips1 l-btn-refresh1"><div><i class="iloading rotating"> </i>正在加载</div></div>`)
                $swiperSlides.hide()
                $swiperSlides.eq(i).show()
                if (that.focusRequest) {
                    that.focusRequest && that.focusRequest.abort()
                    that.indexmatchRequest && that.indexmatchRequest.abort()
                    that.newspoolRequest && that.newspoolRequest.abort()
                    that.pullUpFinished[that.curPos] = true
                }
                $headNavLi.removeClass('active')
                $(this).addClass('active')
                $headNavNew.find('ul').scrollLeft(my.GLOBAL.computedWidth(liWArr, (i - 2)) - 30)
                var chazhi = 0 //用来确认位置的
                if (i == 0) {
                    chazhi = ($(this).width() - $line.innerWidth()) / 2
                } else {
                    chazhi = ($(this).innerWidth() - $line.innerWidth()) / 2
                }
                if (that.firstIntoPage) {
                    $line.css({
                        'left': `${my.GLOBAL.computedWidth(liWArr, i) + chazhi + 'px'}`,
                        'background': '#f62929'
                    })
                } else {
                    $line.css({
                        'left': `${my.GLOBAL.computedWidth(liWArr, i) + chazhi + 'px'}`,
                        /*'transition':'all .1s linear'*/
                    })
                }
                that.curPos = i;
                that.channel = $(this).attr('data-channel')
                my.GLOBAL.CookieUtil.set('curPos', that.curPos, 1 / 6) //保存当前浏览位置一天
                //加载模块内容
                that.dataType = $(this).attr('data-type')
                //加载缓存的数据或者线上的
                if (wsCache.get(`newsModule${that.curPos}`) && wsCache.get(`newsModule${that.curPos}`).indexOf('iframe') >= 0 && wsCache.get(`newsModule${that.curPos}`).indexOf('data-dsp="hasDsp"') < 0) {
                    $swiperSlides.eq(that.curPos).html(wsCache.get(`newsModule${that.curPos}`))
                    $swiperSlides.eq(that.curPos).scrollTop(wsCache.get(`scrollTop${that.curPos}`))
                    /*that.requestDspUrl().done(function (data) {
                        that.dspData=that.changeDspDataToObj(data)
                        for(let i=0;i<4;i++){

                            if(that.dspData[i]){
                                $(`#module${that.curPos + '_' + i}`).html(that.loadDspHtml(i))
                            }else{

                                let value=$(`#module${that.curPos + '_' + i}`).children().attr('id')
                                my.GLOBAL.getScript(`http://tt123.eastday.com/${value}.js`, function () {
                                }, $('#' + value)[0])
                            }

                        }
                        setTimeout(function () {
                            that.reportDspInviewbackurl()
                        },0)

                    })*/
                    that.delLoadingTips()
                    that.pullUpLoadNews() //注册加载上拉更多新闻
                    that.pullDownLoadNews() //注册加载下拉更多新闻
                    that.btnLoadMoreNews() //注册点击下拉加载事件btn-load-more元素
                    that.unload() //离开页面事件
                    //激活轮播图
                    if ($('#swiperContainer').length) {
                        new Swiper('#swiperContainer', {
                            loop: true,
                            /* spaceBetween: 10, */
                            centeredSlides: true,
                            autoplay: 4000,
                            autoplayDisableOnInteraction: false
                        })
                    }

                } else {
                    that.ggIndexArr[that.curPos] = 0
                    that.loadDataHtml()
                }
                that.firstIntoPage = false  //进过页面就判断为进过
            })
        }
        registMySwiper() {
            var that = this
            this.mySwiper = new Swiper('#mainSection', {
                speed: 500,
                onInit: function (swiper) { },
                onSlideChangeStart: function (swiper) {
                    let activeIndex = swiper.activeIndex
                    $headNavLi.eq(activeIndex).click() //激活导航条移动
                },
                onSlideChangeEnd: function (swiper) { },
                onSliderMove: function (swiper, event) {
                    that.isSlideMove = true;
                    that.setPullDownLoadTipsAnimation('slideUp 0s')  //发现是swiper移动瞬间将元素向上隐藏
                },
                onTouchEnd: function (swiper) {
                    that.isSlideMove = false;
                }
            })
        }
        loadDataHtml() {
            switch (this.curPos) {
                case 0:
                    this.loadRecommendCol()
                    break
                default:
                    this.loadOtherCol()
            }
        }
        loadRecommendCol() {
            /*if(this.eastState[2][this.curPos]==1){return}
            if(this.eastState[0][this.curPos]!=1){
            }else if(this.eastState[1][this.curPos]!=1){
                this.loadHotMatch();
            }else{
                this.initNews();
            }*/
        
            if (qid=='null'||qid=='baiducom') {
                this.loadFocusPic();
            } else {
                this.loadHotMatch();

            }


        }
        loadOtherCol() {
            /*if(this.eastState[2][this.curPos]==1){return}
            if(this.eastState[1][this.curPos]!=1){
            }else{
                this.initNews();
            }*/
            this.loadHotMatch();

        }
        // 轮播图 可以改造目前就首页用 先不改造了
        loadFocusPic() {
            let that = this
            let $el = $('<div id="swiperContainer" class="swiper-container fs-swiper-container"></div>')
            that.focusRequest = $.ajax({
                type: "GET",
                url: homeLuoboApi,
                dataType: "jsonp",
                jsonpCallback: 'callbcak'
            }).done(function (result) {
                $el.append(`<div class="swiper-wrapper">${produceHtml(result)}</div>`);
                $swiperSlides.eq(that.curPos).html('')
                $swiperSlides.eq(that.curPos).append($el)
                setTimeout(function () {
                    $('#swiperContainer').find('.swiper-slide img').each(function () {
                        $(this).attr('src', $(this).attr('data-src'));
                    })
                }, 50)
                that.delLoadingTips(0)
                that.eastState[0][that.curPos] = 1
                that.loadHotMatch()
                //激活轮播图
                var swiper = new Swiper('#swiperContainer', {
                    loop: true,
                    /* spaceBetween: 10, */
                    centeredSlides: true,
                    autoplay: 4000,
                    autoplayDisableOnInteraction: false
                })
            });
            function produceHtml(result) {
                var data = result.data
                var html = ''
                data.forEach(function (item, i) {
                    if (i < 5) {
                        html += `<div class="swiper-slide">
                                     <a href="${item.url}" suffix="btype=index&subtype=lunbo&idx=${i}">
                                     <img data-src="${item.image_url}"/>
                                     <p>${item.title}<span>${i + 1}&nbsp;/&nbsp;<i>5</i></span></p></a>
                                 </div>`
                    }
                })
                return html
            }
        }
        // 热门比赛
        loadHotMatch() {
            let $el = $(`<section class="sec-match"></section>`);

            let data = {
                channel: this.channel,
                os: os,
                recgid: recgid,
                qid: qid,
                domain: domain
            }
            let that = this
            that.indexmatchRequest = my.GLOBAL.makeJsonp(host + 'indexmatch', data).done(function (result) {
                if (result.data.length) { //有推荐赛程就添加元素
                    $el.append(`<ul class="clearfix">${produceHtml(result)}</ul>`)
                    if (that.curPos != 0) {
                        $swiperSlides.eq(that.curPos).html('')
                    }
                    $swiperSlides.eq(that.curPos).append($el)
                    $el.after(`<div class="separate-line"></div>`)
                    loadMatchMore.call(that)
                    that.delLoadingTips()
                }

                that.eastState[1][that.curPos] = 1
                that.initNews()
            }).done(function () { // 比赛中的获取实时比分
                getlivesinfo()
                function getlivesinfo() {
                    my.GLOBAL.makeJsonp(host + 'livesinfo', data).done(function (result) {
                        matchIdScore(result)
                    })
                }
            })
            let isRequested = true
            $body.on('click', '.btn-order', function () {
                let that = this
                if ($(that).attr('data-ordered') || !isRequested) { popup(2); return }
                isRequested = false
                my.GLOBAL.makeJsonp(orderApi + $(this).attr('data-matchid'), {}).done(function (result) {
                    if (result.status == -1) {
                        popup(1)
                    } else {
                        popup(2)
                        $(that).attr('data-ordered', '1') //订阅过data-ordered为1
                    }
                }).fail(function () {
                    popup(3)
                }).always(function () {
                    isRequested = true
                })
            })
            $body.on('click', '#popup', function () {
                $(this).hide()
            })
            //弹窗
            function popup(option) {
                let html = ``
                switch (option) {
                    case 1:
                        html = `<div class="content">
                                    <img src="http://msports.eastday.com/h5/img/getqrcode.jpg" alt=""/>
                                    <p>您未关注公众号,请关注</p>
                                </div>`
                        break;
                    case 2:
                        html = `<div class="content">
                                    <p>您已预约成功此场比赛</p>
                                </div>`
                        break;
                    case 3:
                        html = `<div class="content">
                                    <p>请重新刷新页面</p>
                                </div>`
                        break;
                }
                $popup.show().html(html)
            }
            // 匹配相同的ID赛事 实时更新比分
            function matchIdScore(result) {
                result.list.forEach(function (item, i) {
                    var $ele = $('#' + item.id)
                    $ele.find('.score').text(item.home_score + '-' + item.visit_score)
                    $ele.find('.score').next().text('直播中')
                })
            }
            function produceHtml(result) {
                var data = result.data;
                var html = ''
                data.forEach(function (item, i) {
                    var title = item.title.split(' ')[1],
                        home_team = item.home_team,
                        visit_team = item.visit_team
                    var score = item.home_score + '-' + item.visit_score
                    var orderStr = '';//判断预约的功能
                    if (item.ismatched == -1) {
                        if (my.GLOBAL.isWeiXin()) {
                            orderStr = `<a class="btn-order" data-matchid="${item.matchid}" href="javascript:;"><span>预约</span></a>`
                        } else {
                            orderStr = '<span class="empty">未开赛</span>';
                        }
                    } else if (item.ismatched == 0) {
                        orderStr = '<span>直播中</span>';
                    } else {
                        orderStr = '<span>集锦</span>';
                    }

                    if (i < 2) {
                        item.home_logoname = item.home_logoname || 'http://msports.eastday.com/h5/img/logo_default.png'
                        item.visit_logoname = item.visit_logoname || 'http://msports.eastday.com/h5/img/logo_default.png'
                        html += `<li class="clearfix">
                                <a href="${item.liveurl}" suffix="btype=index&subtype=recMatch&idx=${i}">
                                <h3>${title}</h3>
                                <div class="team">
                                    <img src="${item.home_logoname}" alt=""/>
                                    <p>${home_team}</p>
                                </div>
                                <div class="info" id="${item.matchid}">
                                    <div class="score">${item.ismatched == '-1' ? my.GLOBAL.formatTimeToMatch(item.currentServerTime, item.starttime) : score}</div>
                                    ${orderStr}
                                </div>
                                <div class="team">
                                    <img src="${item.visit_logoname}" alt=""/>
                                    <p>${visit_team}</p>
                                </div></a>
                            </li>`
                    }
                })
                return html
            }
            //加载推荐比赛下的模块
            function loadMatchMore() {
                let dateTxt = new Date().format('MM月dd日')
                if (this.curPos == 0) {//第一个推荐栏目
                    $el.after(`<a class="match-more" href="index_all_schedule.html">
                                    <div class="l">${dateTxt}</div>
                                    <div class="m">查看今天全部热门比赛</div>
                                    <div class="r"></div>
                                </a>`)
                } else {//其他栏目
                    $el.after(`<div class="match-more">
                                    <div class="item">
                                        <a href="http://msports.eastday.com/index_category_schedule.html?class=${that.dataType.toLowerCase()}">
                                            <img src="http://msports.eastday.com/h5/img/i-s-saicheng.png" alt=""/>
                                            赛程
                                        </a>
                                    </div>
                                    <div class="item">
                                        <a href="http://msports.eastday.com/data_tongji_basketball.html?class=${that.dataType.toLowerCase()}">
                                            <img src="http://msports.eastday.com/h5/img/i-shuju.png" alt=""/>
                                            数据
                                        </a>
                                    </div>
                                    <div class="line"></div>
                                </div>`)
                }
            }
        }
        // 信息流初始化
        initNews() {
            let $el = $(`<section class="sec-news-list"></section>`)
            let data = {
                type: this.dataType,
                typecode: this.channel,
                startkey: '',
                newkey: '',
                pgnum: this.pgnum,
                os: os,
                recgid: recgid,
                qid: qid,
                domain: domain
            }

            let that = this
            that.newspoolRequest = my.GLOBAL.makeJsonp(host + 'newspool', data).done(function (result) {
                $el.append(`<ul>${that.produceListHtml(result, 0)}</ul>`)
                $swiperSlides.eq(that.curPos).append($el)
                let loading = $(`<div class="loading-tips2 btn-refresh2"><span class="loading rotating"></span>正在载入新内容...</div>`)
                $el.after(loading)//尾部加入load动画
                that.loadingHeight = loading.outerHeight();//计算下方load高度
                that.eastState[2][that.curPos] = 1
                that.startkeyArr[that.curPos] = result.endkey
                that.newkeyArr[that.curPos] = result.newkey
                //that.pgnumState[0][that.curPos]++
                if (that.curPos != 0) {
                    wsCache.set(`action`, true, { exp: 10 * 60 });
                }  //加载过其他模块
                wsCache.set('startkeyArr', that.startkeyArr, { exp: 10 * 60 });
                wsCache.set('newkeyArr', that.newkeyArr, { exp: 10 * 60 });
                wsCache.set('loadingHeight', that.loadingHeight, { exp: 10 * 60 });//保存load高度
                that.delLoadingTips()
                let i = that.curPos;
                setTimeout(function () {
                    wsCache.set(`newsModule${i}`, $swiperSlides.eq(i).html(), { exp: 10 * 60 });
                }, 400)
                that.pullUpLoadNews() //注册加载上拉更多新闻
                that.pullDownLoadNews() //注册加载下拉更多新闻
                that.btnLoadMoreNews() //注册点击下拉加载事件btn-load-more元素
                that.unload() //离开页面事件

            }).done(function () {
                that.requestDspUrl().done(function (data) {
                    that.dspData = that.changeDspDataToObj(data)
                    for (let i = 0; i < 4; i++) {

                        if (that.dspData[i]) {
                            $(`#module${that.curPos + '_' + i}`).html(that.loadDspHtml(i))
                        } else {

                            let value = $(`#module${that.curPos + '_' + i}`).children().attr('id')
                            my.GLOBAL.getScript(`http://tt123.eastday.com/${value}.js`, function () {
                            }, $('#' + value)[0])
                        }

                    }
                    setTimeout(function () {
                        that.reportDspInviewbackurl()
                    }, 0)

                })
            })
        }
        // 上拉加载新闻
        pullUpLoadNews() {
            let that = this
            $swiperSlides.eq(that.curPos).scroll(function () {
                if (!$(this).children('.loading-tips2').length) return
                var tipsTop = $(this).children('.loading-tips2').position().top //这个是距离父元素定位的距离  会变的越来越小
                var slideHeight = that.slideHeight

                if (!$header.is(":visible")) {
                    slideHeight = slideHeight + that.headerHeight
                }
                //var scrollTop = $(this).scrollTop()
                //加5是为了减少误差
                if (slideHeight - that.loadingHeight + 5 >= tipsTop && that.pullUpFinished[that.curPos]) {
                    that.pullUpFinished[that.curPos] = false
                    that.loadNewsList()
                }
            })
        }
        loadNewsList() {
            let that = this
            let data = {
                type: this.dataType,
                typecode: this.channel,
                startkey: this.startkeyArr[this.curPos],
                newkey: this.newkeyArr[this.curPos],
                pgnum: ++this.pgnumState[0][this.curPos],
                os: os,
                recgid: recgid,
                qid: qid,
                domain: domain
            }
            my.GLOBAL.makeJsonp(host + 'newspool', data).done(function (result) {
                if (!result.data.length) {
                    //提示没有数据了
                    that.changeLoadingTips2('没有更过内容了...')
                    return
                }
                that.startkeyArr[that.curPos] = result.endkey
                that.newkeyArr[that.curPos] = result.newkey
                $swiperSlides.eq(that.curPos).find('.sec-news-list ul').append(that.produceListHtml(result, 1))
                wsCache.set(`action`, true, { exp: 10 * 60 });
                that.pgnum[that.curPos]++
                that.pullUpFinished[that.curPos] = true
                wsCache.set('startkeyArr', that.startkeyArr, { exp: 10 * 60 });
                wsCache.set('newkeyArr', that.newkeyArr, { exp: 10 * 60 });
                let i = that.curPos;
                setTimeout(function () {
                    wsCache.set(`newsModule${i}`, $swiperSlides.eq(i).html(), { exp: 10 * 60 });
                }, 400)
            }).done(function () {
                that.requestDspUrl(3).done(function (data) {
                    that.dspData = that.changeDspDataToObj(data)
                    for (let i = 2; i >= 0; i--) {
                        if (that.dspData[i]) {
                            $(`#module${that.curPos + '_' + (that.ggIndexArr[that.curPos] - 3 + i)}`).html(that.loadDspHtml(i))
                        } else {

                            let value = $(`#module${that.curPos + '_' + (that.ggIndexArr[that.curPos] - 3 + i)}`).children().attr('id')
                            my.GLOBAL.getScript(`http://tt123.eastday.com/${value}.js`, function () {
                            }, $('#' + value)[0])
                        }

                    }
                    setTimeout(function () {
                        that.reportDspInviewbackurl()
                    }, 0)

                })
            }).fail(function () {
                that.pullUpFinished[that.curPos] = true
            })
        }
        produceListHtml(result, ggPos) {
            var data = result.data
            var html = ''
            var that = this
            data.forEach(function (item, i) {
                var length = item.miniimg.length// 判断缩略图的数量
                if (length < 3 && length >= 1) {
                    html += `<li class="clearfix">
                                    <a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0">
                                        <div class="img">
                                            <img class="lazy" src="${item.miniimg[0].src}"/>
                                        </div>
                                        <div class="info">
                                            <div class="title">${item.topic}</div>
                                            <div class="source clearfix">
                                                ${item.iszhiding == 1 && i == 0 ? '<div class="tag-zd">置顶</div>' : ''}
                                            <div class="l">${item.source}</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>`
                } else if (length >= 3) {
                    html += `<li class="clearfix">
                                     <a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0">
                                        <div class="title">${item.topic}</div>
                                        <div class="imgs">
                                            <img class="lazy" src="${item.miniimg[0].src}">
                                            <img class="lazy" src="${item.miniimg[1].src}">
                                            <img class="lazy" src="${item.miniimg[2].src}">
                                        </div>
                                        <div class="source clearfix">
                                            ${item.iszhiding == 1 && i == 0 ? '<div class="tag-zd">置顶</div>' : ''}
                                            <div class="l">${item.source}</div>
                                        </div>
                                    </a>
                                </li>`
                }
                //加入广告的位置
                if (ggPos == 0) {
                    if (i == 1) { html += that.loadgg() }
                }
                if ((i + 1) % 5 == 0 && that.ggIndexArr[that.curPos] < 19) {
                    html += that.loadgg()
                }
                //中间赛程 排行 统计 下载模块
                var mlinksLength = $swiperSlides.eq(that.curPos).find('.sec-news-list ul').find('.m-links').length
                if (that.curPos != 0 && i == 4 && !mlinksLength) {
                    html += `<li class="clearfix" style="padding:0;border: 0">
                            <div class="clearfix m-links">
                                <div>
                                    <a href="data_all.html?datatype=s&classtype=${that.dataType.toLowerCase()}">
                                        <img src="http://msports.eastday.com/h5/img/i-saicheng.png" alt=""/>
                                        <p>赛程</p>
                                    </a>
                                </div>
                                <div>
                                    <a href="data_all.html?datatype=t&classtype=${that.dataType.toLowerCase()}">
                                        <img src="http://msports.eastday.com/h5/img/i-tongji.png" alt=""/>
                                        <p>统计</p>
                                    </a>
                                </div>
                                <div>
                                    <a href="data_all.html?datatype=p&classtype=${that.dataType.toLowerCase()}">
                                        <img src="${that.dataType == 'NBA' ? 'http://msports.eastday.com/h5/img/i-paiming.png' : 'http://msports.eastday.com/h5/img/i-jifenbang.png'}" alt=""/>
                                        <p>${that.dataType == 'NBA' ? '排名' : '积分榜'}</p>
                                    </a>
                                </div>
                                <div>
                                    <a href="http://msports.eastday.com/downloadapp.html">
                                        <img src="http://msports.eastday.com/h5/img/i-zhibo.png" alt=""/>
                                        <p>看直播</p>
                                    </a>
                                </div>
                            </div>
                        </li>`
                    that.hasmLinks[that.curPos] = true;
                }

            })
            return html
        }
        // 下拉加载新闻
        pullDownLoadNews() {
            let that = this
            $swiperSlides.eq(that.curPos).on('touchstart', function (e) {
                // 防止重复快速下拉
                var _touch = e.originalEvent.targetTouches[0];
                that.startPos = _touch.pageY;
                that.isTouchBottom = false;
                if ($(this).scrollTop() <= 0) {
                    that.isTop = true;
                } else {
                    that.isTop = false;
                }
            })

            $swiperSlides.eq(that.curPos).on('touchend', function (e) {
                // 达到下拉阈值 启动数据加载
                if (that.direction == 'slideDown' && that.isSlideMove == false) {
                    $header.show()
                    $swiperSlides.each(function () {
                        $(this).css({
                            'height': that.slideHeight + 'px'
                        })
                    })
                } else if (that.direction == 'slideUp' && that.isSlideMove == false) {
                    $header.hide()
                    $swiperSlides.each(function () {
                        $(this).css({
                            'height': that.slideHeight + that.headerHeight + 'px'
                        })
                    })
                }
                if (that.isTouchBottom && that.pullDownFinished) {
                    that.pullDownFinished = false;

                    that.loadNewsListForPullDown()
                } else {//松开返回顶部

                    if (that.pullDownFinished == true && that.isSlideMove == false) {
                        if ($pullDownLoadTips.attr('style').indexOf('slideDown') >= 0) {
                            that.setPullDownLoadTipsAnimation('slideUp 1s ease forwards')
                        }

                    }
                }

            })
            $swiperSlides.eq(that.curPos).on('touchmove', function (e) {
                var _touch = e.originalEvent.targetTouches[0];
                var py = _touch.pageY;
                that.touchDistance = py - that.startPos;
                if (that.isSlideMove == true) { return }
                // 根据用户开始的滑动手势判断用户是向下滑还是向上滑
                if (that.touchDistance > 0) {
                    that.direction = 'slideDown'
                } else {
                    that.direction = 'slideUp'
                }
                if (that.isTop && that.touchDistance > 0) {
                    // 下拉加载
                    //that.touchDistance = that.touchDistance * (750 / that.clientWidth) / 100
                    //console.log(that.touchDistance)
                    if (that.touchDistance >= that.TOUCH_DISTANCE) {
                        //that.touchDistance = that.TOUCH_DISTANCE;
                        that.isTouchBottom = true;
                        if (!that.pullDownFinished) { //如果这个值是false 那么模块还在加载中 不用提示松开刷新
                            that.setPullDownLoadTips('加载中...')
                        } else {
                            that.setPullDownLoadTips('松开刷新')
                        }
                    } else {
                        that.isTouchBottom = false;
                        that.setPullDownLoadTips('下拉加载')
                    }
                    that.setPullDownLoadTipsAnimation('slideDown 1s ease forwards')
                    that.slideDownAnimate = true;
                    $pullDownLoadTips.find('.iloading').css({
                        'transform': `rotate(${that.touchDistance}deg)`
                    });
                    e.preventDefault();
                } else {
                    that.isTouchBottom = false;
                }
            })
        }
        //下拉加载新闻列表
        loadNewsListForPullDown() {
            let that = this
            let data = {
                type: this.dataType,
                typecode: this.channel,
                startkey: this.startkeyArr[this.curPos],
                newkey: this.newkeyArr[this.curPos],
                pgnum: this.pgnumState[1][this.curPos]--,
                os: os,
                recgid: recgid,
                qid: qid,
                domain: domain
            }
            that.setPullDownLoadTips('加载中...')
            my.GLOBAL.makeJsonp(host + 'newspool', data).done(function (result) {
                if (!result.data.length) {
                    //提示没有数据了
                    that.setPullDownLoadTips('已是最新内容,看看其它频道吧', 1)
                    that.setPullDownLoadTipsAnimation('slideDown 1s ease forwards')
                } else {
                    that.setPullDownLoadTips(`为您更新${result.data.length}条内容`, 1)
                    that.setPullDownLoadTipsAnimation('slideDown 1s ease forwards')
                    that.startkeyArr[that.curPos] = result.endkey
                    that.newkeyArr[that.curPos] = result.newkey
                    that.pgnum[that.curPos]++
                    $swiperSlides.eq(that.curPos).scrollTop(0)
                    $swiperSlides.eq(that.curPos).find('.sec-news-list ul').prepend(that.produceListHtmlForPullDown(result))
                    wsCache.set(`action`, true, { exp: 10 * 60 });
                    wsCache.set('startkeyArr', that.startkeyArr, { exp: 10 * 60 });
                    wsCache.set('newkeyArr', that.newkeyArr, { exp: 10 * 60 });
                    let i = that.curPos;
                    setTimeout(function () {
                        wsCache.set(`newsModule${i}`, $swiperSlides.eq(i).html(), { exp: 10 * 60 });
                    }, 400)

                }
                setTimeout(function () {
                    that.setPullDownLoadTipsAnimation('slideUp 1s ease forwards')
                }, 2000)
                that.pullDownFinished = true;
            }).done(function () {
                that.requestDspUrl(3).done(function (data) {
                    that.dspData = that.changeDspDataToObj(data)
                    for (let i = 2; i >= 0; i--) {
                        if (that.dspData[i]) {
                            $(`#module${that.curPos + '_' + (that.ggIndexArr[that.curPos] - 3 + i)}`).html(that.loadDspHtml(i))
                        } else {

                            let value = $(`#module${that.curPos + '_' + (that.ggIndexArr[that.curPos] - 3 + i)}`).children().attr('id')
                            my.GLOBAL.getScript(`http://tt123.eastday.com/${value}.js`, function () {
                            }, $('#' + value)[0])
                        }

                    }
                    setTimeout(function () {
                        that.reportDspInviewbackurl()
                    }, 0)

                })
            }).fail(function () {
                that.setPullDownLoadTips('网络中断,请刷新页面', 1)
                that.pullDownFinished = true;
                setTimeout(function () {
                    that.setPullDownLoadTipsAnimation('slideUp 1s ease forwards')
                }, 2000)
            })
        }
        produceListHtmlForPullDown(result) {
            var data = result.data
            var html = ''
            var that = this
            var dataLength = result.data.length
            data.forEach(function (item, i) {
                var length = item.miniimg.length// 判断缩略图的数量
                if (length < 3 && length >= 1) {
                    html += `<li class="clearfix">
                                    <a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0">
                                        <div class="img">
                                            <img src="${item.miniimg[0].src}"/>
                                        </div>
                                        <div class="info">
                                            <div class="title">${item.topic}</div>
                                            <div class="source clearfix">
                                                ${item.iszhiding == 1 && i == 0 ? '<div class="tag-zd">置顶</div>' : ''}
                                            <div class="l">${item.source}</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>`
                } else if (length >= 3) {
                    html += `<li class="clearfix">
                                     <a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0">
                                        <div class="title">${item.topic}</div>
                                        <div class="imgs">
                                            <img src="${item.miniimg[0].src}">
                                            <img src="${item.miniimg[1].src}">
                                            <img src="${item.miniimg[2].src}">
                                        </div>
                                        <div class="source clearfix">
                                            ${item.iszhiding == 1 && i == 0 ? '<div class="tag-zd">置顶</div>' : ''}
                                            <div class="l">${item.source}</div>
                                        </div>
                                    </a>
                                </li>`
                }
                //加入广告的位置
                if ((i + 1) % 5 == 0 && that.ggIndexArr[that.curPos] < 19) {
                    html += that.loadgg()
                }
                //中间赛程 排行 统计 下载模块
                $swiperSlides.eq(that.curPos).find('.sec-news-list ul').find('.m-links').parent().remove()
                $swiperSlides.eq(that.curPos).find('.sec-news-list ul').find('.btn-load-more').remove()
                if (that.curPos != 0 && i == 4) {
                    html += `<li class="clearfix" style="padding:0;border: 0">
                            <div class="clearfix m-links">
                                <div>
                                    <a href="data_all.html?datatype=s&classtype=${that.dataType.toLowerCase()}">
                                        <img src="http://msports.eastday.com/h5/img/i-saicheng.png" alt=""/>
                                        <p>赛程</p>
                                    </a>
                                </div>
                                <div>
                                    <a href="data_all.html?datatype=t&classtype=${that.dataType.toLowerCase()}">
                                        <img src="http://msports.eastday.com/h5/img/i-tongji.png" alt=""/>
                                        <p>统计</p>
                                    </a>
                                </div>
                                <div>
                                    <a href="data_all.html?datatype=p&classtype=${that.dataType.toLowerCase()}">
                                        <img src="${that.dataType == 'NBA' ? 'http://msports.eastday.com/h5/img/i-paiming.png' : 'http://msports.eastday.com/h5/img/i-jifenbang.png'}" alt=""/>
                                        <p>${that.dataType == 'NBA' ? '排名' : '积分榜'}</p>
                                    </a>
                                </div>
                                <div>
                                    <a href="http://msports.eastday.com/downloadapp.html">
                                        <img src="http://msports.eastday.com/h5/img/i-zhibo.png" alt=""/>
                                        <p>看直播</p>
                                    </a>
                                </div>
                            </div>
                        </li>`
                }
                if (i + 1 == dataLength) {
                    html += `<li class="btn-load-more" style="padding:0;">
                                <div class="tips">
                                    上次读到这里，<i>点击刷新</i>
                                </div>
                            </li>`
                }

            })
            return html
        }
        loadgg() {
            var _newsGg_ = _indexGg_[currChannel].concat(_newsList_)
            var that = this
            var html = ''
            html += `<li style="padding:0;" class="gg clearfix bdgg-wrap" data-ggid="${_newsGg_[that.ggIndexArr[that.curPos]]}" id="module${that.curPos + '_' + that.ggIndexArr[that.curPos]}">
                     <div id="${_newsGg_[that.ggIndexArr[that.curPos]]}"></div>
                    </li>`
            /*if(that.ggIndexArr[that.curPos]==0 || that.ggIndexArr[that.curPos]==1 ||that.ggIndexArr[that.curPos]==2 || that.ggIndexArr[that.curPos]==3){
            }else{
                html += `<li style="padding:0;" class="gg clearfix bdgg-wrap" data-ggid="${_newsGg_[that.ggIndexArr[that.curPos]]}" id="module${that.curPos + '_' + that.ggIndexArr[that.curPos]}">
                     <div id="${_newsGg_[that.ggIndexArr[that.curPos]]}"></div>
                    </li>`
                !(function() {
                    let num=that.curPos
                    let value=_newsGg_[that.ggIndexArr[num]]
                    setTimeout(function () {
                        my.GLOBAL.getScript(`http://tt123.eastday.com/${value}.js`, function () {
                        }, $('#' + value)[0])
                    },0)
                })()
            }*/
            that.ggIndexArr[that.curPos]++
            wsCache.set('ggIndexArr', that.ggIndexArr, { exp: 10 * 60 });//保存广告的位置

            return html
        }
        requestDspUrl(num) {
            var readUrl = wsCache.get('historyUrlArr') || 'null'
            if (readUrl != 'null') {
                readUrl = readUrl.join(',')
            }
            var data = {
                type: this.dataType,
                qid: qid,
                uid: recgid, // 用户ID
                os: os,
                readhistory: readUrl,
                adnum: num || 4,
                pgnum: this.pgnum[this.curPos],
                adtype: 1236,
                dspver: '1.0.1',
                softtype: 'news',
                softname: 'eastday_wapnews',
                newstype: 'ad',
                browser_type: my.GLOBAL.browserType || 'null',
                pixel: pixel,
                fr_url: my.GLOBAL.getReferrer() || 'null',	 // 首页是来源url(document.referer)
                site: 'sport'

            }
            return my.GLOBAL.makeGet(hostDsp, data)
        }
        changeDspDataToObj(data) {
            let obj = {}
            data.data.forEach(function (item, i) {
                obj[item.idx - 1] = item
            })
            return obj
        }
        loadDspHtml(posi) {
            let html = ''
            let item = this.dspData[posi]
            switch (item.adStyle) {
                case 'big':  //大
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}"  data-dsp="hasDsp" style="display:block;height:5.14rem;">
                    <div class="title">${item.topic}</div>
                    <div class="big-img">
                        <img class="lazy" src="${item.miniimg[0].src}"/>
                    </div>
                    <div class="source clearfix">
                        <div class="tag">${item.isadv ? '广告' : '推广'}</div>
                        <div class="souce">${item.source}</div>
                    </div>
                    </a>`
                    break;
                case 'one':   //单
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}" data-dsp="hasDsp">
                            <div class="img">
                                <img class="lazy" src="${item.miniimg[0].src}"/>
                            </div>
                            <div class="info">
                                <div class="title">${item.topic}</div>
                                <div class="source clearfix">
                                    <div class="tag">${item.isadv ? '广告' : '推广'}</div>
                                    <div class="l">${item.source}</div>
                                </div>
                            </div>
                        </a>`
                    break;
                case 'group':  //三图
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}" data-dsp="hasDsp" >
                            <div class="title">${item.topic}</div>
                            <div class="imgs">
                                <img class="lazy" src="${item.miniimg[0].src}">
                                <img class="lazy" src="${item.miniimg[1].src}">
                                <img class="lazy" src="${item.miniimg[2].src}">
                            </div>
                            <div class="source clearfix">
                                <div class="tag">${item.isadv ? '广告' : '推广'}</div>
                                <div class="souce">${item.source}</div>
                            </div>
                        </a>`
                    break;
                case 'full':   //banner
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}" data-dsp="hasDsp" style="display:block;height:2.9rem;">
                    <div class="big-img">
                        <img class="lazy" src="${item.miniimg[0].src}"/>
                    </div>
                    <div class="source clearfix">
                        <div class="tag">${item.isadv ? '广告' : '推广'}</div>
                        <div class="l">${item.source}</div>
                    </div>
                    </a>`
                    break;
            }
            $body.append(`<img style="display: none" src="${item.showbackurl}"/>`)
            return html
        }
        reportDspInviewbackurl() {
            let cHeight = $(window).height()
            let offsetArr = []
            let eleArr = []
            $('a[inviewbackurl]').each(function (i, item) {
                if (cHeight > $(this).offset().top) {

                    $body.append(`<img style="display: none" src="${$(this).attr('inviewbackurl')}"/>`)
                    $(this).removeAttr('inviewbackurl')
                }
            })

            $('a[inviewbackurl]').each(function (i, item) {
                offsetArr.push($(this).offset().top)
                eleArr.push($(this))
            })

            $swiperSlides.eq(this.curPos).scroll(function () {
                offsetArr.forEach((item, index) => {
                    if (cHeight + $(this).scrollTop() > item) {

                        if (eleArr[index].attr('inviewbackurl')) {
                            $body.append(`<img style="display: none" src="${eleArr[index].attr('inviewbackurl')}"/>`)
                            eleArr[index].removeAttr('inviewbackurl')
                        }

                    }
                })

            })
        }
        //注册点击刷新下拉新闻
        btnLoadMoreNews() {
            var that = this
            $swiperSlides.eq(this.curPos).on('click', '.sec-news-list .btn-load-more', function () {
                that.setPullDownLoadTips('加载中...')
                that.setPullDownLoadTipsAnimation('slideDown 1s ease forwards')
                that.loadNewsListForPullDown()
            })
        }
        //注册页面离开事件
        unload() {
            var that = this
            $(window).unload(function () {
                wsCache.set(`scrollTop${that.curPos}`, $swiperSlides.eq(that.curPos).scrollTop(), { exp: 10 * 60 });
            })
        }
        delLoadingTips() {//有数据删除loading-tips1加载图案
            $swiperSlides.eq(this.curPos).children('.loading-tips1').remove();
        }
        changeLoadingTips2(txt) {//改变下方提示框内容
            $swiperSlides.eq(this.curPos).children('.loading-tips2').html(txt);
        }
        setPullDownLoadTips(option, type = 0) {
            //var option=Object.assign({},option)
            if (type == 1) {
                $pullDownLoadTips.addClass('active')
            } else {
                $pullDownLoadTips.removeClass('active')
            }
            $pullDownLoadTips.find('.txt').html(option)
        }
        setPullDownLoadTipsAnimation(option) {//option例子  bounceInDown 0.8s ease forwards
            $pullDownLoadTips.css({
                'animation': option
            })
        }
    }
    let eastSport = new EastSport()
    return my
})(module || {})