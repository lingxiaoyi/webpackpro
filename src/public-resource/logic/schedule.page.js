import 'pages/data/data_all.scss'
import 'pages/data/data_rank_basketball.scss'
import 'pages/schedule/style.scss'
import 'zepto/src/selector'
import FastClick from 'fastclick'
import config from 'configModule'
import '../libs/lib.prototype'
const _util_ = require('../libs/libs.util')
let {HOST, ORDER_API} = config.API_URL
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    // 赛程
    let $body = $('body')
    $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    $body.append(`<div id="goTop"> <div class="top"></div> <div class="back"><a href="${config.HOME_URL}"></a></div> </div>`)
    let $goTop = $('#goTop')
    let $J_loading = $('#J_loading')
    let $insideNav = $('#insideNav')
    let $content = $('.data-main .content')
    let $dateText = $('#dateText')
    $body.append(`<div class="popup" id="popup"></div>`)
    let $popup = $('#popup')
    let prevDate = new Date().format('yyyy/MM/dd') // 初始化今天时间
    let starts = new Date(prevDate).getTime()
    let oldStarts = starts
    let saishiid
    //app中隐藏面包屑
    let $crumbs = $('.crumbs')
    if (_util_.getUrlParam('redirect') === 'app') {
        $crumbs.children('a').remove()
        $crumbs.children('i').remove()
        $goTop.children('.back').remove()
    }
    formatDateText(starts)
    //默认执行 加载赛程列表
    requestMatchSchedule(starts)

    //根据日期查询
    $dateText.prev().on('click', function() {
        starts = starts - 3 * 24 * 60 * 60 * 1000
        formatDateText(starts)
        requestMatchSchedule(starts, saishiid)
    })
    $dateText.next().on('click', function() {
        starts = starts + 3 * 24 * 60 * 60 * 1000
        formatDateText(starts)
        requestMatchSchedule(starts, saishiid)
    })
    //根据分类查
    $insideNav.on('click', 'ul li a', function(e) {
        e.preventDefault()
        saishiid = $(this).attr('data-saishiid')
        $insideNav.find('ul li a').removeClass('active')
        $(this).addClass('active')
        formatDateText(oldStarts)
        starts = oldStarts
        requestMatchSchedule(oldStarts, saishiid)
    })
    let isRequested = true
    $content.on('click', '.btn-order', function() {
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
    $goTop.on('click', function() {
        $('html,body').scrollTop(0)
    })
    $(window).scroll(function() {
        if (($(this).scrollTop()) / 100 > 0.9) {
            $goTop.show()
        } else {
            $goTop.hide()
        }
    })

    //弹窗
    function popup(option) {
        let html = ``
        switch (option) {
            case 1:
                html = `<div class="content">
                                    <img src="/h5/img/getqrcode.jpg" alt=""/>
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

    //格式化日期为2017-03-13 周一
    function formatDate(starts) {
        let weekday = [
            '周日',
            '周一',
            '周二',
            '周三',
            '周四',
            '周五',
            '周六'
        ]
        let date = new Date(starts)
        return date.format('yyyy-MM-dd') + ' ' + weekday[date.getDay()]
    }

    // dateText日期格式化
    function formatDateText(starts) {
        $dateText.text(new Date(starts).format('MM-dd') + ' 至 ' + new Date(starts + 3 * 24 * 60 * 60 * 1000 - 100).format('MM-dd')).data('data-timestamp', starts)
    }

    //请求比赛赛程
    function requestMatchSchedule(starts, saishiid = '') {
        let data = {
            startts: starts,
            endts: starts + 3 * 24 * 60 * 60 * 1000,
            saishiid: saishiid,
            isimp: '1'
        }
        $content.find('ul').html('')
        $J_loading.show()
        _util_.makeJsonp(HOST + 'matchba', data).done(function(result) {
            if (!result.data.length) {
                $content.html(`<ul class="match-info"><li class="tit">暂无数据</li></ul>`)
                return
            }
            $content.html(`<ul class="match-info">${makeHtml(result)}</ul>`)
        }).always(function() {
            $J_loading.hide()
        })
    }

    function makeHtml(result) {
        let html = ''
        let data = result.data
        let oldDay = ''
        for (let item of data) {
            let title = item.title.split(' ')
            let mHtml = ''
            if (item.ismatched === -1) {
                if (_util_.isWeiXin()) {
                    mHtml = `<div class="btn-order" data-matchid="${item.matchid}"><a href="javascript:;">预约</a></div>`
                } else {
                    mHtml = `<div class="btn-living"><a href="${item.liveurl}">未开赛</a></div>`
                }
            } else if (item.ismatched === 0) {
                mHtml = `<div class="btn-living"><a href="${item.liveurl}">直播中</a></div>`
            } else {
                mHtml = `<div class="score"><div>${item.home_score}</div><span>-</span><div>${item.visit_score}</div></div>
                        <div class="btn"><a href="${item.jijin_url ? (item.liveurl + '?tab=saikuang') : item.liveurl}">集锦</a></div>
                        <div class="btn"><a href="${item.luxiang_url ? (item.liveurl + '?tab=saikuang') : item.liveurl}">回放</a></div>`
            }
            let day = item.starttime.split(' ')[0]
            if (day !== oldDay) {
                html += `<li class="tit">${formatDate(new Date(item.starttime.replace(/-/g, '/')).getTime())}</li>`
            }

            html += `<li><h6>${title[1] + ' ' + title[0]}</h6>
                        <div class="clearfix">
                           <a href="${item.ismatched === 1 ? `${item.liveurl + '?tab=saikuang'}` : item.liveurl}"> <div class="item">
                                <img src="${item.home_logoname ? item.home_logoname : config.DIRS.BUILD_FILE.images['logo_default']}" alt=""/>
                                <p>${item.home_team}</p>
                            </div>
                            <div class="m">${mHtml}</div>
                            <a href="${item.ismatched === 1 ? `${item.liveurl + '?tab=saikuang'}` : item.liveurl}"><div class="item">
                                <img src="${item.visit_logoname ? item.visit_logoname : config.DIRS.BUILD_FILE.images['logo_default']}" alt=""/>
                                <p>${item.visit_team}</p>
                            </div></a>
                        </div>
                        </li>`
            oldDay = day
        }
        return html
    }

    // insildeNav导航功能
    $insideNav.on('click', 'li a', function(e) {
        e.preventDefault()
        $(this).parent().children().removeClass('active')
        $(this).addClass('active')
        let width = $(this).parent().width()
        let index = $(this).parent().index()
        $insideNav.find('ul').scrollLeft(width * (index - 3))
    })
})
