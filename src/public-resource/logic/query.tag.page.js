import 'pages/query-tag/style.scss'
import FastClick from 'fastclick'
import config from 'configModule'
const _util_ = require('../libs/libs.util')
const _AD_ = require('../libs/ad.channel')
let {HOST} = config.API_URL
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
    let _newsGg_ = _AD_.indexGg[qid].concat(_AD_.indexNoChannel)
    let domain = 'dfsports_h5'
    let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
    let $secNewsList = $('#secNewsList')
    let $J_loading = $('#J_loading')
    let pullUpFinished = false
    let startkey = '' // 用来拉取分页
    let pgnum = 1
    let index = 0
    $('#head .tag span').text(_util_.getUrlParam('name'))
    loadNewsList(0)
    $(window).scroll(function() {
        let $liveboxHeight = $('body').height()
        let clientHeight = $(this).height()
        let $liveboxScrollTop = $(this).scrollTop()
        if ($liveboxScrollTop + clientHeight >= $liveboxHeight && pullUpFinished) {
            pullUpFinished = false
            loadNewsList(0)
        }
    })

    function loadNewsList(start) {
        let typecode//
        typecode = _util_.getUrlParam('typecode') || '900232'
        let data = {
            typecode: typecode,
            startkey: startkey,
            pgnum: pgnum,
            url: locationUrl,
            os: os,
            recgid: recgid,
            qid: qid,
            domain: domain
        }
        $J_loading.show() // 数据加载样式
        _util_.makeJsonp(HOST + 'detailnews', data).done(function(result) {
            $J_loading.hide()
            if (!result.data.length) {
                $('#noMore').remove()
                $secNewsList.children('ul').append('<li id="noMore" class="clearfix">无更多数据了</li>')
                return
            }
            startkey = result.startkey
            $secNewsList.children('ul').append(produceListHtml(result, start))
            pullUpFinished = true
        })
    }

    function produceListHtml(result, start) {
        let data = result.data
        let html = ''
        data.forEach(function(item, i) {
            let length = item.miniimg.length// 判断缩略图的数量
            if (i >= start) {
                if (length < 3 && length >= 1) {
                    html += `<li class="clearfix">
										<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0">
											<div class="img">
												<img src="${item.miniimg[0].src}" alt="${item.miniimg[0].alt}"/>
											</div>
											<div class="info">
												<div class="title">${item.topic}</div>
												<div class="source clearfix">
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
                if ((i + 1) % 5 === 0) {
                    html += `<li style="padding:0;" class="clearfix" ><div id="${_newsGg_[index]}"></div></li>`
                    _util_.getScript('http://jiaoben.eastday.com/' + _newsGg_[index] + '.js', function() {
                    }, $('#' + _newsGg_[index])[0])
                    index++
                }
            }
        })
        return html
    }
})
