import 'pages/liveing/style.scss'
import FastClick from 'fastclick'
import config from 'configModule'
import wx from 'weixin-js-sdk'
import '../libs/lib.prototype'
const _util_ = require('../libs/libs.util')
//const _AD_ = require('../libs/ad.channel')
let {HOST, HOST_LIVE} = config.API_URL
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let J_loading = $('<div id="J_loading" class="loading">' + '<div class="spinner">' + '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>' + '</div>' + '<p class="txt">数据加载中</p>' + '</div>')
    let $playerSta = $('#playerSta')
    let $teamStats = $('#teamStats')
    let $headScore = $('#headScore')
    let $matchNews = $('#matchNews')
    function Loading(_match_id, pageType) {
        this.matchId = _match_id
        this.pageType = pageType // 页面类型 zhibo zhanbao
        this.ismatched = ''//比赛状态
        this.pullWenziNum = 20 // 一次加载20条文字数据,可定义
        this.wenziMaxNum = 0 // 保存当前文字条数的最大记录,并与新请求的数字对比
        this.wenziLastNum = 0 // 文字下拉加载当前定位的文字id
        this.flag = true // 用来防止文字下拉加载重复
        this.init()
    }

    Loading.prototype = {
        // 微信分享配置:
        sharePage: function(imgSrc, title, desc) {
            if (desc.length >= 60) {
                desc = desc.slice(0, 60)
                desc += '...'
            }
            title += '_东方体育'
            $.ajax({
                type: 'get',
                url: 'http://xwzc.eastday.com/wx_share/share_check.php',
                data: {
                    url: window.location.href
                },
                dataType: 'jsonp',
                jsonp: 'wxkeycallback', // 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                jsonpCallback: 'wxkeycallback',
                success: function(result) {
                    wx.config({
                        debug: false, // 这里是开启测试，如果设置为true，则打开每个步骤，都会有提示，是否成功或者失败
                        appId: result.appId,
                        timestamp: result.timestamp, // 这个一定要与上面的php代码里的一样。
                        nonceStr: result.nonceStr, // 这个一定要与上面的php代码里的一样。
                        signature: result.signature, // 签名
                        jsApiList: [
                            // 所有要调用的 API 都要加到这个列表中
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage'
                        ]
                    })
                    wx.ready(function() {
                        // 分享给朋友
                        wx.onMenuShareAppMessage({
                            title: title, // 分享标题
                            desc: desc, // 分享描述
                            link: window.location.href, // 分享链接
                            imgUrl: imgSrc, // 分享图标
                            success: function() {
                            },
                            cancel: function() {
                            }
                        })
                        wx.onMenuShareTimeline({
                            title: title, // 分享标题
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
        }, // 集锦录像
        makeAjaxJijin: function(_rowkey_) {
            return $.ajax({
                url: HOST + 'subject?topicid=' + _rowkey_,
                dataType: 'jsonp',
                success: function() {}
            })
        }, //根据比赛开始状态去判断执行
        queryMatchState: function() {
            let data = {
                matchid: this.matchId
            }
            let that = this
            _util_.makeJsonp(HOST + 'matchinfo', data).done(function(result) {
                result = result.data
                that.template.score(result, that)//填充头部数据
                that.ismatched = result.ismatched
                if (that.pageType !== 'zhibo') {
                    return
                } // 直播页面类型 不是直播就结束
                if (result.ismatched === '-1') { // 加载比赛前的
                    that.loadWenziNum() // 加载文字直播
                    that.loadDetailDate(result)
                } else if (result.ismatched === '0') { // 加载比赛中的
                    that.loadWenziNum() // 加载文字直播
                    setInterval(function() { // 5秒钟更新一次
                        that.loadWenziNum() // 加载文字直播
                    }, 3000)
                    that.loadDetailDate(result)// 加载统计数据
                    setInterval(function() {
                        that.loadDetailDate(result)
                    }, 60000)
                } else if (result.ismatched === '1') { // 加载比赛后的
                    that.loadWenziNum() // 加载文字直播
                    that.loadDetailDate(result)// 加载统计数据
                }
            })
        }, // 加载文字数量
        loadWenziNum: function() {
            let data = {
                matchid: this.matchId
            }
            let that = this
            _util_.makeJsonp(HOST_LIVE + 'matchwenzinum', data).done(function(result) {
                let data = result.data / 1 // 转化字符串为数字
                if (!data) {
                    // 显示暂无直播提示
                    $livebox.html(`<li>
                                        <div class="t">
                                            <div class="circle red"></div>
                                        </div>
                                        <div class="text-box">
                                            <p>暂无数据</p>
                                        </div>
                                    </li>`)
                    return
                }
                if (!that.wenziMaxNum) {
                    that.wenziMaxNum = data
                    // 先加载固定20条
                    if (data % 2 !== 0) {
                        that.loadAssignWenzi(data + 1, data + 1)
                    } else {
                        that.loadAssignWenzi(data, data)
                    }
                }

                if (data > that.wenziMaxNum) { // 文字数字大于最大值就加入新值
                    that.loadWenzi(that.wenziMaxNum, data / 1, that.wenziMaxNum)
                }
            })
        }, // 一次加载20条文字直播
        loadAssignWenzi: function(start, old) {
            let data = {
                matchid: this.matchId,
                start: start
            }
            let that = this
            if (start <= (old - this.pullWenziNum) || start <= 0) {
                that.flag = true
                that.wenziLastNum = start
                J_loading.hide()
                return
            }
            _util_.makeJsonp(HOST_LIVE + 'matchwenzi', data).done(function(result) {
                that.template.textMessage(result, 1) // 1代表插文字到下方,0代表上方
                that.loadAssignWenzi(start - 2, old)
            })
        }, // 加载文字直播 注:minOld拉取文字直播最小值 小于这个数字的不需要记载
        loadWenzi: function(min, max, minOld) {
            min = min / 1 // 字符串转数字
            if (min % 2 !== 0) {
                min++
            } else {
                min += 2
            }
            let data = {
                matchid: this.matchId,
                start: min
            }
            let that = this
            if (min - 2 >= max) {
                return
            }
            _util_.makeJsonp(HOST_LIVE + 'matchwenzi', data).done(function(result) {
                that.template.textMessage(result, 0, minOld)
                that.loadWenzi(min, max, minOld)
            })
        },
        onTextScroll: function() {
            let that = this
            $(window).scroll(function() {
                let $liveboxHeight = $('body').height()
                let $liveboxScrollTop = $(this).scrollTop()
                let clientHeight = $(this).height()
                if ($liveboxScrollTop + clientHeight >= ($liveboxHeight - 50) && that.flag) { // 距离底端80px是加载内容
                    that.flag = false
                    J_loading.show()
                    that.loadAssignWenzi(that.wenziLastNum, that.wenziLastNum)
                }
            })
        },
        loadDetailDate: function(data) { // 加载实时详细统计数据
            let that = this
            let type // 是篮球还是足球 其他
            type = data.tplv001
            updateStatistics(type)

            // 统计数据
            function updateStatistics(type) {
                let data = {
                    matchid: that.matchId
                }
                _util_.makeJsonp(HOST + 'matchdata', data).done(function(data) { // 填充一次数据
                    if (isEmptyObject(data.data)) {
                        return
                    }
                    if (type === '足球') {
                        // console.log(data);
                        that.template.football.paixu(data.data)
                        that.template.football.matchIng(data.data)
                    } else if (type === '篮球') {
                        that.template.nba.score_period(data.data)
                        that.template.nba.player(data.data)
                        // that.template.nba.score_rank(data.data); //各项最高 H5暂无
                        that.template.nba.stats_team(data.data)
                        // 篮球类型显示球员统计
                        $playerSta.show()
                    } else {}
                }).done(function(data) {
                    // 填充一次historyData recentRecord futureSchedule
                    that.template.loadOnceDate(data)
                    if (_page_type === 'zhanbao') {
                        that.sharePage($('.zhibo-main').eq(4).find('img').attr('src'), $('title').text(), $('.zhibo-main .detail p').text())
                    } else {
                        let imgSrc = $('.zhibo_head img').eq(0).attr('src')
                        let title = '正在直播:' + $('.zhibo_head .top .left .sub1').text() + ' VS ' + $('.zhibo_head .top .right .sub1').text() + ',点击观看'
                        let desc = '快来看我们分享给你的网站:' + title
                        that.sharePage(imgSrc, title, desc)
                    }
                })
            }

            function isEmptyObject(e) {
                let t
                for (t in e) return !1
                return !0
            }
        }, // 字符串模板
        template: {
            videoList: function(data) {
                let str = ''
                let btype = _page_type + '_detail'
                for (let i = 0; i < data.length; i++) {
                    str += '<li>'
                    str += '<a href="' + data[i].url + '" suffix="btype=' + btype + '&subtype=video&idx=0">'
                    str += '<div class="img">'
                    str += '<img src="' + data[i].miniimg[0].src + '"><span class="play"></span>'
                    str += '</div>'
                    str += '<div class="right">'
                    str += '<p class="tit">' + data[i].topic + '</p>'
                    str += '<span class="time">' + data[i].date.substring(5) + '&nbsp;&nbsp;&nbsp;&nbsp;' + data[i].tplv002 + '</span>'
                    str += '</div>'
                    str += '</a>'
                    str += '</li>'
                }
                return str
            },
            football: {
                paixu: function(self) {
                    let data = self.data_compare.data
                    if (!data) {
                        // 没有数据 隐藏球队统计
                        $teamStats.hide()
                        $teamStats.prev().hide()
                        return
                    } else {
                        $teamStats.show()
                        $teamStats.prev().show()
                    }
                    let home = self.host_team
                    let home_data
                    let visit_data
                    for (let k in data) {
                        if (data[k].team_name === home) {
                            home_data = data[k]
                        } else {
                            visit_data = data[k]
                        }
                    }
                    let typeName = {
                        '射门': 'total_scoring_att',
                        '射正': 'ontarget_scoring_att',
                        '射中门框': 'post_scoring_att',
                        '直塞': 'total_through_ball',
                        '犯规': 'fk_foul_lost',
                        '角球': 'won_corners',
                        '越位': 'total_offside',
                        '控球率': 'possession_percentage',
                        '传球': 'total_pass',
                        '抢断': 'total_tackle',
                        '任意球': 'fk_foul_won',
                        '传球成功率': 'pass_percentage',
                        '传中成功率': 'cross_percentage',
                        '抢断成功率': 'tackle_percentage',
                        '头球成功率': 'aerial_percentage'
                    }
                    let $teamStatsContentTeam = $teamStats.find('.content-team')
                    $teamStatsContentTeam.children().each(function(index) {
                        if (index !== 0) {
                            $(this).remove()
                        }
                    })
                    for (let q in typeName) {
                        if (typeof home_data[typeName[q]] === 'undefined' || home_data[typeName[q]] == null) {
                            continue
                        }
                        let max = home_data[typeName[q]] / 1 + visit_data[typeName[q]] / 1
                        if (home_data[typeName[q]] === 0 && visit_data[typeName[q]] === 0) {
                            max = 1
                        }
                        if (('' + home_data[typeName[q]]).indexOf('%') >= 0) {
                            $teamStatsContentTeam.append('<div class="row"><div class="num">' + (home_data[typeName[q]] ? home_data[typeName[q]] : '-') + '</div>' + ' <div class="m">' + '<div class="line ' + (home_data[typeName[q]].replace('%', '') / 1 > visit_data[typeName[q]].replace('%', '') / 1 ? 's' : 'l') + '"><span style="width:' + home_data[typeName[q]] + '"></span></div>' + '<div class="text">' + q + '</div>' + ' <div class="line ' + (home_data[typeName[q]].replace('%', '') / 1 > visit_data[typeName[q]].replace('%', '') / 1 ? 'l' : 's') + '"><span style="width:' + visit_data[typeName[q]] + '"></span></div>' + ' </div>' + '<div class="num">' + (visit_data[typeName[q]] ? visit_data[typeName[q]] : '-') + '</div></div>')
                        } else {
                            $teamStatsContentTeam.append('<div class="row"><div class="num">' + (home_data[typeName[q]] ? home_data[typeName[q]] : '-') + '</div>' + ' <div class="m">' + '<div class="line ' + (home_data[typeName[q]] / 1 > visit_data[typeName[q]] / 1 ? 's' : 'l') + '"><span style="width:' + home_data[typeName[q]] / max * 100 + '%' + '"></span></div>' + '<div class="text">' + q + '</div>' + ' <div class="line ' + (home_data[typeName[q]] / 1 > visit_data[typeName[q]] / 1 ? 'l' : 's') + '"><span style="width:' + visit_data[typeName[q]] / max * 100 + '%' + '"></span></div>' + ' </div>' + '<div class="num">' + (visit_data[typeName[q]] ? visit_data[typeName[q]] : '-') + '</div></div>')
                        }
                    }
                }, // 比赛过程 足球图谱 实时更新
                matchIng: function(self) {
                    let home = self.host_team // 主队
                    let visit = self.visit_team // 客队
                    let data = self.match_process.data
                    let $matchResult = $('#matchResult')
                    $matchResult.find('.foot-saikuang .head-team p').eq(0).text('(主) ' + home)
                    $matchResult.find('.foot-saikuang .head-team p').eq(1).text('(客) ' + visit)
                    if (!data) {
                        // 没有数据隐藏赛况
                        $matchResult.hide()
                        $matchResult.prev().hide()
                        return
                    } else {
                        $matchResult.show()
                        $matchResult.prev().show()
                    }
                    let even_code = {
                        '1': 'i-jinqiu', // 进球
                        '2': 'i-jinqiu', // 乌龙球
                        '3': 'i-huangpai', // 黄牌
                        '4': 'i-hongpai', // 两黄牌下  红牌
                        '5': 'i-hongpai', // 红牌
                        '6': 'i-dianqiu', // 点球
                        '7': 'i-pujiu',
                        '8': 'i-pujiu',
                        '9': 'i-pujiu',
                        '10': 'i-pujiu',
                        '11': 'i-pujiu',
                        '12': 'i-pujiu',
                        '13': 'i-shepian', // 射偏
                        '_13': 'i-shepian', // 射偏
                        '14': 'i-huanxia', // 换下
                        '_14': 'i-menkuang', // 击中门框
                        '15': 'i-huanshang', // 换上
                        '_15': 'i-shepian', // 射门被扑 被别人挡出
                        '16': 'i-huanxia', // 受伤下
                        '17': 'i-pujiu',
                        '18': 'i-pujiu',
                        '19': 'i-pujiu',
                        'diy_20': 'i-zhugong' // 助攻
                    }
                    let Showdata = []
                    for (let i = 0; i < data.length; i++) {
                        if (!Showdata.length || Showdata[Showdata.length - 1].time !== data[i].time) {
                            Showdata.push({
                                time: data[i].time,
                                home: {
                                    event_code: [],
                                    Info: [],
                                    event_code_cn: []
                                },
                                visit: {
                                    event_code: [],
                                    Info: [],
                                    event_code_cn: []
                                },
                                all: {
                                    event_code: [],
                                    Info: [],
                                    event_code_cn: []
                                }
                            })
                        }
                        if (data[i].team_name === home) {
                            let nowobj = Showdata[Showdata.length - 1].home
                            nowobj.event_code_cn.push(data[i].event_code_cn)
                            nowobj.event_code.push(data[i].event_code)
                            nowobj.Info.push(data[i].Info)
                        } else if (data[i].team_name === visit) {
                            let nowobj = Showdata[Showdata.length - 1].visit
                            nowobj.event_code_cn.push(data[i].event_code_cn)
                            nowobj.event_code.push(data[i].event_code)
                            nowobj.Info.push(data[i].Info)
                        } else {
                            let nowobj = Showdata[Showdata.length - 1].all
                            nowobj.event_code_cn.push(data[i].event_code_cn)
                            nowobj.event_code.push(data[i].event_code)
                            nowobj.Info.push(data[i].Info)
                        }
                    }
                    // console.log(Showdata);
                    let $timeLine = $('#matchResult .time-line')
                    let html = ''
                    $timeLine.html('') // 清空时间轴的内容
                    // 开始比赛的
                    html += '<div class="time-box">'
                    html += '<div class="time">0′</div>'
                    html += '<div class="rows">'
                    html += '<div class="row"> <div class="text">比赛开始</div> <div class="i-start icon"></div></div>'
                    html += ' </div>'
                    html += ' </div>'
                    for (let i = 0; i < Showdata.length; i++) {
                        let info
                        let length
                        // 主队的数据
                        info = Showdata[i].home.Info
                        length = Showdata[i].home.Info.length
                        // console.log(Showdata[i]);
                        if (length) {
                            html += ' <div class="time-box" style="margin-bottom:' + (0.3 + (length - 1) * 0.5) + 'rem' + '">'
                            html += '<div class="time">' + Showdata[i].time + '</div>'
                            html += '<div class="rows">'
                            for (let j = 0; j < length; j++) {
                                html += '<div class="row"> <div class="text">' + info[j] + (Showdata[i].home.event_code_cn[j] === '点球' ? '(点球)' : '') + '</div> <div class="icon  ' + even_code[Showdata[i].home.event_code[j]] + '"></div></div>'
                            }
                            html += '</div></div>'
                        }
                        // 客队的数据
                        info = Showdata[i].visit.Info
                        length = Showdata[i].visit.Info.length
                        if (length) {
                            html += ' <div class="time-box" style="margin-bottom:' + (0.3 + (length - 1) * 0.5) + 'rem' + '">'
                            html += '<div class="time">' + Showdata[i].time + '</div>'
                            html += '<div class="rows right">'
                            for (let j = 0; j < length; j++) {
                                html += '<div class="row"> <div class="icon  ' + even_code[Showdata[i].visit.event_code[j]] + '"></div><div class="text">' + info[j] + (Showdata[i].visit.event_code_cn[j] === '点球' ? '(点球)' : '') + '</div> </div>'
                            }
                            html += '</div></div>'
                        }
                    }
                    // 结束比赛的标志
                    html += '<div class="time-box">'
                    html += '<div class="time">end</div>'
                    html += '<div class="rows">'
                    html += '<div class="row"> <div class="text">比赛结束</div> <div class="i-end icon"></div></div>'
                    html += ' </div>'
                    html += ' </div>'
                    $timeLine.html(html)
                }
            },
            nba: {
                // 每节比分统计
                score_period: function(self) {
                    let data = self.score_period
                    let $matchResult = $('#matchResult')
                    if (!data) {
                        // 没有数据隐藏比分
                        $matchResult.hide()
                        $matchResult.prev().hide() // 灰色隔断
                        return
                    } else {
                        $matchResult.show()
                        $matchResult.prev().show()
                    }
                    let length = 0
                    let html = '<tbody>' + '<tr>' + '<th>球队</th>' + '<th>第一节</th>' + '<th>第二节</th>' + '<th>第三节</th>' + '<th>第四节</th>'
                    data.team1_scores.forEach(function(item) {
                        if (item === 0) {
                            length++
                        }
                    })
                    length = 4 - length // 原始4个零-数据得到的0
                    for (let i = 0; i < length; i++) {
                        html += '<th>加时赛</th>'
                    }
                    html += '<th>总分</th></tr>'
                    html += '<tr>' + '<td class="home_team_name">' + data.home_team + '</td>' + '<td>' + data.team1_scores[0] + '</td>' + '<td>' + data.team1_scores[1] + '</td>' + '<td>' + data.team1_scores[2] + '</td>' + '<td>' + data.team1_scores[3] + '</td>'
                    for (let i = 0; i < length; i++) {
                        html += '<td>' + data.team1_scores[i + 4] + '</td>'
                    }
                    html += '<td>' + data.home_score + '</td></tr>'
                    html += '<tr>' + '<td class="visit_team_name">' + data.visit_team + '</td>' + '<td>' + data.team2_scores[0] + '</td>' + '<td>' + data.team2_scores[1] + '</td>' + '<td>' + data.team2_scores[2] + '</td>' + '<td>' + data.team2_scores[3] + '</td>'
                    for (let i = 0; i < length; i++) {
                        html += '<td>' + data.team2_scores[i + 4] + '</td>'
                    }
                    html += '<td>' + data.visit_score + '</td></tr></tbody>'
                    $matchResult.children('table').html(html)
                }, // 球员统计
                player: function(self) {
                    if (!self.player) {
                        return
                    }
                    let data = self.player.data
                    let host = data.host // 主队球员
                    let guest = data.guest // 客队球员
                    if (!data) {
                        // 没有数据隐藏球员统计
                        $playerSta.hide()
                        $playerSta.prev().hide()
                        return
                    } else {
                        $playerSta.show()
                        $playerSta.prev().show()
                    }
                    this.teamPlayer(host, $playerSta.find('.host'))
                    this.teamPlayer(guest, $playerSta.find('.visit'))
                },
                teamPlayer: function(data, ele) {
                    // 清空表格内容
                    ele.find('.player').find('tr').each(function(index) {
                        if (index !== 0) {
                            $(this).remove()
                        }
                    })
                    ele.find('.player-data table').find('tr').each(function(index) {
                        if (index !== 0) {
                            $(this).remove()
                        }
                    })
                    let plays = data.on
                    let played = data.off
                    // 在场
                    for (let i = 0; i < plays.length; i++) {
                        this.playone(ele, plays[i], true)
                    }
                    // 休息
                    for (let i = 0; i < plays.length; i++) {
                        if (!played) {
                            continue
                        }
                        this.playone(ele, played[i], 0)
                    }
                },
                playone: function(ele, data, type) {
                    if (!data) {
                        return
                    }
                    ele.find('.player').append('<tr><td style=" ">' + data.player_name_cn + '</td></tr>')
                    ele.find('.player-data table').append('<tr>' + '</td>' + '<td>' + data.pos + '</td>' + '<td>' + data.minutes + '</td>' + '<td>' + data.field + '</td>' + '<td>' + data.three + '</td>' + '<td>' + data.free + '</td>' + '<td>' + data.off + '</td>' + '<td>' + data.def + '</td>' + '<td>' + data['off+def'] + '</td>' + '<td>' + data.ass + '</td>' + '<td>' + data.ste + '</td>' + '<td>' + data.blo + '</td>' + '<td>' + data.turn + '</td>' + '<td>' + data.fouls + '</td>' + '<td>' + data.plusMinus + '</td>' + '<td>' + data.points + '</td>' + '</tr>')
                }, // 各项最高 H5暂无
                score_rank: function(self) {
                    //console.log(self)
                    let data = self.score_rank.data
                    let guest = data.guest
                    let host = data.host
                    let table = $('#mdata .paixu  table tbody').eq(0)
                    let lines = table.find('tr')
                    table.find('.trtit').html('<td>各项最高</td>' + '<td>' + host.team_info.team_name + '</td>' + '<td></td>' + '<td>' + guest.team_info.team_name + '</td>' + '<td></td>')
                    for (let i = 1; i < lines.length; i++) {
                        let datatype = lines.eq(i).attr('datatype')
                        lines.eq(i).html('<td>' + host[datatype].name + '</td>' + '<td><a href= target="_blank">' + host[datatype].player_name + '</a></td>' + '<td>' + host[datatype].points + '</td>' + '<td><a href="javascript:void(0)" target="_blank">' + guest[datatype].player_name + '</a></td>' + '<td>' + guest[datatype].points + '</td>')
                    }
                }, // 球队统计
                stats_team: function(self) {
                    if (!self.stats_team) {
                        return
                    }
                    let data = self.stats_team.data
                    let html = ''
                    let home_data
                    let visit_data
                    home_data = data.host
                    visit_data = data.guest
                    if (!data) {
                        // 无数据 隐藏球队统计
                        $teamStats.hide()
                        $teamStats.prev().hide()
                        return
                    } else {
                        $teamStats.show()
                        $teamStats.prev().show()
                    }
                    let typeName = {
                        '投篮命中率': 'field_rate',
                        '得分/篮板': 'score_board',
                        '三分命中率': 'three_rate',
                        '罚球命中率': 'free_rate', /* '快攻/内线得分': 'fp_points', */
                        /* '技术/恶意犯规': 'fouls',
                         '六犯/被逐出场': 'diq_ejt', */
                        '最大领先分': 'biggest',
                        '得分': 'score',
                        '篮板': 'board'
                    }

                    let $teamStatsContentTeam = $teamStats.find('.content-team')
                    $teamStatsContentTeam.children().each(function(index) {
                        if (index !== 0) {
                            $(this).remove()
                        }
                    })
                    // 整理数据
                    for (let q in typeName) {
                        if (q === '得分/篮板') {
                            home_data.score = {}
                            visit_data.score = {}
                            home_data.board = {}
                            visit_data.board = {}
                            home_data.score.points = home_data[typeName[q]].points.split('/')[0]
                            visit_data.score.points = visit_data[typeName[q]].points.split('/')[0]
                            home_data.board.points = home_data[typeName[q]].points.split('/')[1]
                            visit_data.board.points = visit_data[typeName[q]].points.split('/')[1]
                        }
                    }
                    // 输出数据
                    for (let q in typeName) {
                        if (typeof home_data[typeName[q]] === 'undefined' || q === '得分/篮板') {
                            continue
                        }
                        let max = home_data[typeName[q]].points / 1 + visit_data[typeName[q]].points / 1
                        if (home_data[typeName[q]].points === 0 && visit_data[typeName[q]].points === 0) {
                            max = 1
                        }
                        if (('' + home_data[typeName[q]].points).indexOf('%') >= 0) {
                            $teamStatsContentTeam.append('<div class="row"><div class="num">' + home_data[typeName[q]].points + '</div>' + ' <div class="m">' + '<div class="line ' + (home_data[typeName[q]].points.replace('%', '') / 1 > visit_data[typeName[q]].points.replace('%', '') / 1 ? 's' : 'l') + '"><span style="width:' + home_data[typeName[q]].points + '"></span></div>' + '<div class="text">' + q + '</div>' + ' <div class="line ' + (home_data[typeName[q]].points.replace('%', '') / 1 > visit_data[typeName[q]].points.replace('%', '') / 1 ? 'l' : 's') + '"><span style="width:' + visit_data[typeName[q]].points + '"></span></div>' + ' </div>' + '<div class="num">' + visit_data[typeName[q]].points + '</div></div>')
                        } else {
                            $teamStatsContentTeam.append('<div class="row"><div class="num">' + home_data[typeName[q]].points + '</div>' + ' <div class="m">' + '<div class="line ' + (home_data[typeName[q]].points / 1 > visit_data[typeName[q]].points / 1 ? 's' : 'l') + '"><span style="width:' + home_data[typeName[q]].points / max * 100 + '%' + '"></span></div>' + '<div class="text">' + q + '</div>' + ' <div class="line ' + (home_data[typeName[q]].points / 1 > visit_data[typeName[q]].points / 1 ? 'l' : 's') + '"><span style="width:' + visit_data[typeName[q]].points / max * 100 + '%' + '"></span></div>' + ' </div>' + '<div class="num">' + visit_data[typeName[q]].points + '</div></div>')
                        }
                    }
                    $teamStats.find('.content-team').append(html)
                }
            }, // 比赛双方信息图标队伍 比赛时间
            score: function(result, that) {
                let $zhiboMenu = $('#zhiboMenu')
                let redirect = _util_.getUrlParam('redirect')
                let html = ''
                // 判断参数 有data就切换到数据栏目
                let tab = _util_.getUrlParam('tab')
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
                } else if (redirect === 'app') {

                } else {
                    that.loadJijin(result.jijintopicid, result.luxiangtopicid)
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
            }, // 交锋历史 最近战绩 未来赛程 只加载一次
            loadOnceDate: function(data) {
                let $historyData = $('#historyData')
                let $recentRecord = $('#recentRecord')
                let $futureSchedule = $('#futureSchedule')
                if (!data.data.match_history) {
                    return false
                }
                let match_history = data.data.match_history[0]
                let lately_score = data.data.lately_score
                let nextschedule_host = data.data.nextschedule_host
                let nextschedule_visit = data.data.nextschedule_visit
                let html = '<tr> <th>日期</th> <th>赛事</th> <th>主队</th> <th>比分</th> <th>客队</th> </tr>'
                // 交锋历史
                match_history.forEach(function(item) {
                    html += '<tr>'
                    html += '<td>' + item.data + '</td>'
                    html += '<td>' + item.game + '</td>'
                    html += '<td>' + item.home_team + '</td>'
                    html += '<td>' + item.score + '</td>'
                    html += '<td>' + item.visit_team + '</td>'
                    html += '</tr>'
                })
                $historyData.children('table').html(html)
                // 最近战绩
                // 主队的
                html = '<tr> <th>日期</th> <th>赛事</th> <th>主队</th> <th>比分</th> <th>客队</th> </tr>'
                lately_score[0].forEach(function(item) {
                    html += '<tr>'
                    html += '<td>' + item.data + '</td>'
                    html += '<td>' + item.saishi + '</td>'
                    html += '<td>' + item.home_team + '</td>'
                    html += '<td>' + item.score + '</td>'
                    html += '<td>' + item.visit_team + '</td>'
                    html += '</tr>'
                })
                // 客队的
                $recentRecord.children('.home-team').find('table').html(html)
                html = '<tr> <th>日期</th> <th>赛事</th> <th>主队</th> <th>比分</th> <th>客队</th> </tr>'
                lately_score[1].forEach(function(item) {
                    html += '<tr>'
                    html += '<td>' + item.data + '</td>'
                    html += '<td>' + item.saishi + '</td>'
                    html += '<td>' + item.home_team + '</td>'
                    html += '<td>' + item.score + '</td>'
                    html += '<td>' + item.visit_team + '</td>'
                    html += '</tr>'
                })
                $recentRecord.children('.visit-team').find('table').html(html)
                // 战绩计算
                html = ''
                $recentRecord.children('.content-team').find('.row').each(function(index) {
                    if (index !== 0) {
                        $(this).remove()
                    }
                })
                lately_score[2].forEach(function(item, i) {
                    let max = item[1] / 1 + item[4] / 1
                    if (item[1] === 0 && item[4] === 0) {
                        max = 1
                    }
                    if (item[1].indexOf('%') >= 0) {
                        html += '<div class="row">'
                        html += '<div class="num">' + item[1] + '</div>'
                        html += '<div class="m">'
                        html += '<div class="line ' + (item[1].replace('%', '') / 1 > item[4].replace('%', '') / 1 ? 's' : 'l') + '"><span style="width:' + item[1] + '"></span></div>'
                        html += '<div class="text">' + item[0] + '</div>'
                        html += '<div class="line ' + (item[1].replace('%', '') / 1 > item[4].replace('%', '') / 1 ? 'l' : 's') + '"><span style="width:' + item[4] + '"></span></div>'
                        html += '</div>'
                        html += '<div class="num">' + item[4] + '</div>'
                        html += '</div>'
                    } else {
                        html += '<div class="row">'
                        html += '<div class="num">' + item[1] + '</div>'
                        html += '<div class="m">'
                        html += '<div class="line ' + (item[1] / 1 > item[4] / 1 ? 's' : 'l') + '"><span style="width:' + item[1] / max * 100 + '%' + '"></span></div>'
                        html += '<div class="text">' + item[0] + '</div>'
                        html += '<div class="line ' + (item[1] / 1 > item[4] / 1 ? 'l' : 's') + '"><span style="width:' + item[4] / max * 100 + '%' + '"></span></div>'
                        html += '</div>'
                        html += '<div class="num">' + item[4] + '</div>'
                        html += '</div>'
                    }
                })
                $recentRecord.children('.content-team').append(html)
                // 未来赛程
                // 主队的
                html = '<tr> <th>日期</th> <th>赛事</th> <th>主队</th> <th>客队</th> </tr>'
                nextschedule_host.forEach(function(item) {
                    html += '<tr>'
                    html += '<td>' + item.data + '</td>'
                    html += '<td>' + item.saishi + '</td>'
                    html += '<td>' + item.home_team + '</td>'
                    html += '<td>' + item.visit_team + '</td>'
                    html += '</tr>'
                })
                $futureSchedule.children('.home-team').find('table').html(html)
                // 客队的
                html = '<tr> <th>日期</th> <th>赛事</th> <th>主队</th><th>客队</th> </tr>'
                nextschedule_visit.forEach(function(item) {
                    html += '<tr>'
                    html += '<td>' + item.data + '</td>'
                    html += '<td>' + item.saishi + '</td>'
                    html += '<td>' + item.home_team + '</td>'
                    html += '<td>' + item.visit_team + '</td>'
                    html += '</tr>'
                })
                $futureSchedule.children('.visit-team').find('table').html(html)
            },
            textMessage: function(result, flag, wenziMaxNum) {
                let html = ''
                let data = result.data
                data = data.reverse()
                let num = $headScore.attr('live_sid') / 1
                let $homeScore = $headScore.find('.home-score')
                let $visitScore = $headScore.find('.visit-score')
                if (flag === 1) { // 下方插入
                    data.forEach(function(item, i) {
                        if (item.live_sid / 1 > datainit.wenziMaxNum) { // 注 从文字直播的id去获取加载完成之后最大的数字,
                            datainit.wenziMaxNum = item.live_sid / 1
                        }
                        // 比分
                        if (!num) {
                            num = item.live_sid
                        }
                        if (item.live_sid >= num) {
                            // 足球时间不对
                            $headScore.find('p').text(item.pid_text)
                            $headScore.attr('live_sid', num)
                            $homeScore.text(item.home_score)
                            $visitScore.text(item.visit_score)
                        }
                        // 文字 style="color:${item.text_color}"
                        html += `<li>
                                <div class="t">
                                    <div class="circle ${datainit.ismatched === 1 && item.live_sid >= datainit.wenziMaxNum ? 'red' : item.live_sid === 1 ? 'blue' : ''}"></div>
                                    <div class="score">${item.home_score + '-' + item.visit_score}</div>
                                    <div class="time">${item.pid_text}</div>
                                </div>
                                <div class="text-box">
                                    <p>${item.live_text}</p>
                                    ${item.img_url ? `<div href="javascript:;" class="img-url" data-url="${item.img_url}"><img src="${config.DIRS.BUILD_FILE.images['zhibo_zhanwei']}" alt=""/></div>` : ''}
                                </div>
                            </li>`
                    })
                    $livebox.append(html)
                } else { // 上方插入
                    data.forEach(function(item, i) {
                        if (item.live_sid / 1 > datainit.wenziMaxNum) { // 注 从文字直播的id去获取加载完成之后最大的数字,
                            datainit.wenziMaxNum = item.live_sid / 1
                        }
                        if (item.live_sid <= wenziMaxNum) {

                        } else {
                            // 比分
                            if (!num) {
                                num = item.live_sid
                            }
                            if (item.live_sid >= num) {
                                // 足球时间不对
                                $headScore.find('p').text(item.pid_text)
                                $headScore.attr('live_sid', num)
                                $homeScore.text(item.home_score)
                                $visitScore.text(item.visit_score)
                            }
                            // 文字style="color:${item.text_color}"
                            html += `<li>
                                <div class="t">
                                    <div class="circle ${datainit.ismatched === 1 && item.live_sid >= num ? 'red' : item.live_sid === 1 ? 'blue' : ''}"></div>
                                    <div class="score">${item.home_score + '-' + item.visit_score}</div>
                                    <div class="time">${item.pid_text}</div>
                                </div>
                                <div class="text-box">
                                    <p>${item.live_text}</p>
                                    ${item.img_url ? `<div href="javascript:;" class="img-url" data-url="${item.img_url}"><img src="${config.DIRS.BUILD_FILE.images['zhibo_zhanwei']}" alt=""/></div>` : ''}
                                </div>
                            </li>`
                        }
                    })
                    $livebox.prepend(html)
                }
            }
        }, //加载相关新闻资讯 赛况
        loadMatchNews: function(saishi_id, teamname) {
            let $el = $(`<div class="sec1">
                            <h3 class="name"><span></span>相关资讯</h3>
                            <ul></ul>
                        </div>`)
            $matchNews.append($el)
            let data = {
                saishi_id: saishi_id,
                number: 10,
                teamnames: teamname
            }
            J_loading.show()
            _util_.makeJsonp(HOST + 'teamRelateNews', data).done(function(result) {
                J_loading.hide()
                $el.find('ul').html(produceListHtml(result))
            })

            function produceListHtml(result) {
                let data = result.data
                let html = ''
                data.forEach(function(item) {
                    let length = item.miniimg.length// 判断缩略图的数量
                    if (length < 3 && length >= 1) {
                        html += `<li class="clearfix">
                                    <a href="${item.url}" suffix="btype=index&subtype=newsFeed&idx=0">
                                        <div class="img">
                                            <img src="${item.miniimg[0].src}" alt=""/>
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
                                     <a href="${item.url}" suffix="btype=index&subtype=newsFeed&idx=0">
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
                })
                return html
            }
        }, // 直播和数据切换
        switchTab: function() {
            let $zhiboMenu = $('#zhiboMenu')
            let $zhibo_body = $('.zhibo_body')
            let $zhiboDataContent = $zhibo_body.children('.zhibo-data-content')
            let redirect = _util_.getUrlParam('redirect')
            $zhiboMenu.on('click', 'a', function() {
                $(this).parent().children().removeClass('active')
                $(this).addClass('active')
                let index = $(this).index()
                $zhiboDataContent.hide()
                if ($(this).attr('href') === 'javascript:;') {
                    $zhiboDataContent.eq(index).show()
                    if (index === 1 && redirect === 'app') {
                        $zhiboDataContent.eq(index).html(`<ul><li>
                                            <div class="text-ts">
                                                <p>暂无数据</p>
                                            </div>
                                        </li></ul>`)
                    }
                }
            })
        }, //点击查看gif图片
        viewGif: function() {
            $livebox.on('click', 'li .img-url', function() {
                /*$('body').append(`<div class="pop-up-gif">
                                        <img src="${$(this).attr('data-url')}" alt=""/>
                                        <p>点击关闭动图</p>
                                    </div>`)
                // 禁止
                /!*document.body.style.overflow = 'hidden';
                window.addEventListener('touchmove', _preventDefault);*!/
                $('.pop-up-gif').on('click', function () {
                    $(this).remove();
                    // 恢复
                    /!*document.body.style.overflow = 'auto';
                     window.removeEventListener('touchmove', _preventDefault);*!/
                })*/
                window.location.href = $(this).attr('data-url')
            })
        }, // 加载录像集锦
        loadJijin: function(jijintopicid, luxiangtopicid) {
            if (jijintopicid) {
                let $el = $(`<div class="sec">
                                <h3 class="name"><span></span>集锦</h3>
                                <ul></ul>
                                <div class="separate-line"></div>
                            </div>`)
                $matchNews.append($el)
                this.makeAjaxJijin(jijintopicid).done(function(data) {
                    let html = ''
                    data.data.forEach(function(item) {
                        html += `<li>
                                <a href="${item.url}" target="_blank">
                                    <div class="img"><img src="${item.miniimg[0].src}"/></div>
                                    <p>${item.topic}</p>
                                </a>
                            </li>`
                    })
                    $el.find('ul').append(html)
                })
            }
            if (luxiangtopicid) {
                let $el = $(`<div class="sec">
                                <h3 class="name"><span></span>录像</h3>
                                <ul></ul>
                                <div class="separate-line"></div>
                            </div>`)
                $matchNews.append($el)
                this.makeAjaxJijin(luxiangtopicid).done(function(data) {
                    let html = ''
                    data.data.forEach(function(item) {
                        html += `<li>
                                <a href="${item.url}" target="_blank">
                                    <div class="img"><img src="${item.miniimg[0].src}"/></div>
                                    <p>${item.topic}</p>
                                </a>
                            </li>`
                    })
                    $el.find('ul').append(html)
                })
            }
        }, // 页面初始化
        init: function() {
            this.queryMatchState() // 查询比赛状态
            this.onTextScroll() // 注册文字滚动事件
            //this.loadDetailDate() // 自动加统计数据
            this.switchTab() // 切换直播 数据 集锦录像 战报
            this.loadJijin() // 加载集锦 录像
            this.viewGif()//查看gif播放图
        }
    }
    let $livebox = $('#livebox')
    /* global _matchId_:true _page_type:true*/
    let datainit = new Loading(_matchId_, _page_type)
        // 球员统计 阴影遮罩出现
    ;(function() {
        let $playerData = $playerSta.find('.player-data')
        $playerData.scroll(function() {
            if ($(this).scrollLeft() > 0) {
                $(this).prev().addClass('active')
            } else {
                $(this).prev().removeClass('active')
            }
        })
    })()
    //头条种隐藏录像集锦
    ;(() => {
        if (_util_.getUrlParam('redirect') === 'app') {
            $('.crumbs').hide()
            $('#goTop').children('.back').hide()
            $headScore.next().next().attr('href', `downloadapp.html?qid=dfttapp`)
        }
    })()
})
