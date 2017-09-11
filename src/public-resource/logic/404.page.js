import 'pages/404/style.scss'
import FastClick from 'fastclick'
import config from 'configModule'
import './log.js'
const _util_ = require('../libs/libs.util')
let {HOST} = config.API_URL
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    //定义需要传入接口的值
    let os = _util_.getOsType()
    let recgid = _util_.getUid()
    let qid = _util_.getPageQid()
    let domain = 'dfsports_h5'
    let pullUpFinished = true
    let pgnum = 1
    let $loading = `<div id="J_loading" class="loading">
                    <div class="spinner">
                        <div class="bounce1"></div>
                        <div class="bounce2"></div>
                        <div class="bounce3"></div>
                    </div>
                    <p class="txt">数据加载中</p>
                </div>`
    let $J_hn_list = $('.sec-news-list')
    $J_hn_list.after($loading)
    let $J_loading = $('#J_loading')
    loadNewsList()
    $(window).on('scroll', function() {
        let $liveboxHeight = $('body').height()
        let clientHeight = $(this).height()
        let $liveboxScrollTop = $(this).scrollTop()
        if ($liveboxScrollTop + clientHeight >= $liveboxHeight && pullUpFinished) {
            pullUpFinished = false
            loadNewsList()
        }
    })

    function loadNewsList() {
        let data = {
            pgnum: pgnum,
            os: os,
            recgid: recgid,
            qid: qid,
            domain: domain
        }
        $J_loading.show()
        return _util_.makeJsonp(HOST + 'newsforerr', data).done(function(result) {
            if (!result.length) {
                $J_hn_list.append('<li style="text-align: center">没有更多数据了..</li>')
                $J_loading.hide()
                return
            }
            $J_hn_list.append(produceListHtml(result))
            pullUpFinished = true
            pgnum++
        })
    }

    function produceListHtml(result) {
        let html = ''
        result.forEach(function(item, i) {
            let length = item.miniimg.length// 判断缩略图的数量
            if (length < 3 && length >= 1) {
                html += `<li class="clearfix">
                                    <a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0">
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
                                     <a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0">
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
        })
        return html
    }
})
