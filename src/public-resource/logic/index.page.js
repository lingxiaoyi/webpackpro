import '../../public-resource/sass/newindex.scss'
import '../../public-resource/sass/swiper.scss'
import 'pages/index/style.scss'
import 'zepto/src/selector'
import 'zepto/src/detect'
import 'zepto/src/fx'
import 'zepto/src/fx_methods'
import 'zepto/src/touch'
import 'zepto/src/gesture'
import './log.js'
import WebStorageCache from 'web-storage-cache'
import Swiper from 'swiper'
import FastClick from 'fastclick'
import config from 'configModule'
import '../libs/lib.prototype'
const _util_ = require('../libs/libs.util')
const _AD_ = require('../libs/ad.channel')
let {HOST, HOST_DSP_LIST, ORDER_API, HOME_LUNBO_API} = config.API_URL

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let $swiperSlides = $('#mainSection').children('.swiper-wrapper').children('.swiper-slide') //外层swiper
    //导航条元素
    let $body = $('body')
    let $header = $('header')
    let $headNav = $('#headNav')
    let $headNavLi = $headNav.find('.nav-new ul li')
    let $headNavNew = $headNav.find('.nav-new')
    let $pullDownLoadTips = $headNav.children('.pull-down-load-tips')
    let wsCache = new WebStorageCache()
    $body.append(`<div class="popup" id="popup"></div>`)//加入弹窗
    let $popup = $('#popup')
    // 定义需要传入接口的值
    const _os_ = _util_.getOsType()
    const _recgid_ = _util_.getUid()
    let _qid_ = _util_.getPageQid()
    const _domain_ = 'dfsports_h5'
    const _pixel_ = window.screen.width + '*' + window.screen.height
    _qid_ = _AD_['indexGg'][_qid_] ? _qid_ : 'null' //将qid过滤 如果广告中没有定义的就为null
    class EastSport {
        constructor() {
            this.curPos = _util_.CookieUtil.get('curPos') || 0
            this.channel = '' //根据这个值去加载相应的新闻内容
            this.pullUpFinished = [
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ] //下拉加载用 防止重复加载
            this.startkeyArr = wsCache.get('startkeyArr') || [
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                ''
            ] // 用来拉取分页
            this.newkeyArr = wsCache.get('newkeyArr') || [
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                ''
            ] // 用来拉取分页
            this.ggIndexArr = wsCache.get('ggIndexArr') || [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ]
            this.headerHeight = '' //logo的固定高度
            this.loadingHeight = wsCache.get('loadingHeight') || 0
            this.slideHeight = '' //模块的固定高度
            this.dataType = '' //栏目的类型 tuijian shipin NBA
            this.hasmLinks = [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ]
            this.pgnumState = {
                0: [
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1
                ],
                1: [
                    -1,
                    -1,
                    -1,
                    -1,
                    -1,
                    -1,
                    -1,
                    -1,
                    -1,
                    -1,
                    -1,
                    -1
                ]
            } //2、3、4 -1、-2、-3正值代表上拉 负值代表下拉
            this.idx = wsCache.get('idx') || [
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1
            ] //上拉的列表位置
            this.idxtop = wsCache.get('idxtop') || [
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1
            ] //下拉的列表位置
            this.pgnum = [
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1
            ]
            //下拉所需值
            this.startPos = 0			// 滑动开始位置
            this.touchDistance = 0		// 滑动距离
            this.isTop = false				// 顶部判断标志
            this.TOUCH_DISTANCE = 100		// 规定滑动加载距离
            this.direction = '' //规定手指滑动的方向slideDown向下
            this.clientWidth = $(window).width()
            this.isTouchBottom = false//判断是否拉到最底端
            this.pullDownFinished = true//只有接口调用完成后才能下一次调用
            this.isSlideMove = false
            this.firstIntoPage = true //第一次进入页面
            this.focusRequest = ''
            this.indexmatchRequest = ''
            this.newspoolRequest = ''
            this.action = wsCache.get('action') || false //没行动   加载其他模块就为true
            this.dspData = ''
            this.init()
        }

        init() {
            this.computedSlideHeight() //计算栏目的高度
            this.changeNavPos() //在注册导航栏点击事件
            $headNavLi.eq(this.curPos).click() //加载当前栏目数据
        }

        computedSlideHeight() {
            let wHeight = window.screen.height
            this.headerHeight = $header.height() //这2个高度下边会用到
            let headNavHeight = $headNav.height()
            this.slideHeight = wHeight - this.headerHeight - headNavHeight //这2个高度下边会用到
            let that = this
            $swiperSlides.each(function() {
                $(this).css({
                    'height': that.slideHeight + 'px',
                    'overflowY': 'scroll'
                })
            })
        }

        changeNavPos() {
            let liWArr = []
            let that = this
            $headNavLi.each(function() {
                liWArr.push($(this).width())
            })
            $headNavLi.click(function() {
                let i = $(this).index()
                if (!that.firstIntoPage && i === that.curPos) return
                if (!that.firstIntoPage) {
                    wsCache.set(`scrollTop${that.curPos}`, $swiperSlides.eq(that.curPos).scrollTop(), {exp: 10 * 60})
                }
                $swiperSlides.eq(that.curPos).html(`<div class="loading-tips1 l-btn-refresh1"><div><i class="iloading rotating"></i>正在加载</div></div>`)
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
                $headNavNew.find('ul').scrollLeft(_util_.computedWidth(liWArr, (i - 2)) - 30)
                that.curPos = i
                that.channel = $(this).attr('data-channel')
                _util_.CookieUtil.set('curPos', that.curPos, 1 / 6) //保存当前浏览位置一天
                //加载模块内容
                that.dataType = $(this).attr('data-type')
                //加载缓存的数据或者线上的
                if (wsCache.get(`newsModule${that.curPos}`) && wsCache.get(`newsModule${that.curPos}`).indexOf('iframe') >= 0 && wsCache.get(`newsModule${that.curPos}`).indexOf('data-dsp="hasDsp"') < 0) {
                    $swiperSlides.eq(that.curPos).html(wsCache.get(`newsModule${that.curPos}`))
                    $swiperSlides.eq(that.curPos).scrollTop(wsCache.get(`scrollTop${that.curPos}`))
                    that.delLoadingTips()
                    that.pullUpLoadNews() //注册加载上拉更多新闻
                    that.pullDownLoadNews() //注册加载下拉更多新闻
                    that.btnLoadMoreNews() //注册点击下拉加载事件btn-load-more元素
                    that.unload() //离开页面事件
                    //激活轮播图
                    if ($('#swiperContainer').length) {
                        new Swiper('#swiperContainer', {
                            loop: true, /* spaceBetween: 10, */
                            centeredSlides: true,
                            autoplay: 4000,
                            autoplayDisableOnInteraction: false
                        })
                    }
                } else {
                    that.ggIndexArr[that.curPos] = 0
                    that.idx[that.curPos] = 1
                    that.idxtop[that.curPos] = -1
                    that.loadDataHtml()
                }
                that.firstIntoPage = false //进过页面就判断为进过
            })
        }

        registMySwiper() {
            let that = this
            this.mySwiper = new Swiper('#mainSection', {
                speed: 500,
                onInit: function(swiper) {},
                onSlideChangeStart: function(swiper) {
                    let activeIndex = swiper.activeIndex
                    $headNavLi.eq(activeIndex).click() //激活导航条移动
                },
                onSlideChangeEnd: function(swiper) {},
                onSliderMove: function(swiper, event) {
                    that.isSlideMove = true
                    that.setPullDownLoadTipsAnimation('slideUp 0s') //发现是swiper移动瞬间将元素向上隐藏
                },
                onTouchEnd: function(swiper) {
                    that.isSlideMove = false
                }
            })
        }

        loadDataHtml() {
            switch (this.dataType) {
                case 'tuijian':
                    this.loadRecommendCol()
                    break
                case 'shipin':
                    this.initNews()
                    break
                default:
                    this.loadOtherCol()
            }
        }

        loadRecommendCol() {
            if (_qid_ === 'tiyuxqqkj') {
                this.initNews()
            } else {
                this.loadFocusPic()
            }
        }

        loadOtherCol() {
            if (_qid_ === 'tiyuxqqkj') {
                this.initNews()
            } else {
                this.loadHotMatch()
            }
        }

        // 轮播图
        loadFocusPic() {
            let that = this
            let $el = $('<div id="swiperContainer" class="swiper-container fs-swiper-container"></div>')
            that.focusRequest = $.ajax({
                type: 'GET',
                url: HOME_LUNBO_API,
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'callbcak'
            }).done(function(result) {
                $el.append(`<div class="swiper-wrapper">${produceHtml(result)}</div>`)
                $swiperSlides.eq(that.curPos).html('')
                $swiperSlides.eq(that.curPos).append($el)
                setTimeout(function() {
                    $('#swiperContainer').find('.swiper-slide img').each(function() {
                        $(this).attr('src', $(this).attr('data-src'))
                    })
                }, 50)
                that.delLoadingTips(0)
                that.loadHotMatch()
                //激活轮播图
                new Swiper('#swiperContainer', {
                    loop: true, /* spaceBetween: 10, */
                    centeredSlides: true,
                    autoplay: 4000,
                    autoplayDisableOnInteraction: false
                })
            }).done(function() { //加广告
                let _ggID_ = _AD_['indexGGAddThree'][_qid_]
                $el.before(`<div><div id="${_ggID_}"></div></div>`)
                _util_.getScript(`http://tt123.eastday.com/${_ggID_}.js`, function() {
                }, $(`#${_ggID_}`)[0])
            })

            function produceHtml(result) {
                let data = result.data
                let html = ''
                data.forEach(function(item, i) {
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
            let $el = $(`<section class="sec-match"></section>`)

            let data = {
                channel: this.channel,
                os: _os_,
                recgid: _recgid_,
                qid: _qid_,
                domain: _domain_
            }
            let that = this
            that.indexmatchRequest = _util_.makeJsonp(HOST + 'indexmatch', data).done(function(result) {
                if (result.data.length) { //有推荐赛程就添加元素
                    $el.append(`<ul class="clearfix">${produceHtml(result)}</ul>`)
                    if (that.curPos !== 0) {
                        $swiperSlides.eq(that.curPos).html('')
                    }
                    $swiperSlides.eq(that.curPos).append($el)
                    $el.after(`<div class="separate-line"></div>`)
                    loadMatchMore.call(that)
                    that.delLoadingTips()
                }
                that.initNews()
            }).done(function() { // 比赛中的获取实时比分
                getlivesinfo()

                function getlivesinfo() {
                    _util_.makeJsonp(HOST + 'livesinfo', data).done(function(result) {
                        matchIdScore(result)
                    })
                }
            })
            let isRequested = true
            $body.on('click', '.btn-order', function() {
                let that = this
                if ($(that).attr('data-ordered') || !isRequested) {
                    popup(2)
                    return
                }
                isRequested = false
                _util_.makeJsonp(ORDER_API + $(this).attr('data-matchid'), {}).done(function(result) {
                    if (result.status === -1) {
                        popup(1)
                    } else {
                        popup(2)
                        $(that).attr('data-ordered', '1') //订阅过data-ordered为1
                    }
                }).fail(function() {
                    popup(3)
                }).always(function() {
                    isRequested = true
                })
            })
            $body.on('click', '#popup', function() {
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
                        break
                    case 2:
                        html = `<div class="content">
                                    <p>您已预约成功此场比赛</p>
                                </div>`
                        break
                    case 3:
                        html = `<div class="content">
                                    <p>请重新刷新页面</p>
                                </div>`
                        break
                }
                $popup.show().html(html)
            }

            // 匹配相同的ID赛事 实时更新比分
            function matchIdScore(result) {
                result.list.forEach(function(item, i) {
                    let $ele = $('#' + item.id)
                    $ele.find('.score').text(item.home_score + '-' + item.visit_score)
                    $ele.find('.score').next().text('直播中')
                })
            }

            function produceHtml(result) {
                let data = result.data
                let html = ''
                data.forEach(function(item, i) {
                    let title = item.title.split(' ')[1]
                    let home_team = item.home_team
                    let visit_team = item.visit_team
                    let score = item.home_score + '-' + item.visit_score
                    let orderStr = ''//判断预约的功能
                    if (item.ismatched === -1) {
                        if (_util_.isWeiXin()) {
                            orderStr = `<a class="btn-order" data-matchid="${item.matchid}" href="javascript:"><span>预约</span></a>`
                        } else {
                            orderStr = '<span class="empty">未开赛</span>'
                        }
                    } else if (item.ismatched === 0) {
                        orderStr = '<span>直播中</span>'
                    } else {
                        orderStr = '<span>集锦</span>'
                    }

                    if (i < 2) {
                        item.home_logoname = item.home_logoname || `${config.DIRS.BUILD_FILE.images['logo_default']}`
                        item.visit_logoname = item.visit_logoname || `${config.DIRS.BUILD_FILE.images['logo_default']}`
                        html += `<li class="clearfix">
                                <a href="${item.liveurl}" suffix="btype=index&subtype=recMatch&idx=${i}">
                                <h3>${title}</h3>
                                <div class="team">
                                    <img src="${item.home_logoname}" alt=""/>
                                    <p>${home_team}</p>
                                </div>
                                <div class="info" id="${item.matchid}">
                                    <div class="score">${item.ismatched === '-1' ? _util_.formatTimeToMatch(item.currentServerTime, item.starttime) : score}</div>
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
                if (this.curPos === 0) { //第一个推荐栏目
                    $el.after(`<a class="match-more" href="schedule.html">
                                    <div class="l">${dateTxt}</div>
                                    <div class="m">查看今天全部热门比赛</div>
                                    <div class="r"></div>
                                </a>`)
                } else { //其他栏目
                    $el.after(`<div class="match-more">
                                    <div class="item">
                                        <a href="http://msports.eastday.com/index_category_schedule.html?class=${that.dataType.toLowerCase()}">
                                            <img src="${config.DIRS.BUILD_FILE.images['i-s-saicheng']}" alt=""/>
                                            赛程
                                        </a>
                                    </div>
                                    <div class="item">
                                        <a href="http://msports.eastday.com/data_tongji_basketball.html?class=${that.dataType.toLowerCase()}">
                                            <img src="${config.DIRS.BUILD_FILE.images['i-shuju']}" alt=""/>
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
                pgnum: this.pgnumState[0][this.curPos],
                os: _os_,
                recgid: _recgid_,
                qid: _qid_,
                domain: _domain_
            }

            let that = this
            let api = ''
            if (that.dataType === 'shipin') {
                api = 'videonewspool'
            } else {
                api = 'newspool'
            }
            that.newspoolRequest = _util_.makeJsonp(HOST + api, data).done(function(result) {
                $el.append(`<ul>${that.produceListHtml(result, 0)}</ul>`)
                $swiperSlides.eq(that.curPos).append($el)
                let loading = $(`<div class="loading-tips2 btn-refresh2"><span class="loading rotating"></span>正在载入新内容...</div>`)
                $el.after(loading)//尾部加入load动画
                that.loadingHeight = loading.height()//计算下方load高度
                that.startkeyArr[that.curPos] = result.endkey
                that.newkeyArr[that.curPos] = result.newkey
                if (that.curPos !== 0) {
                    wsCache.set(`action`, true, {exp: 10 * 60})
                } //加载过其他模块
                wsCache.set('idx', that.idx, {exp: 10 * 60})
                wsCache.set('startkeyArr', that.startkeyArr, {exp: 10 * 60})
                wsCache.set('newkeyArr', that.newkeyArr, {exp: 10 * 60})
                wsCache.set('loadingHeight', that.loadingHeight, {exp: 10 * 60})//保存load高度
                that.delLoadingTips()
                let i = that.curPos
                setTimeout(function() {
                    wsCache.set(`newsModule${i}`, $swiperSlides.eq(i).html(), {exp: 10 * 60})
                }, 400)
                that.pullUpLoadNews() //注册加载上拉更多新闻
                that.pullDownLoadNews() //注册加载下拉更多新闻
                that.btnLoadMoreNews() //注册点击下拉加载事件btn-load-more元素
                that.unload() //离开页面事件
            }).done(function() {
                if (that.dataType === 'shipin') {
                    _AD_.videoList[_qid_].forEach(function(item, i) {
                        _util_.getScript(`http://tt123.eastday.com/${item}.js`, function() {}, $(`#huanqiu${i + 1}`)[0])
                    })
                } else {
                    that.requestDspUrl().done(function(data) {
                        that.dspData = that.changeDspDataToObj(data)
                        for (let i = 0; i < 4; i++) {
                            if (that.dspData[i]) {
                                $(`#module${that.curPos + '_' + i}`).html(that.loadDspHtml(i))
                            } else {
                                let value = $(`#module${that.curPos + '_' + i}`).children().attr('id')
                                _util_.getScript(`http://tt123.eastday.com/${value}.js`, function() {
                                }, $('#' + value)[0])
                            }
                        }
                        setTimeout(function() {
                            that.reportDspInviewbackurl()
                        }, 0)
                    })
                }
            })
        }

        // 上拉加载新闻
        pullUpLoadNews() {
            let that = this
            $swiperSlides.eq(that.curPos).scroll(function() {
                if (!$(this).children('.loading-tips2').length) return
                let tipsTop = $(this).children('.loading-tips2').position().top //这个是距离父元素定位的距离  会变的越来越小
                let slideHeight = that.slideHeight
                if (!$header.is(':visible')) {
                    slideHeight = slideHeight + that.headerHeight
                }
                //let scrollTop = $(this).scrollTop()
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
                os: _os_,
                recgid: _recgid_,
                qid: _qid_,
                domain: _domain_
            }
            let api = ''
            if (that.dataType === 'shipin') {
                api = 'videonewspool'
            } else {
                api = 'newspool'
            }
            _util_.makeJsonp(HOST + api, data).done(function(result) {
                if (!result.data.length) {
                    //提示没有数据了
                    that.changeLoadingTips2('没有更过内容了...')
                    return
                }
                that.startkeyArr[that.curPos] = result.endkey
                that.newkeyArr[that.curPos] = result.newkey
                $swiperSlides.eq(that.curPos).find('.sec-news-list ul').append(that.produceListHtml(result, 1))
                wsCache.set(`action`, true, {exp: 10 * 60})
                that.pgnum[that.curPos]++
                that.pullUpFinished[that.curPos] = true
                wsCache.set('startkeyArr', that.startkeyArr, {exp: 10 * 60})
                wsCache.set('newkeyArr', that.newkeyArr, {exp: 10 * 60})
                let i = that.curPos
                setTimeout(function() {
                    wsCache.set(`newsModule${i}`, $swiperSlides.eq(i).html(), {exp: 10 * 60})
                }, 400)
            }).done(function() {
                that.requestDspUrl(3).done(function(data) {
                    that.dspData = that.changeDspDataToObj(data)
                    for (let i = 2; i >= 0; i--) {
                        if (that.dspData[i]) {
                            $(`#module${that.curPos + '_' + (that.ggIndexArr[that.curPos] - 3 + i)}`).html(that.loadDspHtml(i))
                        } else {
                            let value = $(`#module${that.curPos + '_' + (that.ggIndexArr[that.curPos] - 3 + i)}`).children().attr('id')
                            _util_.getScript(`http://tt123.eastday.com/${value}.js`, function() {
                            }, $('#' + value)[0])
                        }
                    }
                    setTimeout(function() {
                        that.reportDspInviewbackurl()
                    }, 0)
                })
            }).fail(function() {
                that.pullUpFinished[that.curPos] = true
            })
        }

        produceListHtml(result, ggPos) {
            let data = result.data
            let html = ''
            let that = this
            if (that.dataType === 'shipin') {
                data.forEach(function(item, i) {
                    html += `<li class="clearfix video-list">
                                    <div class="img"><a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0">
                                        <img class="lazy" src="${item.miniimg[0].src}"/>
                                        <div class="title">${item.topic}</div>
                                        <div class="icon"></div>
                                        <div class="duration">${_util_.formatDuring(item.videoalltime)}</div></a>
                                     </div>
                                    <div class="info">
                                        <div class="img"> <img src="${item.dfhheadsrc ? item.dfhheadsrc : `${config.DIRS.BUILD_FILE.images['i-logo']}`}" alt=""> </div>
                                        <div class="name">${item.dfhname ? item.dfhname : '五星体育'}</div>
                                        <div class="tag">
                                            
                                            <!--<i>詹姆士</i> <i>勇士</i> -->
                                        </div>
                                    </div>
                                </li>`
                    //加入广告的位置
                    if (ggPos === 0) {
                        if (i === 1) {
                            html += `<li class="clearfix video-list" id="huanqiu1"></li>`
                        } else if (i === 4) {
                            html += `<li class="clearfix video-list" id="huanqiu2"></li>`
                        } else if (i === 9) {
                            html += `<li class="clearfix video-list" id="huanqiu3"></li>`
                        } else if (i === 14) {
                            html += `<li class="clearfix video-list" id="huanqiu4"></li>`
                        }
                    }
                })
            } else {
                data.forEach(function(item, i) {
                    let length = item.miniimg.length// 判断缩略图的数量
                    if (length < 3 && length >= 1) {
                        html += `<li class="clearfix">
                                    <a href="${item.url}" suffix="${`ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${that.idx[that.curPos]}`}">
                                        <div class="img">
                                            <img class="lazy" src="${item.miniimg[0].src}"/>
                                        </div>
                                        <div class="info">
                                            <div class="title">${item.topic}</div>
                                            <div class="source clearfix">
                                                ${item.iszhiding === 1 && i === 0 ? '<div class="tag-zd">置顶</div>' : ''}
                                            <div class="l">${item.source}</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>`
                    } else if (length >= 3) {
                        html += `<li class="clearfix">
                                     <a href="${item.url}" suffix="${`ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${that.idx[that.curPos]}`}">
                                        <div class="title">${item.topic}</div>
                                        <div class="imgs">
                                            <img class="lazy" src="${item.miniimg[0].src}">
                                            <img class="lazy" src="${item.miniimg[1].src}">
                                            <img class="lazy" src="${item.miniimg[2].src}">
                                        </div>
                                        <div class="source clearfix">
                                            ${item.iszhiding === 1 && i === 0 ? '<div class="tag-zd">置顶</div>' : ''}
                                            <div class="l">${item.source}</div>
                                        </div>
                                    </a>
                                </li>`
                    }
                    that.idx[that.curPos]++
                    //加入广告的位置
                    if (ggPos === 0) {
                        if (i === 1) { html += that.loadgg() }
                    }
                    if ((i + 1) % 5 === 0 && that.ggIndexArr[that.curPos] < 19) {
                        html += that.loadgg()
                    }
                    //中间赛程 排行 统计 下载模块
                    let mlinksLength = $swiperSlides.eq(that.curPos).find('.sec-news-list ul').find('.m-links').length
                    if (that.curPos !== 0 && i === 4 && !mlinksLength) {
                        html += `<li class="clearfix" style="padding:0;border: 0">
                            <div class="clearfix m-links">
                                <div>
                                    <a href="data.html?datatype=s&classtype=${that.dataType.toLowerCase()}">
                                        <img src="${config.DIRS.BUILD_FILE.images['i-saicheng']}" alt=""/>
                                        <p>赛程</p>
                                    </a>
                                </div>
                                <div>
                                    <a href="data.html?datatype=t&classtype=${that.dataType.toLowerCase()}">
                                        <img src="${config.DIRS.BUILD_FILE.images['i-tongji']}" alt=""/>
                                        <p>统计</p>
                                    </a>
                                </div>
                                <div>
                                    <a href="data.html?datatype=p&classtype=${that.dataType.toLowerCase()}">
                                        <img src="${that.dataType === 'NBA' ? `${config.DIRS.BUILD_FILE.images['i-paiming']}` : `${config.DIRS.BUILD_FILE.images['i-jifenbang']}`}" alt=""/>
                                        <p>${that.dataType === 'NBA' ? '排名' : '积分榜'}</p>
                                    </a>
                                </div>
                                <div>
                                    <a href="download-app.html">
                                        <img src="${config.DIRS.BUILD_FILE.images['i-zhibo']}" alt=""/>
                                        <p>看直播</p>
                                    </a>
                                </div>
                            </div>
                        </li>`
                        that.hasmLinks[that.curPos] = true
                    }
                })
            }
            return html
        }

        // 下拉加载新闻
        pullDownLoadNews() {
            let that = this
            $swiperSlides.eq(that.curPos).on('touchstart', function(e) {
                // 防止重复快速下拉
                let _touch = e.touches[0]
                that.startPos = _touch.pageY
                that.isTouchBottom = false
                if ($(this).scrollTop() <= 0) {
                    that.isTop = true
                } else {
                    that.isTop = false
                }
            })

            $swiperSlides.eq(that.curPos).on('touchend', function(e) {
                // 达到下拉阈值 启动数据加载
                if (that.direction === 'slideDown' && that.isSlideMove === false) {
                    $header.show()
                    $swiperSlides.each(function() {
                        $(this).css({
                            'height': that.slideHeight + 'px'
                        })
                    })
                } else if (that.direction === 'slideUp' && that.isSlideMove === false) {
                    $header.hide()
                    $swiperSlides.each(function() {
                        $(this).css({
                            'height': that.slideHeight + that.headerHeight + 'px'
                        })
                    })
                }
                if (that.isTouchBottom && that.pullDownFinished) {
                    that.pullDownFinished = false
                    that.loadNewsListForPullDown()
                } else { //松开返回顶部
                    if (that.pullDownFinished === true && that.isSlideMove === false) {
                        if ($pullDownLoadTips.attr('style').indexOf('slideDown') >= 0) {
                            that.setPullDownLoadTipsAnimation('slideUp 1s ease forwards')
                        }
                    }
                }
            })
            $swiperSlides.eq(that.curPos).on('touchmove', function(e) {
                let _touch = e.touches[0]
                let py = _touch.pageY
                that.touchDistance = py - that.startPos
                if (that.isSlideMove === true) { return }
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
                        //that.touchDistance = that.TOUCH_DISTANCE
                        that.isTouchBottom = true
                        if (!that.pullDownFinished) { //如果这个值是false 那么模块还在加载中 不用提示松开刷新
                            that.setPullDownLoadTips('加载中...')
                        } else {
                            that.setPullDownLoadTips('松开刷新')
                        }
                    } else {
                        that.isTouchBottom = false
                        that.setPullDownLoadTips('下拉加载')
                    }
                    that.setPullDownLoadTipsAnimation('slideDown 1s ease forwards')
                    that.slideDownAnimate = true
                    $pullDownLoadTips.find('.iloading').css({
                        'transform': `rotate(${that.touchDistance}deg)`
                    })
                    e.preventDefault()
                } else {
                    that.isTouchBottom = false
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
                os: _os_,
                recgid: _recgid_,
                qid: _qid_,
                domain: _domain_
            }
            that.setPullDownLoadTips('加载中...')
            let api = ''
            if (that.dataType === 'shipin') {
                api = 'videonewspool'
            } else {
                api = 'newspool'
            }
            _util_.makeJsonp(HOST + api, data).done(function(result) {
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
                    wsCache.set(`idxtop`, that.idxtop, {exp: 10 * 60})
                    wsCache.set(`action`, true, {exp: 10 * 60})
                    wsCache.set('startkeyArr', that.startkeyArr, {exp: 10 * 60})
                    wsCache.set('newkeyArr', that.newkeyArr, {exp: 10 * 60})
                    let i = that.curPos
                    setTimeout(function() {
                        wsCache.set(`newsModule${i}`, $swiperSlides.eq(i).html(), {exp: 10 * 60})
                    }, 400)
                }
                setTimeout(function() {
                    that.setPullDownLoadTipsAnimation('slideUp 1s ease forwards')
                }, 2000)
                that.pullDownFinished = true
            }).done(function() {
                that.requestDspUrl(3).done(function(data) {
                    that.dspData = that.changeDspDataToObj(data)
                    for (let i = 2; i >= 0; i--) {
                        if (that.dspData[i]) {
                            $(`#module${that.curPos + '_' + (that.ggIndexArr[that.curPos] - 3 + i)}`).html(that.loadDspHtml(i))
                        } else {
                            let value = $(`#module${that.curPos + '_' + (that.ggIndexArr[that.curPos] - 3 + i)}`).children().attr('id')
                            _util_.getScript(`http://tt123.eastday.com/${value}.js`, function() {
                            }, $('#' + value)[0])
                        }
                    }
                    setTimeout(function() {
                        that.reportDspInviewbackurl()
                    }, 0)
                })
            }).fail(function() {
                that.setPullDownLoadTips('网络中断,请刷新页面', 1)
                that.pullDownFinished = true
                setTimeout(function() {
                    that.setPullDownLoadTipsAnimation('slideUp 1s ease forwards')
                }, 2000)
            })
        }

        produceListHtmlForPullDown(result) {
            let data = result.data
            let html = ''
            let that = this
            let dataLength = result.data.length
            if (that.dataType === 'shipin') {
                data.forEach(function(item, i) {
                    html += `<li class="clearfix video-list">
                                    <div class="img"><a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0">
                                        <img class="lazy" src="${item.miniimg[0].src}"/>
                                        <div class="title">${item.topic}</div>
                                        <div class="icon"></div>
                                        <div class="duration">${_util_.formatDuring(item.videoalltime)}</div></a>
                                     </div>
                                    <div class="info">
                                        <div class="img"> <img src="${item.dfhheadsrc ? item.dfhheadsrc : `${config.DIRS.BUILD_FILE.images['i-logo']}`}" alt=""> </div>
                                        <div class="name">${item.dfhname ? item.dfhname : '五星体育'}</div>
                                        <div class="tag"></div>
                                    </div>
                                </li>`
                })
            } else {
                data.forEach(function(item, i) {
                    let length = item.miniimg.length// 判断缩略图的数量
                    if (length < 3 && length >= 1) {
                        html += `<li class="clearfix">
                                        <a href="${item.url}" suffix="${`ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${that.idxtop[that.curPos]}`}">
                                            <div class="img">
                                                <img src="${item.miniimg[0].src}"/>
                                            </div>
                                            <div class="info">
                                                <div class="title">${item.topic}</div>
                                                <div class="source clearfix">
                                                    ${item.iszhiding === 1 && i === 0 ? '<div class="tag-zd">置顶</div>' : ''}
                                                <div class="l">${item.source}</div>
                                                </div>
                                            </div>
                                        </a>
                                    </li>`
                    } else if (length >= 3) {
                        html += `<li class="clearfix">
                                         <a href="${item.url}" suffix="${`ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${that.idxtop[that.curPos]}`}">
                                            <div class="title">${item.topic}</div>
                                            <div class="imgs">
                                                <img src="${item.miniimg[0].src}">
                                                <img src="${item.miniimg[1].src}">
                                                <img src="${item.miniimg[2].src}">
                                            </div>
                                            <div class="source clearfix">
                                                ${item.iszhiding === 1 && i === 0 ? '<div class="tag-zd">置顶</div>' : ''}
                                                <div class="l">${item.source}</div>
                                            </div>
                                        </a>
                                    </li>`
                    }
                    that.idxtop[that.curPos]--
                    //加入广告的位置
                    if ((i + 1) % 5 === 0 && that.ggIndexArr[that.curPos] < 19) {
                        html += that.loadgg()
                    }
                    //中间赛程 排行 统计 下载模块
                    $swiperSlides.eq(that.curPos).find('.sec-news-list ul').find('.m-links').parent().remove()
                    $swiperSlides.eq(that.curPos).find('.sec-news-list ul').find('.btn-load-more').remove()
                    if (i + 1 === dataLength) {
                        html += `<li class="btn-load-more" style="padding:0;">
                                    <div class="tips">
                                        上次读到这里，<i>点击刷新</i>
                                    </div>
                                </li>`
                    }
                })
            }
            return html
        }

        loadgg() {
            let that = this
            let _newsGg_ = _AD_['indexGg'][_qid_].concat(_AD_.indexNoChannel)
            let html = ''
            html += `<li style="padding:0" class="gg clearfix bdgg-wrap" data-ggid="${_newsGg_[that.ggIndexArr[that.curPos]]}" id="module${that.curPos + '_' + that.ggIndexArr[that.curPos]}">
                     <div id="${_newsGg_[that.ggIndexArr[that.curPos]]}"></div>
                    </li>`
            that.ggIndexArr[that.curPos]++
            wsCache.set('ggIndexArr', that.ggIndexArr, {exp: 10 * 60})//保存广告的位置
            return html
        }

        requestDspUrl(num) {
            let readUrl = wsCache.get('historyUrlArr') || 'null'
            if (readUrl !== 'null') {
                readUrl = readUrl.join(',')
            }
            let data = {
                type: this.dataType,
                qid: _qid_,
                uid: _recgid_, // 用户ID
                os: _os_,
                readhistory: readUrl,
                adnum: num || 4,
                pgnum: this.pgnum[this.curPos],
                adtype: 1236,
                dspver: '1.0.1',
                softtype: 'news',
                softname: 'eastday_wapnews',
                newstype: 'ad',
                browser_type: _util_.browserType || 'null',
                pixel: _pixel_,
                fr_url: _util_.getReferrer() || 'null', //首页是来源url(document.referer)
                site: 'sport'
            }
            return _util_.makeGet(HOST_DSP_LIST, data)
        }

        changeDspDataToObj(data) {
            let obj = {}
            data.data.forEach(function(item, i) {
                obj[item.idx - 1] = item
            })
            return obj
        }

        loadDspHtml(posi) {
            let html = ''
            let item = this.dspData[posi]
            switch (item.adStyle) {
                case 'big'://大
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}"  data-dsp="hasDsp" style="display:blockheight:5.14rem">
                    <div class="title">${item.topic}</div>
                    <div class="big-img">
                        <img class="lazy" src="${item.miniimg[0].src}"/>
                    </div>
                    <div class="source clearfix">
                        <div class="tag">${item.isadv ? '广告' : '推广'}</div>
                        <div class="souce">${item.source}</div>
                    </div>
                    </a>`
                    break
                case 'one'://单
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
                    break
                case 'group'://三图
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
                    break
                case 'full'://banner
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}" data-dsp="hasDsp" style="display:blockheight:2.9rem">
                    <div class="big-img">
                        <img class="lazy" src="${item.miniimg[0].src}"/>
                    </div>
                    <div class="source clearfix">
                        <div class="tag">${item.isadv ? '广告' : '推广'}</div>
                        <div class="l">${item.source}</div>
                    </div>
                    </a>`
                    break
            }
            $body.append(`<img style="display: none" src="${item.showbackurl}"/>`)
            return html
        }

        reportDspInviewbackurl() {
            let cHeight = $(window).height()
            let offsetArr = []
            let eleArr = []
            $('a[inviewbackurl]').each(function(i, item) {
                if (cHeight > $(this).offset().top) {
                    $body.append(`<img style="display: none" src="${$(this).attr('inviewbackurl')}"/>`)
                    $(this).removeAttr('inviewbackurl')
                }
            })

            $('a[inviewbackurl]').each(function(i, item) {
                offsetArr.push($(this).offset().top)
                eleArr.push($(this))
            })

            $swiperSlides.eq(this.curPos).scroll(function() {
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
            let that = this
            $swiperSlides.eq(this.curPos).on('click', '.sec-news-list .btn-load-more', function() {
                that.setPullDownLoadTips('加载中...')
                that.setPullDownLoadTipsAnimation('slideDown 1s ease forwards')
                that.loadNewsListForPullDown()
            })
        }

        //注册页面离开事件
        unload() {
            let that = this
            $(window).unload(function() {
                wsCache.set(`scrollTop${that.curPos}`, $swiperSlides.eq(that.curPos).scrollTop(), {exp: 10 * 60})
            })
        }

        delLoadingTips() { //有数据删除loading-tips1加载图案
            $swiperSlides.eq(this.curPos).children('.loading-tips1').remove()
        }

        changeLoadingTips2(txt) { //改变下方提示框内容
            $swiperSlides.eq(this.curPos).children('.loading-tips2').html(txt)
        }

        setPullDownLoadTips(option, type = 0) {
            //let option=Object.assign({},option)
            if (type === 1) {
                $pullDownLoadTips.addClass('active')
            } else {
                $pullDownLoadTips.removeClass('active')
            }
            $pullDownLoadTips.find('.txt').html(option)
        }

        setPullDownLoadTipsAnimation(option) { //option例子  bounceInDown 0.8s ease forwards
            $pullDownLoadTips.css({
                'animation': option
            })
        }
    }

    new EastSport()
})
