import config from 'configModule'
const _util_ = require('../libs/libs.util')
let {RZAPI} = config.API_URL
$(() => {
    let $body = $('body')
    let soft_type = 'dongfangtiyu'
    let soft_name = 'DFTYH5'
    let u_id = _util_.getPageQid()//访客uid
    let qid = _util_.getUid()//访客uid
    let OSType = _util_.getOsType()//操作系统
    let browserType = _util_.browserType()//浏览器
    let _vbb = 'null'//版本号
    let remark = 'null'//备注信息
    let idx = 'null'//新闻链接位置
    let btype = 'null'//大类
    let subtype = 'null'//子类
    let newstype = 'null'//新闻类别
    let pageNo = 'null'//页数
    let appqid = 'null'//App渠道号url上追加的appqid
    let ttloginid = 'null'//App端分享新闻时url上追加的ttloginid
    let apptypeid = 'null'//App端的软件类别url上追加的apptypeid
    let appver = 'null'// App版本（010209）url上追加的appver
    let ttaccid = 'null'//App端分享新闻时url上追加的ttaccid
    let from = _util_.getReferrer()//浏览器
    let pixel = window.screen.width + '*' + window.screen.height//客户端分辨率
    let pgtype = _util_.getpgtype()//(pgtype=1文字直播;pagetype=0表示新闻,其他为2)
    let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
    let to = ''//转向的url
    let intervaltime = 10 //间隔多久上传一次数据（当前为10s）
    class Log {
        constructor() {
            this.init()
        }

        init() {
            this.loadActiveApi()
            this.loadOnlineApi()
            this.loadClickApi()
        }

        loadActiveApi() {
            let param = '?qid=' + qid + '&uid=' + u_id + '&from=' + from + '&to=' + locationUrl + '&type=' + btype + '&subtype=' + subtype + '&idx=' + idx + '&remark=' + remark + '&os=' + OSType + '&browser=' + browserType + '&softtype=' + soft_type + '&softname=' + soft_name + '&newstype=' + newstype + '&pixel=' + pixel + '&ver=' + _vbb + '&appqid=' + appqid + '&ttloginid=' + ttloginid + '&apptypeid=' + apptypeid + '&appver=' + appver + '&pgnum=' + pageNo + '&pgtype=' + pgtype
            let data = {url: param}
            _util_.makeJsonp(RZAPI.active, data)
        }

        loadOnlineApi() {
            let param = '?qid=' + qid + '&uid=' + u_id + '&url=' + locationUrl + '&apptypeid=' + apptypeid + '&loginid=' + ttaccid + '&loginid=' + ttaccid + '&type=' + btype + '&subtype=' + subtype + '&intervaltime=' + intervaltime + '&ver=' + _vbb + '&os=' + OSType + '&appqid=' + appqid + '&ttloginid=' + ttloginid + '&pgtype=' + pgtype
            let data = {
                url: param
            }
            //10秒定时去请求传online数据
            setInterval(function() {
                _util_.makeJsonp(RZAPI.online, data)
            }, intervaltime * 1000)
        }

        loadClickApi() {
            $body.on('click', 'a[suffix]', function() {
                to = $(this).attr('href')
                idx = $(this).index()
                _util_.CookieUtil.set('logdata', $(this).attr('suffix'))
                let param = '?qid=' + qid + '&uid=' + u_id + '&from=' + from + '&to=' + to + '&type=' + btype + '&subtype=' + subtype + '&idx=' + idx + '&remark=' + remark + '&os=' + OSType + '&browser=' + browserType + '&softtype=' + soft_type + '&softname=' + soft_name + '&newstype=' + newstype + '&pixel=' + pixel + '&ver=' + _vbb + '&appqid=' + appqid + '&ttloginid=' + ttloginid + '&apptypeid=' + apptypeid + '&appver=' + appver + '&pgnum=' + pageNo

                let data = {
                    url: param
                }
                _util_.makeJsonp(RZAPI.onclick, data)
            })
            $body.on('click', 'a[clickbackurl]', reportLog)

            function reportLog() {
                let clickbackurl = $(this).attr('clickbackurl')
                $body.append('<img src="' + clickbackurl + '" />')
            }
        }
    }

    new Log()
})
