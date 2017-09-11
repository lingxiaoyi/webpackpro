import 'pages/schedule/style.scss'
import './log.js'
import FastClick from 'fastclick'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let u = navigator.userAgent
    /*let app = navigator.appVersion*/
    let ua = navigator.userAgent.toLowerCase()
    let $J_download = $('#J_download')
    /*function makeJsonp(url, data) {
        return $.ajax({
            type: 'GET',
            data: data,
            url: url,
            dataType: 'json'
        })
    }*/
    /* makeJsonp('/data/log_app/log_h5.js',{}).done(function (result) {})*/
    //let download_url=result[0].download_url
    if (ua.match(/MicroMessenger/i) === 'micromessenger') { //微信下
        $J_download.attr('href', 'http://a.app.qq.com/o/simple.jsp?pkgname=com.songheng.starsports')
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.songheng.starsports'
    } else {
        if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) { //苹果
            $J_download.attr('href', 'https://itunes.apple.com/cn/app/id1271975517?mt=8')
            window.location.href = 'https://itunes.apple.com/cn/app/id1271975517?mt=8'
        } else { //安卓
            $J_download.attr('href', 'http://m.wa5.com/data/apk/wuxing_android.apk')
            window.location.href = 'http://m.wa5.com/data/apk/wuxing_android.apk'
        }
    }
})
