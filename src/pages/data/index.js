//var host = "http://172.18.250.87:8381/dfsports_h5/";//测试服
import $ from '../../../vendor/jquery.min';
import WebStorageCache from '../../../vendor/web-storage-cache.min.js';
import Swiper from '../../../vendor/swiper.min';
/*import  '../../public-resource/sass/database.scss';
import  '../../public-resource/sass/common.scss';*/
import  '../../public-resource/sass/newindex.scss';
import '../../dll/dll.css';
import  './data_all.scss';

var host = 'http://dfsports_h5.dftoutiao.com/dfsports_h5/' // 线上
var homeLuoboApi = 'http://msports.eastday.com/json/msponts/home_lunbo.json';

var orderApi = 'http://dfty.dftoutiao.com/index.php/Home/WechatOrder/yuyue?system_id=9&machid='

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
    my.GLOBAL={//工具函数
        makeJsonp(url, data) {
            return $.ajax({
                type: 'POST',
                data: data,
                url: url,
                dataType: 'jsonp',
                jsonp: 'callback'
            })
        },
        makePost(url, data) {
            return $.ajax({
                type: 'POST',
                data: data,
                url: url,
                dataType: 'jsonp',
                jsonp: 'callback'
            })
        },
        getUrlParam(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg) // 匹配目标参数
            if (r != null) return unescape(r[2])
            return null // 返回参数值
        },
        getScript (url, callback, element) {
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
        computedWidth(arr,num){//计算宽度 用于计算导航栏下划线位置
            var width=0
            for(let i=0;i<arr.length;i++){
                if(i>=num){
                    break
                }else{
                    width+=arr[i]
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
        getReferrer() {
            /**
             * Javascript获取页面来源(referer)
             * @from http://www.au92.com/archives/javascript-get-referer.html
             * @return {[type]} [description]
             */
            var referrer = '';
            try {
                referrer = window.top.document.referrer;
            } catch(e) {
                if(window.parent) {
                    try {
                        referrer = window.parent.document.referrer;
                    } catch(e2) {
                        referrer = '';
                    }
                }
            }
            if(referrer === '') {
                referrer = document.referrer;
            }
            return referrer;
        },
        getPageQid(){
            var qid=my.GLOBAL.getUrlParam('qid');
            var specialChannel;
            if(qid){
                my.GLOBAL.CookieUtil.set('qid',qid)
            }else{
                // 通过搜索引擎进入的（渠道处理）
                specialChannel = [
                    {referer: 'baidu.com', qid: 'baiducom'}/*,
                     {referer: 'so.com', qid: '360so'},
                     {referer: 'sogou.com', qid: 'sogoucom'},
                     {referer: 'sm.cn', qid: 'smcn'},
                     {referer: 'm.tq1.uodoo.com', qid: 'smcn'}*/
                ];
                for (var i = 0; i < specialChannel.length; i++) {
                    if(my.GLOBAL.getReferrer() && my.GLOBAL.getReferrer().indexOf(specialChannel[i].referer) !== -1){
                        my.GLOBAL.CookieUtil.set('qid',specialChannel[i].qid);//这个值为baiducom
                        break;
                    }
                }
            }
            qid=my.GLOBAL.CookieUtil.get('qid')
            if(!qid){
                qid='null'
            }
            return qid
        },
        getUid(){
            var uid=my.GLOBAL.CookieUtil.get('uid')
            if(!uid){
                uid = (+new Date()) + Math.random().toString(10).substring(2, 6);
                my.GLOBAL.CookieUtil.set('uid', uid, { expires: 365, path: '/', domain: 'eastday.com' });
            }
            return uid
        },
        formatTimeToMatch(currentServerTime,startTime){
            var timestamp=Date.parse(startTime.replace(/-/g, '/'))
            var date=new Date(timestamp).format('MM月dd日')
            var time=startTime.substring(11)
            var todayTime=new Date(new Date(currentServerTime/1).format('yyyy/MM/dd')).getTime()//今天12点的时间戳大小
            var chazhi=(new Date(timestamp).getTime()-todayTime)/(24*60*60*1000)
            if(chazhi>=0&&chazhi<1){
                return time+'开始'
            }else if(chazhi>=1&&chazhi<2){
                return '明天'+time
            }else if(chazhi>=2&&chazhi<3){
                return '后天'+time
            }else{
                return date
            }
        }
    }
    return my
})(module || {})
// 首页数据 index_new
var module = (function (my) {
    var wsCache = new WebStorageCache()
    //定义需要传入接口的值
    /*var os=my.GLOBAL.getOsType()
    var recgid=my.GLOBAL.getUid()
    var qid=my.GLOBAL.getPageQid()
    var domain='dfsports_h5'*/
    //dom元素
    var $body=$('body');
    $body.find('.data-main').append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>');
    var $J_loading = $('#J_loading')
    var $headerType=$('header .crumbs-data .type')
    var $navMenu=$('nav.data')
    var $header=$('header')
    var $content=$('.data-main .content')
    var $popup=$('#popup')
    class EastSport{
        constructor() {
            this.dataType=my.GLOBAL.getUrlParam('datatype') || 's' //j代表季后赛 s代表赛程 t代表统计 p代表排名
            this.classType=my.GLOBAL.getUrlParam('classtype') || '' //赛事类别
            this.slideHeight=''
            this.init()
        }
        init(){
            this.computedSlideHeight() //计算栏目的高度
            this.makeMenu()
            this.makeCrumbs()
            this.loadContent()
            this.loadMainColumns()
        }
        computedSlideHeight(){
            let wHeight=$(window).height();
            this.headerHeight=$header.outerHeight();
            let headNavHeight=$navMenu.outerHeight();
            this.slideHeight=wHeight-this.headerHeight-headNavHeight;
            var that=this
            $content.parent().css({
                'height':that.slideHeight+'px',
                'overflowY':'scroll'
            })

        }
        makeMenu(){
            switch (this.classType){
                case 'zhongyao':
                    $navMenu.html(`<ul>
                                    <li class="active">赛程</li>
                                </ul>`)
                    break;
                case 'nba':
                    $navMenu.html(`<ul>
                                    <li data-type='j' class="${this.dataType=='j'?'active':''}">季后赛</li>
                                    <li data-type='s' class="${this.dataType=='s'?'active':''}">赛程</li>
                                    <li data-type='t' class="${this.dataType=='t'?'active':''}">统计</li>
                                    <li data-type='p' class="${this.dataType=='p'?'active':''}">排名</li>
                                </ul>`)
                    break;
                default :
                    $navMenu.html(`<ul>
                                    <li data-type='s' class="${this.dataType=='s'?'active':''}">赛程</li>
                                    <li data-type='t' class="${this.dataType=='t'?'active':''}">统计</li>
                                    <li data-type='p' class="${this.dataType=='p'?'active':''}">排名</li>
                                </ul>`)
                    break;
            }
        }
        makeCrumbs(){
            var objList={
                'zhongyao':'重要',
                'yingchao':'英超',
                'ouguan':'欧冠',
                'xijia':'西甲',
                'yijia':'意甲',
                'dejia':'德甲',
                'zhongchao':'中超',
                'cba':'CBA',
                'yaguan':'亚冠',
                'fajia':'法甲',
                'nba':'NBA'
            }
            $headerType.text(objList[this.classType])
        }
        //加载对象的内容
        loadContent(){
            switch (this.dataType){
                case 'j':
                    this.loadPlayoff()
                    break;
                case 's':
                    this.loadMatchSchedule()
                    break;
                case 't':
                    this.loadStatistics()
                    break;
                case 'p':
                    this.loadRanking()
                    break;
            }
        }
        //加载季后赛
        loadPlayoff(){
            let dataPlayoff=wsCache.get(`dataPlayoff`)
            if(dataPlayoff){ //有缓存就加缓存进去
                $content.html(dataPlayoff)
                return
            }
            var data = {
                datatype: 'nba_jihousai'
            }
            $J_loading.show()
            my.GLOBAL.makeJsonp(host + 'data', data).done(function (result) {
                var html = '',
                    top = result.data.data.top,
                    bottom = result.data.data.bottom,
                    final = result.data.data.finals
                top.forEach(function (group, index) {
                    html += '<div class="match-group-top' + (index + 1) + ' match-group">'
                    group.forEach(function (item, i) {
                        html += '	<div class="match">'
                        html += '		<div class="teams">'
                        html += '			<span class="icon">'
                        html += '				<img onerror=this.src="http://msports.eastday.com/h5/img/nomatch.png" src="http://imgsports.eastday.com/sports/icons/team/' + item.teams[0].img + '">'
                        var name = item.teams[0].name.length > 3 ? item.teams[0].name.slice(0, 3) : item.teams[0].name
                        html += '				<div class="team">' + name + '</div>'
                        html += '			</span>'
                        html += '			<span class="icon">'
                        html += '				<img onerror=this.src="http://msports.eastday.com/h5/img/nomatch.png" src="http://imgsports.eastday.com/sports/icons/team/' + item.teams[1].img + '">'
                        var name = item.teams[1].name.length > 3 ? item.teams[1].name.slice(0, 3) : item.teams[1].name
                        html += '				<div class="team">' + name + '</div>'
                        html += '</span>'
                        html += '		</div>'
                        html += '		<div class="line">' + item.info1 + '</div>'
                        html += '		<span class="line-vertical"></span>'
                        html += '	</div>'
                    })
                    html += '</div>'
                })
                html += '<div class="match-group-center match-group">'
                html += '	<div class="match">'
                html += '		<div class="teams">'
                html += '			<span class="icon">'
                html += '				<img onerror=this.src="http://msports.eastday.com/h5/img/nomatch.png" src="http://imgsports.eastday.com/sports/icons/team/' + final.teams[0].img + '" alt="">'
                var name = final.teams[0].name.length > 3 ? final.teams[0].name.slice(0, 3) : final.teams[0].name
                html += '				<div class="team">' + name + '</div>'
                html += '			</span>'
                html += '			<div class="labels">'
                html += '				<div class="score">' + final.info1 + '</div>'
                html += '				<div class="score match-name">总决赛</div>'
                html += '			</div>'
                html += '			<span class="icon">'
                html += '				<img onerror=this.src="http://msports.eastday.com/h5/img/nomatch.png" src="http://imgsports.eastday.com/sports/icons/team/' + final.teams[1].img + '" alt="">'
                var name = final.teams[1].name.length > 3 ? final.teams[1].name.slice(0, 3) : final.teams[1].name
                html += '				<div class="team">' + name + '</div>'
                html += '			</span>'
                html += '		</div>'
                html += '	</div>'
                html += '</div>'
                for (var i = bottom.length - 1; i >= 0; i--) {
                    var group = bottom[i]
                    html += '<div class="match-group-bottom' + (i + 1) + ' match-group bottom">'
                    group.forEach(function (item, i) {
                        html += '	<div class="match">'
                        html += '		<span class="line-vertical"></span>'
                        html += '		<div class="line">' + item.info1 + '</div>'
                        html += '		<div class="teams">'
                        html += '			<span class="icon">'
                        var name = item.teams[0].name.length > 3 ? item.teams[0].name.slice(0, 3) : item.teams[0].name
                        html += '				<img onerror=this.src="http://msports.eastday.com/h5/img/nomatch.png" src="http://imgsports.eastday.com/sports/icons/team/' + item.teams[0].img + '">'
                        html += '				<div class="team">' + name + '</div>'
                        html += '			</span>'
                        html += '			<span class="icon">'
                        html += '				<img onerror=this.src="http://msports.eastday.com/h5/img/nomatch.png" src="http://imgsports.eastday.com/sports/icons/team/' + item.teams[1].img + '">'
                        var name = item.teams[1].name.length > 3 ? item.teams[1].name.slice(0, 3) : item.teams[1].name
                        html += '				<div class="team">' + name + '</div>'
                        html += '</span>'
                        html += '		</div>'
                        html += '	</div>'
                    })
                    html += '</div>'
                }
                $content.html(html)
                wsCache.set(`dataPlayoff`,$content.html() , {exp: 30 * 60})
            }).always(function () {
                $J_loading.hide()
            })
        }
        //加载赛程
        loadMatchSchedule(){
            var that=this
            var objAllId={
                'yingchao':'900006',
                'ouguan':'900011',
                'xijia':'900007',
                'yijia':'900008',
                'dejia':'900009',
                'zhongchao':'900005',
                'nba':'900002',
                'cba':'900003',
                'yaguan':'900013',
                'fajia':'900017'
            }
            var prevDate = new Date().format('yyyy/MM/dd') // 初始化今天时间
            var starts = new Date(prevDate).getTime()
            //加载头部日期
            loadhead()
            //默认执行 加载赛程列表
            requestMatchSchedule(starts)
            //加载前一天数据
            $content.on('click','.head .btn-left', function () {
                starts=starts-24 * 60 * 60 * 1000
                $content.find('.head .tit').html(formatDate(starts))
                requestMatchSchedule(starts)
            })
            $content.on('click','.head .btn-right', function () {
                starts=starts+24 * 60 * 60 * 1000
                $content.find('.head .tit').html(formatDate(starts))
                requestMatchSchedule(starts)
            })
            let isRequested=true
            $content.on('click','.btn-order', function () {
                let that=this
                if($(that).attr('data-ordered')|| !isRequested){popup(2);return}
                isRequested=false
                my.GLOBAL.makeJsonp(orderApi + $(this).attr('data-matchid'), {}).done(function (result) {
                    if(result.status==-1){
                        popup(1)
                    }else{
                        popup(2)
                        $(that).attr('data-ordered','1') //订阅过data-ordered为1
                    }
                }).fail(function () {
                    popup(3)
                }).always(function () {
                    isRequested=true
                })
            })
            $body.on('click','#popup', function () {
                $(this).hide()
            })
            //弹窗
            function popup(option){
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
            //加载赛程切换时间的头部
            function loadhead(){
                $content.html(`<div class="head">
                                    <div class="btn btn-left"></div>
                                    <div class="tit">${formatDate(starts)}</div>
                                    <div class="btn btn-right"></div>
                                </div><ul class="match-info"></ul>`)
            }
            //格式化日期为2017-03-13 周一
            function formatDate(starts){
                let weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
                let date=new Date(starts)
                return date.format('yyyy-MM-dd')+' '+weekday[date.getDay()]
            }
            //请求比赛赛程
            function requestMatchSchedule(starts){
                let data = {
                    startts: starts,
                    endts: starts + 1 * 24 * 60 * 60 * 1000,
                    saishiid: objAllId[that.classType] || '',
                    isimp: '1'
                }
                $content.children('.match-info').html('')
                $J_loading.show()
                my.GLOBAL.makeJsonp(host + 'matchba', data).done(function (result) {
                    if(!result.data.length){
                        $content.children('.match-info').html(`<li><h3>暂无数据</h3></li>`)
                        return
                    }
                    $content.children('.match-info').html(makeHtml(result))
                }).always(function () {
                    $J_loading.hide()
                })
            }
            function makeHtml(result){
                let html=''
                let data=result.data
                for(let item of data){
                    let title=item.title.split(' ')
                    let mHtml=''
                    if(item.ismatched==-1){
                        //预约先不做  todo
                        if(my.GLOBAL.isWeiXin()){
                            mHtml=`<div class="btn-order" data-matchid="${item.matchid}"><a href="javascript:;">预约</a></div>`
                        }else{
                            mHtml=`<div class="btn-living"><a href="${item.liveurl}">未开赛</a></div>`
                        }
                    }else if(item.ismatched==0){
                        mHtml=`<div class="btn-living"><a href="${item.liveurl}">直播中</a></div>`
                    }else{
                        mHtml=`<div class="score"><div>${item.home_score}</div><span>-</span><div>${item.visit_score}</div></div>
                        <div class="btn"><a href="${item.jijin_url? (item.liveurl+'?tab=saikuang'):item.liveurl }">集锦</a></div>
                        <div class="btn"><a href="${item.luxiang_url? (item.liveurl+'?tab=saikuang'):item.liveurl }">回放</a></div>`
                    }
                    html+=`<li>
                                <h6>${title[1]+' '+title[0]}</h6>
                                <div class="clearfix">
                                    <div class="item">
                                        <img src="${item.home_logoname}" alt=""/>
                                        <p>${item.home_team}</p>
                                    </div>
                                    <div class="m">${mHtml}</div>
                                    <div class="item">
                                        <img src="${item.visit_logoname}" alt=""/>
                                        <p>${item.visit_team}</p>
                                    </div>
                                </div>
                            </li>`
                }
                return html
            }
        }
        //加载统计
        loadStatistics(){
            let {keys} = Object;//扩展object的方法

            $content.html(`<div class="tab-h" id="dataSlideNav"></div><div class="tab-b tab-all"></div>`)
            let $dataSlideNav=$('#dataSlideNav')
            let $tabB=$content.find('.tab-b')
            var tableList = {
                'nba': {
                    'nba_defen': '得分',
                    'nba_lanban': '篮板',
                    'nba_zhugong': '助攻',
                    'nba_qiangduan': '抢断',
                    'nba_gaimao': '盖帽',
                    'nba_shiwu': '失误',
                    'nba_shentou': '神投',
                    'nba_sanfen': '三分',
                    'nba_xiaolv': '效率',
                    'nba_faqiu': '罚球'
                },
                'cba': {
                    'cba_defen': '得分',
                    'cba_lanban': '篮板',
                    'cba_zhugong': '助攻',
                    'cba_qiangduan': '抢断',
                    'cba_gaimao': '盖帽',
                    'cba_koulan': '扣篮',
                    'cba_shiwu': '失误',
                    'cba_fangui': '犯规'
                },
                'zhongchao': {
                    'zhongchao_sheshoubang': '射手榜',
                    'zhongchao_zhugong': '助攻',
                    'zhongchao_shemen': '射门',
                    'zhongchao_chuanweixieqiu': '传威胁球',
                    'zhongchao_beiqinfan': '被侵犯',
                    'zhongchao_qiangduan': '抢断',
                    'zhongchao_chuanzhong': '传中',
                    'zhongchao_chuanqiu': '传球',
                    'zhongchao_honghuangpai': '红黄牌',
                    'zhongchao_pujiu': '扑救',
                    'zhongchao_chuchangshijian': '出场时间',
                    'zhongchao_fangui': '犯规',
                    'zhongchao_jiewei': '解围'
                },
                'yingchao': {
                    'yingchao_sheshoubang': '射手榜',
                    'yingchao_zhugong': '助攻',
                    'yingchao_shemen': '射门',
                    'yingchao_chuanweixieqiu': '传威胁球',
                    'yingchao_beiqinfan': '被侵犯',
                    'yingchao_qiangduan': '抢断',
                    'yingchao_chuanzhong': '传中',
                    'yingchao_chuanqiu': '传球',
                    'yingchao_honghuangpai': '红黄牌',
                    'yingchao_pujiu': '扑救',
                    'yingchao_chuchangshijian': '出场时间',
                    'yingchao_fangui': '犯规',
                    'yingchao_jiewei': '解围'
                },
                'xijia': {
                    'xijia_sheshoubang': '射手榜',
                    'xijia_zhugong': '助攻',
                    'xijia_shemen': '射门',
                    'xijia_chuanweixieqiu': '传威胁球',
                    'xijia_beiqinfan': '被侵犯',
                    'xijia_qiangduan': '抢断',
                    'xijia_chuanzhong': '传中',
                    'xijia_chuanqiu': '传球',
                    'xijia_honghuangpai': '红黄牌',
                    'xijia_pujiu': '扑救',
                    'xijia_chuchangshijian': '出场时间',
                    'xijia_fangui': '犯规',
                    'xijia_jiewei': '解围'
                },
                'yijia': {
                    'yijia_sheshoubang': '射手榜',
                    'yijia_zhugong': '助攻',
                    'yijia_shemen': '射门',
                    'yijia_chuanweixieqiu': '传威胁球',
                    'yijia_beiqinfan': '被侵犯',
                    'yijia_qiangduan': '抢断',
                    'yijia_chuanzhong': '传中',
                    'yijia_chuanqiu': '传球',
                    'yijia_honghuangpai': '红黄牌',
                    'yijia_pujiu': '扑救',
                    'yijia_chuchangshijian': '出场时间',
                    'yijia_fangui': '犯规',
                    'yijia_jiewei': '解围'
                },
                'dejia': {
                    'dejia_sheshoubang': '射手榜',
                    'dejia_zhugong': '助攻',
                    'dejia_shemen': '射门',
                    'dejia_chuanweixieqiu': '传威胁球',
                    'dejia_beiqinfan': '被侵犯',
                    'dejia_qiangduan': '抢断',
                    'dejia_chuanzhong': '传中',
                    'dejia_chuanqiu': '传球',
                    'dejia_honghuangpai': '红黄牌',
                    'dejia_pujiu': '扑救',
                    'dejia_chuchangshijian': '出场时间',
                    'dejia_fangui': '犯规',
                    'dejia_jiewei': '解围'
                },
                'fajia': {
                    'fajia_sheshoubang': '射手榜',
                    'fajia_zhugong': '助攻',
                    'fajia_shemen': '射门',
                    'fajia_chuanweixieqiu': '传威胁球',
                    'fajia_beiqinfan': '被侵犯',
                    'fajia_qiangduan': '抢断',
                    'fajia_chuanzhong': '传中',
                    'fajia_chuanqiu': '传球',
                    'fajia_honghuangpai': '红黄牌',
                    'fajia_pujiu': '扑救',
                    'fajia_chuchangshijian': '出场时间',
                    'fajia_fangui': '犯规',
                    'fajia_jiewei': '解围'
                },
                'ouguan': {
                    'ouguan_sheshoubang': '射手榜',
                    'ouguan_zhugong': '助攻',
                    'ouguan_shemen': '射门',
                    'ouguan_chuanweixieqiu': '传威胁球',
                    'ouguan_beiqinfan': '被侵犯',
                    'ouguan_qiangduan': '抢断',
                    'ouguan_chuanzhong': '传中',
                    'ouguan_chuanqiu': '传球',
                    'ouguan_honghuangpai': '红黄牌',
                    'ouguan_pujiu': '扑救',
                    'ouguan_chuchangshijian': '出场时间',
                    'ouguan_fangui': '犯规',
                    'ouguan_jiewei': '解围'
                },
                'yaguan': {
                    'yaguan_sheshoubang': '射手榜',
                    'yaguan_zhugong': '助攻',
                    'yaguan_shemen': '射门',
                    'yaguan_chuanweixieqiu': '传威胁球',
                    'yaguan_beiqinfan': '被侵犯',
                    'yaguan_qiangduan': '抢断',
                    'yaguan_chuanzhong': '传中',
                    'yaguan_chuanqiu': '传球',
                    'yaguan_honghuangpai': '红黄牌',
                    'yaguan_pujiu': '扑救',
                    'yaguan_chuchangshijian': '出场时间',
                    'yaguan_fangui': '犯规',
                    'yaguan_jiewei': '解围'
                }
            }
            initNav(this.classType)
            $dataSlideNav.height(this.slideHeight)
            $dataSlideNav.on('click','.item', function () {
                let dataType=$(this).attr('data-type')
                let data={datatype: dataType}
                $dataSlideNav.children().removeClass('active')
                $(this).addClass('active')
                let dataStatistics=wsCache.get(`dataStatistics${dataType}`)
                if(dataStatistics){ //有缓存就加缓存进去
                    $tabB.html(dataStatistics)
                    return
                }
                $tabB.html('') //先清空内容
                $J_loading.show()
                my.GLOBAL.makeJsonp(host + 'data', data).done(function (result) {
                    $tabB.html(produceHtml(result))
                    wsCache.set(`dataStatistics${dataType}`,$tabB.html() , {exp: 30 * 60})
                }).always(function () {
                    $J_loading.hide()
                })
            })
            $dataSlideNav.find('.item').eq(0).click() //默认执行第一个
            function initNav(dataType) {
                let dataobj = tableList[dataType]
                for(let item of keys(dataobj)){
                    /*if(index==0){
                        $dataSlideNav.append(`<div class="item active" data-type="${item}">${dataobj[item]}</div>`)
                    }else{}*/
                        $dataSlideNav.append(`<div class="item" data-type="${item}">${dataobj[item]}</div>`)

                }
            }
            function produceHtml(result){
                var html = `<table class="tongji"><tr style="background: #f8f8f8">`
                var data = result.data.data
                var items = result.data.items
                switch (result.data.name) {
                    case 'nba':
                        html += `<th>${items[0]}</th><th>${items[1]}</th><th>${items[3]}</th><th>${items[2]}</th>`
                        break
                    case 'cba':
                        html += `<th>${items[0]}</th><th>${items[1]}</th><th>${items[4]}</th><th>${items[2]}</th>`
                        break
                    default:
                        html += `<th>${items[0]}</th><th>${items[1]}</th><th>${items[3]}</th><th>${items[2]}</th>`
                }
                switch (result.data.name) {
                    case 'cba':
                        for (var i = 0; i < 10; i++) {
                            html += `<tr><td>${data[i][items[0]]}</td><td>${data[i][items[1]]}</td><td>${data[i][items[4]]}</td><td>${data[i][items[2]]}</td></tr>`
                        }
                        break
                    default:
                        for (var i = 0; i < 10; i++) {
                            html += '<tr>'
                            if (data[i][items[4]]) {
                                html += `<td>${data[i][items[0]]}</td><td>${data[i][items[1]]}</td><td>${data[i][items[3]]}</td><td>${data[i][items[2]]}</td>`
                            } else {
                                html += `<td>${data[i][items[0]]}</td><td>${data[i][items[1]]}</td><td>${data[i][items[3]]}</td><td>${data[i][items[2]]}</td>`
                            }
                            html += `</tr>`
                        }

                        break
                }
                html += `</table>`
                return html
            }
        }
        //加载排名
        loadRanking(){
            let type
            if (this.classType == 'nba') {
                type = this.classType + '_paiming'
            } else {
                type = this.classType + '_jifenbang'
            }
            let dataRanking=wsCache.get(`dataRanking${type}`)
            if(dataRanking){ //有缓存就加缓存进去
                $content.html(dataRanking)
                return
            }
            var data = {
                datatype: type
            }
            $J_loading.show()
            my.GLOBAL.makeJsonp(host + 'data', data).done(function (result) {
                $J_loading.hide()
                $content.html(produceHtml(result))
                wsCache.set(`dataRanking${type}`,$content.html() , {exp: 30 * 60})
            })

            function produceHtml(result) {
                var data = result.data.data
                var items = result.data.items
                var html = ''
                var colNum
                colNum = items ? items.length : 0
                if (result.data.name == 'nba') {
                    colNum = data[0].items.length
                    for (var j = 0; j < data.length; j++) {
                        html += `<div class="tab-b tab-p"><table><tr>`
                        for(let [index,item] of data[j].items.entries()){
                            if(index==0){
                                html += `<th colspan="2">${item}</th>`
                            }else if(index>1){
                                html += `<th>${item}</th>`
                            }
                        }
                        var arrItems = data[j].items
                        html += `</tr>`
                        for (var i = 0; i < data[j].list.length; i++) {
                            html += `<tr><td><span>${data[j].list[i][arrItems[0]]}</span></td>
                           <td><a href=""><span class="is_img"><img onerror="this.src='http://msports.eastday.com/h5/img/logo_default.png'" src="${data[0].list[i].球队图标}"></span><span class="is_word">${data[j].list[i].球队}</span></a></td>
                           <td><span>${data[j].list[i].胜}</span></td>
                           <td><span>${data[j].list[i].负}</span></td>
                           <td><span>${data[j].list[i].胜率}</span></td>
                           <td><span>${data[j].list[i].胜差}</span></td>
                           <td><span>${data[j].list[i].近况}</span></td>
                           </tr>`
                        }
                        html += `</table></div>`
                    }
                } else if (result.data.name == 'ouguan' || result.data.name == 'yaguan') {
                    for (var j = 0; j < data.length; j++) {
                        // 一共有这么多组
                        html += `<div class="tab-b  tab-p"><table><tr><th colspan="${colNum}" class="tc">${data[j].title}</th></tr><tr>`
                        for(let [index,item] of items.entries()){
                            if(index==0){
                                html += `<th colspan="2">${item}</th>`
                            }else if(index>1){
                                html += `<th>${item}</th>`
                            }
                        }
                        html += `</tr>`
                        for (var i = 0; i < data[j].list.length; i++) {
                            html += `<tr>` // 每一组的总行
                            for (var m = 0; m < colNum; m++) {
                                if (items[m].indexOf('队') >= 0) {
                                    html += `<td><a href=""><span class="is_img"><img onerror="this.src='http://msports.eastday.com/h5/img/logo_default.png'" src="${data[i].list[i].球队图标}"></span><span class="is_word">${data[j].list[i].球队}</span></a></td>`
                                } else {
                                    html += `<td><span>${data[i].list[i][items[m]]}</span></td>`
                                }
                            }
                            html += `</tr>`
                        }
                        html += `</table></div>`
                    }
                } else {
                    html += `<div class="tab-b tab-p"><table><tr>`
                    for(let [index,item] of items.entries()){
                        if(index==0){
                            html += `<th colspan="2">${item}</th>`
                        }else if(index>1){
                            html += `<th>${item}</th>`
                        }
                    }
                    html += `</tr>`
                    for (var i = 0; i < data.length; i++) {
                        html += `<tr>`
                        for (var j = 0; j < colNum; j++) {
                            if (items[j].indexOf('队') >= 0) {
                                html += `<td><a href="javascript:;"><span class="is_img"><img onerror="this.src='http://msports.eastday.com/h5/img/logo_default.png'" src="${data[i].球队图标}"></span><span class="is_word">${data[i].球队}</span></a></td>`
                            } else {
                                html += `<td><span>${data[i][items[j]]}</span></td>`
                            }
                        }
                        html += `</tr>`
                    }
                    html += `</table></div>`
                }
                return html
            }
        }
        //点击加载其他的主栏目
        loadMainColumns(){
            var that=this
            $navMenu.find('li').click(function () {
                $(this).parent().children().removeClass('active')
                $(this).addClass('active')
                that.dataType=$(this).attr('data-type')
                that.loadContent()
            })
        }
    }
    let eastSport=new EastSport()
    return my
})(module || {})