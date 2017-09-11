import 'pages/liveing/style.scss'
import 'pages/report/style.scss'
import './log.js'
import FastClick from 'fastclick'
import WebStorageCache from 'web-storage-cache'
import config from 'configModule'
import wx from 'weixin-js-sdk'
import '../libs/lib.prototype'
const _util_ = require('../libs/libs.util')
const _AD_ = require('../libs/ad.channel')
let {HOST, HOST_DSP_DETAIL} = config.API_URL
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let os = _util_.getOsType()
    let recgid = _util_.getUid()
    let qid = _util_.getPageQid()
    qid = _AD_.detailList[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null
    let domain = 'dfsports_h5'
    let pixel = window.screen.width + '*' + window.screen.height
    let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
    let wsCache = new WebStorageCache()
    let $loading = $('<div id="J_loading" class="loading"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div><p class="txt">数据加载中</p></div>')
    let $article = $('.detail')
    let $secNewsList = $('#zhiboRecommend')
    let $body = $('body')
    let $headScore = $('#headScore')
    let pullUpFinished = false
    let typecode
    /* global _articleTagCodes_:true */
    typecode = _articleTagCodes_.split(',')
    function Detail(channel, tpyecode) {
        this.host = HOST
        this.channel = channel
        this.index = 4 //热点 新闻中的广告起始下标
        this.startkey = ''
        this.typecode = tpyecode.join('|')
        this.idx = 1 //热点新闻中的位置下标
        this.pgnum = 1
    }
    Detail.prototype = {
        init: function() {
            let scope = this
            scope.showHotNews()
            scope.setHistoryUrl()
            scope.queryMatchState()
            $(window).on('scroll', function() {
                let scrollTop = $(this).scrollTop()
                let bodyHeight = $('body').height() - 50
                let clientHeight = $(this).height()
                if (scrollTop + clientHeight >= bodyHeight && pullUpFinished) {
                    pullUpFinished = false
                    scope.getData(scope.startkey)
                }
            })
            //注册展开
            this.unfoldArticle()
        },
        queryMatchState: function() {
            /* global _matchId_:true */
            let data = {
                matchid: _matchId_
            }
            let that = this
            _util_.makeJsonp(HOST + 'matchinfo', data).done(function(result) {
                result = result.data
                that.headSore(result, that)//填充头部数据
            })
        },
        headSore: function(result, that) {
            let $zhiboMenu = $('#zhiboMenu')
            let redirect = _util_.getUrlParam('redirect')
            let html = ''
            // 判断参数 有data就切换到数据栏目
            let tab = _util_.getUrlParam('tab')
            /* global _page_type:true */
            if (!tab) {
                html += `<a href="${_page_type === 'zhibo' ? 'javascript:;' : (result.liveurl + '?tab=zhibo')}" class="${_page_type === 'zhibo' ? 'active' : ''}" suffix="btype=live_details&subtype=live&idx=0"><span>图文直播</span></a>`
            } else {
                html += `<a href="${_page_type === 'zhibo' ? 'javascript:;' : (result.liveurl + '?tab=zhibo')}" class="${tab === 'zhibo' ? 'active' : ''}"  suffix="btype=live_details&subtype=live&idx=0"><span>图文直播</span></a>`
            }
            html += `<a href="${_page_type === 'zhibo' ? 'javascript:;' : (result.liveurl + '?tab=saikuang')}" class="${_page_type === 'zhibo' && tab === 'saikuang' ? 'active' : ''}" suffix="btype=live_details&subtype=data&idx=0"><span>赛况</span></a>`

            html += `<a href="${_page_type === 'zhibo' ? 'javascript:;' : (result.liveurl + '?tab=shuju')}" class="${_page_type === 'zhibo' && tab === 'shuju' ? 'active' : ''}"  suffix="btype=live_details&subtype=data&idx=0"><span>数据</span></a>`
            if (!redirect) {
                html += `${result.zhanbao_url ? `<a href="${_page_type === 'zhanbao' ? 'javascript:;' : result.zhanbao_url}" suffix="btype=live_details&subtype=zhanbao&idx=0" class="${_page_type === 'zhanbao' ? 'active' : ''}"><span>战报</span></a>` : ``}`
            }
            $zhiboMenu.html(html)
            if (redirect === 'dftth5') {
                that.loadMatchNews(result.saishi_id, result.home_team + ',' + result.visit_team)
            }
            let $zhibo_body = $('.zhibo_body')
            let $zhiboDataContent = $zhibo_body.children('.zhibo-data-content')
            if (tab === 'shuju') {
                $zhiboDataContent.hide()
                $zhiboDataContent.eq(2).show()
            } else if (tab === 'saikuang') {
                $zhiboDataContent.hide()
                $zhiboDataContent.eq(1).show()
            }

            // 比分
            let $homeScore = $headScore.find('.home-score')
            let $visitScore = $headScore.find('.visit-score')
            let $headScoreP = $headScore.children('p')
            $homeScore.text(result.home_score / 1 ? result.home_score : 0)
            $visitScore.text(result.visit_score / 1 ? result.visit_score : 0)
            if (result.ismatched === '-1') {
                $headScoreP.text(result.starttime.substr(5))
            } else if (result.ismatched === '0') {
                $headScoreP.text('直播中')
            } else {
                $headScoreP.text('完赛')
            }
            $headScore.children('.title').text(result.title.split(' ')[1])
            // 对阵双方
            let $homeLeft = $headScore.prev()
            let $homeRight = $headScore.next()
            $homeLeft.find('.sub1').text(result.home_team)
            $homeLeft.find('.sub2 img').attr('src', result.home_logoname ? result.home_logoname : `${config.DIRS.BUILD_FILE.images['logo_default']}`)
            $homeRight.find('.sub1').text(result.visit_team)
            $homeRight.find('.sub2 img').attr('src', result.visit_logoname ? result.visit_logoname : `${config.DIRS.BUILD_FILE.images['logo_default']}`)
            // 下方对阵双方图标
            $('.home-team-logo').attr('src', result.home_logoname).next().text(result.home_team)
            $('.visit-team-logo').attr('src', result.visit_logoname).next().text(result.visit_team)
        },
        setHistoryUrl: function() {
            let url = window.location.href
            let urlNum = url.substring(url.lastIndexOf('/') + 1, url.indexOf('.html'))
            let historyUrlArr = []
            if (wsCache.get('historyUrlArr') && wsCache.get('historyUrlArr').length) {
                historyUrlArr = wsCache.get('historyUrlArr')
            }
            if (historyUrlArr.length >= 5) {
                historyUrlArr.shift()
            }
            historyUrlArr.push(urlNum)
            wsCache.set('historyUrlArr', historyUrlArr, {exp: 10 * 60})
        },
        showHotNews: function() {
            let scope = this
            $article.after('<section class="gg-item news-gg-img3"><div id="' + _detailsGg_[1] + '""></div></section>')
            _util_.getScript('//tt123.eastday.com/' + _detailsGg_[1] + '.js', function() {}, $('#' + _detailsGg_[1])[0])
            scope.getData(0)
            //文章下方加展开全文
            if ($article.height() >= 1100) {
                $article.after('<div class="unfold-field"  id="unfoldField"><div class="unflod-field__mask"></div><a href="javascript:void(0)" class="unfold-field__text">展开全文</a></div>')
            }
            //热点推荐部分;
            $secNewsList.before('<h3 class="name"><span>为你推荐</span></h3>')
            $secNewsList.append($loading)
        },
        getData: function(start) {
            let scope = this
            let data = {
                typecode: this.typecode,
                startkey: this.startkey,
                pgnum: this.pgnum,
                url: locationUrl,
                os: os,
                recgid: recgid,
                qid: qid,
                domain: domain
            }
            _util_.makeJsonp(scope.host + 'detailnews', data).done(function(result) {
                if (result.endkey === '') {
                    $('#noMore').remove()
                    $('#J_hn_list').append('<section id="noMore" class="clearfix">无更多数据了</section>')
                    return
                } //如果startkey没变化就结束
                scope.startkey = result.endkey
                $secNewsList.append(scope.productHtml(result, start))
                pullUpFinished = true
                scope.pgnum++
            }).done(function() {
                scope.requestDspUrl(3, 1).done(function(data) {
                    let dspData = scope.changeDspDataToObj(data)
                    for (let i = 2; i >= 0; i--) {
                        if (data.data.length && dspData[i]) {
                            $(`#ggModule${scope.index - 4 - 3 + i}`).html(scope.loadDspHtml(dspData, i, ''))
                        } else {
                            let ggid = $(`#ggModule${scope.index - 4 - 3 + i}`).children().attr('id')
                            _util_.getScript('//tt123.eastday.com/' + ggid + '.js', function() {
                            }, $('#' + ggid)[0])
                        }
                    }
                    scope.reportDspInviewbackurl()
                })
            })
        },
        productHtml: function(result) {
            let data = result.data
            let html = ''
            let scope = this
            data.forEach(function(item, i) {
                let ggid = _detailsGg_[scope.index]
                let length = item.miniimg.length
                if (length < 3 && length >= 1) {
                    html += `<li class="clearfix">
										<a href="${item.url}" suffix="btype=live_details&subtype=zhanbao_recNews&idx=${scope.idx}">
											<div class="img">
												<img src="${item.miniimg[0].src}" alt="${item.miniimg[0].alt}"/>
											</div>
											<div class="right">
												<p class="tit">${item.topic}</p>
											</div>
										</a>
									</li>`
                } else if (length >= 3) {
                    html += `<li class="clearfix">
										 <a href="${item.url}" suffix="btype=live_details&subtype=zhanbao_recNews&idx=${scope.idx}">
											<div class="tit">${item.topic}</div>
											<div class="imgs">
												<img src="${item.miniimg[0].src}" alt="">
												<img src="${item.miniimg[1].src}" alt="">
												<img src="${item.miniimg[2].src}" alt="">
											</div>
											<div class="source clearfix">
												<div class="l">${item.source}</div>
											</div>
										</a>
									</li>`
                }
                // 广告位置
                if (i === 1 || i === 3 || i === 6) {
                    html += `<li style="padding:0;" id="ggModule${scope.index - 4}" class="clearfix" ><div id="${ggid}"></div></li>`
                    scope.index++
                }
                scope.idx++
            })
            return html
        },
        requestDspUrl: function(adnum, pgnum) {
            let readUrl = wsCache.get('historyUrlArr') || 'null'
            if (readUrl !== 'null') {
                readUrl = readUrl.join(',')
            }
            /* global _sportsType_:true */
            let data = {
                type: _sportsType_,
                qid: qid,
                uid: recgid, // 用户ID
                os: os,
                readhistory: readUrl,
                adnum: adnum,
                pgnum: this.pgnum,
                adtype: 236,
                dspver: '1.0.1',
                softtype: 'news',
                softname: 'eastday_wapnews',
                newstype: 'ad',
                browser_type: _util_.browserType || 'null',
                pixel: pixel,
                fr_url: _util_.getReferrer() || 'null',	 // 首页是来源url(document.referer)
                site: 'sport'

            }
            return _util_.makeGet(HOST_DSP_DETAIL, data)
        },
        changeDspDataToObj: function(data) {
            let obj = {}
            data.data.forEach(function(item, i) {
                obj[item.idx - 1] = item
            })
            return obj
        },
        loadDspHtml: function(dspData, posi, type) {
            let html = ''
            let item = dspData[posi]
            switch (item.adStyle) {
                case 'big':
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
                    break
                case 'one':
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
                case 'group':
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
                case 'full':
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}" data-dsp="hasDsp" style="display:block;height:2.9rem;">
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
        },
        reportDspInviewbackurl: function() {
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

            $(window).scroll(function() {
                offsetArr.forEach((item, index) => {
                    if (cHeight + $(this).scrollTop() > item) {
                        if (eleArr[index].attr('inviewbackurl')) {
                            $body.append(`<img style="display: none" src="${eleArr[index].attr('inviewbackurl')}"/>`)
                            eleArr[index].removeAttr('inviewbackurl')
                        }
                    }
                })
            })
        }, //展开文章
        unfoldArticle() {
            $body.on('click', '.unfold-field', function() {
                $article.css({'max-height': '100%'})
                $(this).hide()
            })
        }
    }
    let en = new Detail(qid, typecode)
    let _detailsGg_ = _AD_.detailList[qid].concat(_AD_.detailNoChannel)
    en.init()
    //头条种隐藏录像集锦
    ;(() => {
        if (_util_.getUrlParam('redirect') === 'app') {
            $('.crumbs').hide()
            $('#goTop').children('.back').hide()
            $headScore.next().next().attr('href', `downloadapp.html?qid=dfttapp`)
        }
    })()
    ;(function shareWebPage() {
        $.ajax({
            type: 'get',
            url: 'http://xwzc.eastday.com/wx_share/share_check.php',
            data: {
                url: window.location.href
            },
            dataType: 'jsonp',
            jsonp: 'wxkeycallback', //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: 'wxkeycallback',
            success: function(result) {
                wx.config({
                    debug: false, //这里是开启测试，如果设置为true，则打开每个步骤，都会有提示，是否成功或者失败
                    appId: result.appId,
                    timestamp: result.timestamp, //这个一定要与上面的php代码里的一样。
                    nonceStr: result.nonceStr, //这个一定要与上面的php代码里的一样。
                    signature: result.signature, //签名
                    jsApiList: [
                        // 所有要调用的 API 都要加到这个列表中
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage'
                    ]
                })
                wx.ready(function() {
                    // 分享给朋友
                    let imgSrc = $('#content img').eq(0).attr('src')
                    if (imgSrc.indexOf('http') === -1) {
                        imgSrc = 'http:' + imgSrc
                    }
                    wx.onMenuShareAppMessage({
                        title: $('h1.title').text() + '_东方体育', // 分享标题
                        desc: $('#content p.txt').text(), // 分享描述
                        link: window.location.href, // 分享链接
                        imgUrl: imgSrc, // 分享图标
                        success: function() {},
                        cancel: function() {}
                    })
                    wx.onMenuShareTimeline({
                        title: $('h1.title').text() + '_东方体育', // 分享标题
                        link: window.location.href, // 分享链接
                        imgUrl: imgSrc, // 分享图标
                        success: function() {
                        },
                        cancel: function() {

                        }
                    })
                })
            },
            error: function() {

            }
        })
    })()
})
