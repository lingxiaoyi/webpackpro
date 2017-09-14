const dirVars = require('./base/dir-vars.config.js')
const isOnlinepro = process.argv.indexOf('--env=onlinepro') !== -1 //判断参数如果有这个就是生产环境 API_ROOT值就为cdn地址
const isTestpro = process.argv.indexOf('--env=testpro') !== -1
let rootPath = ''
if (isOnlinepro) {
    rootPath = 'http://msports.eastday.com/h5/'
} else if (isTestpro) {
    rootPath = 'http://gxjifen.dftoutiao.com/gx-ued-jser/wangzhijun/msports.resources/msports.east.webpack/build/'
} else {
    rootPath = '/'
}
module.exports = { ///entry
    path: dirVars.buildDir,
    publicPath: rootPath,
    filename: 'static/js/[name].[chunkhash].js', // [name]表示entry每一项中的key，用以批量指定生成后文件的名称
    chunkFilename: '[id].[chunkhash].bundle.js'
}
