import config from 'configModule'
const _util_ = require('../libs/libs.util')
let {RZAPI} = config.API_URL
$(() => {
    let $body = $('body')
    let $J_hot_news = $('#J_hot_news')
    let qid = _util_.getPageQid()//访客uid
    let uid = _util_.getUid()//访客uid
    let OSType = _util_.getOsType()//操作系统
    let browserType = _util_.browserType()//浏览器
    let refer = _util_.getReferrer()//浏览器
    let pixel = window.screen.width + '*' + window.screen.height//客户端分辨率
    let pgtype = _util_.getpgtype()//(pgtype=1文字直播;pagetype=0表示新闻,其他为2)
    let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
    let fromUrl = document.referrer//来源url
    let toUrl = ''//转向的url
    let {idx = 'null', ishot = 'null', recommendtype = 'null'} = _util_.getSuffixParam(_util_.CookieUtil.get('logdata'))
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
            /* global _yiji_:true _erji_:true _newstype_:true*/
            let data = {
                qid: qid,
                uid: uid,
                from: fromUrl,
                to: locationUrl,
                type: _yiji_,
                subtype: _erji_,
                idx: idx,
                remark: 'null',
                os: OSType,
                browser: browserType,
                softtype: 'null',
                softname: 'null',
                newstype: _newstype_,
                ver: 'null',
                pixel: pixel,
                refer: refer,
                appqid: 'null',
                ttloginid: 'null',
                apptypeid: 'null',
                appver: 'null',
                pgnum: 1, //没有做分页
                pgtype: pgtype,
                ime: 'null',
                ishot: ishot,
                recommendtype: recommendtype
            }
            _util_.makeJsonp(RZAPI.active, data)
        }

        loadOnlineApi() {
            let data = {
                url: locationUrl,
                qid: qid,
                uid: uid,
                apptypeid: 'null',
                loginid: 'null',
                type: _yiji_,
                subtype: _erji_,
                intervaltime: intervaltime,
                ver: 'null',
                os: OSType,
                appqid: 'null',
                ttloginid: 'null',
                pgtype: pgtype,
                ime: 'null',
                newstype: _newstype_
            }
            //10秒定时去请求传online数据
            setInterval(function() {
                _util_.makeJsonp(RZAPI.online, data)
            }, intervaltime * 1000)
        }

        loadClickApi() {
            $J_hot_news.on('click', '.hn-list a', function() {
                toUrl = $(this).attr('href')
                let {idx = 'null', ishot = 'null', recommendtype = 'null'} = _util_.getSuffixParam($(this).attr('suffix'))
                idx = $(this).index()
                let data = {
                    qid: qid,
                    uid: uid,
                    from: locationUrl,
                    to: toUrl,
                    type: _yiji_,
                    subtype: _erji_,
                    idx: idx,
                    remark: 'null',
                    os: OSType,
                    browser: browserType,
                    softtype: 'null',
                    softname: 'null',
                    newstype: _newstype_,
                    ver: 'null',
                    pixel: pixel,
                    refer: refer,
                    appqid: 'null',
                    ttloginid: 'null',
                    apptypeid: 'null',
                    appver: 'null',
                    pgnum: 1, //没有做分页
                    ime: 'null',
                    ishot: ishot,
                    recommendtype: recommendtype
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
