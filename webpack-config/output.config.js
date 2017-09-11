const dirVars = require('./base/dir-vars.config.js')
const prod = process.argv.indexOf('--env=pro') !== -1 //判断参数如果有这个就是生产环境 API_ROOT值就为cdn地址
let rootPath = ''
if (prod) {
    rootPath = 'http://msports.eastday.com/h5/'
} else {
    rootPath = 'http://172.18.3.236:8080/'
}
module.exports = {
    path: dirVars.buildDir,
    publicPath: rootPath,
    filename: 'static/[name]/entry.[chunkhash].js', // [name]表示entry每一项中的key，用以批量指定生成后文件的名称
    chunkFilename: '[id].[chunkhash].bundle.js'
}
