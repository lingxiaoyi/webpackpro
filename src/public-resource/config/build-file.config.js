require('!!file-loader?name=index.html!../../index.html')
module.exports = {
    js: {
        //html5shiv: require('!!file-loader?name=static/js/[name].[ext]!../../../vendor/ie-fix/html5shiv.min.js'),
        //respond: require('!!file-loader?name=static/js/[name].[ext]!../../../vendor/ie-fix/respond.min.js'),
        //jquery: require('!!file-loader?name=static/js/[name].[ext]!jquery/dist/jquery.min.js'),
        hotcss: require('!!file-loader?name=static/js/[name].[ext]!../../../vendor/hotcss.js'),
    },
    images: {
        'favicon': require('!!url-loader?limit=1&name=static/img/[hash]_[name].[ext]!../imgs/favicon.ico'), //这个文件用地址好看 可以用base64
        'logo': require('!!url-loader?limit=8192&name=static/img/[hash]_[name].[ext]!../imgs/logo.png'),
        '404n': require('!!url-loader?limit=8192&name=static/img/[hash]_[name].[ext]!../imgs/404n.png'),
        'logo_default': require('!!url-loader?limit=8192&name=static/img/[hash]_[name].[ext]!../imgs/logo_default.png'),
        'i-s-saicheng': require('!!url-loader?limit=8192&name=static/img/[hash]_[name].[ext]!../imgs/i-s-saicheng.png'),
        'i-shuju': require('!!url-loader?limit=8192&name=static/img/[hash]_[name].[ext]!../imgs/i-shuju.png'),
        'i-logo': require('!!url-loader?limit=8192&name=static/img/[hash]_[name].[ext]!../imgs/i-logo.png'),
        'i-saicheng': require('!!url-loader?limit=8192&name=static/img/[hash]_[name].[ext]!../imgs/i-saicheng.png'),
        'i-tongji': require('!!url-loader?limit=8192&name=static/img/[hash]_[name].[ext]!../imgs/i-tongji.png'),
        'i-paiming': require('!!url-loader?limit=8192&name=static/img/[hash]_[name].[ext]!../imgs/i-paiming.png'),
        'i-jifenbang': require('!!url-loader?limit=8192&name=static/img/[hash]_[name].[ext]!../imgs/i-jifenbang.png'),
        'i-zhibo': require('!!url-loader?limit=8192&name=static/img/[hash]_[name].[ext]!../imgs/i-zhibo.png'),
        'zhibo_zhanwei': require('!!url-loader?limit=8192&name=static/img/[hash]_[name].[ext]!../imgs/zhibo_zhanwei.png'),
        'download-pic': require('!!url-loader?limit=8192&name=static/img/[hash]_[name].[ext]!../imgs/download-pic.png')
    },
    dll: {
      js: require('!!file-loader?name=static/dll/[name].[ext]!../../dll/dll.js'),
      css: require('!file-loader?name=static/dll/[name].[ext]!../../dll/dll.css'),
    },
}
