let webpack = require('webpack')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let path = require('path')
let dirlets = require('../base/dir-vars.config.js')
let pageArr = require('../base/page-entries.config.js')
let HashOutput = require('webpack-plugin-hash-output')
const InlineChunkWebpackPlugin = require('html-webpack-inline-chunk-plugin');
const isOnlinepro = process.argv.indexOf('--env=onlinepro') !== -1

const devServer = process.argv.join('').indexOf('webpack-dev-server') !== -1 //有这个参数就生成html模板
let configPlugins = [
    /* 全局shimming */
    new webpack.ProvidePlugin({
        $: 'n-zepto',
        Zepto: 'n-zepto',
        'window.Zepto': 'n-zepto',
        'window.$': 'n-zepto',
        WebStorageCache: 'web-storage-cache',
        Vue: 'vue',
        vue: 'vue'
    }),
    /* 抽取出所有通用的部分 */
    new webpack.optimize.CommonsChunkPlugin({
        names: ['static/commons'], // chunk的名字,需要注意的是，chunk的name不能相同！！！
        filename: '[name]/commons.[chunkhash].js', //生成common.js [name]/
        minChunks: 4
    }),
    /* 抽取出webpack的runtime代码()，避免稍微修改一下入口文件就会改动commonChunk，导致原本有效的浏览器缓存失效  注意点2:devServer环境不支持chunkhash命名  chunkhash配置如果文件没有修改runtime文件也会没有变化  hash配置每次执行命令后,不管文件修不修改,每次都会修改*/
    /*(function() {
        if (devServer) {
            return new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                filename: 'static/commons/manifest.[hash].js'
            })
        } else {
            return new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                filename: 'static/commons/manifest.[chunkhash].js'
            })
        }
    })(),*/
    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        filename: 'static/commons/manifest.[hash].js'
    }),
    new InlineChunkWebpackPlugin({
        inlineChunks: ['manifest']
    }),
    /* 抽取出chunk的css */
    new ExtractTextPlugin('static/css/[name].[contenthash].css'),
    /* 配置好Dll */
    new webpack.DllReferencePlugin({
        context: dirlets.staticRootDir, // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
        manifest: require('../../manifest.json'), // 指定manifest.json
        name: 'dll' // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
    }),
    new HashOutput({
        manifestFiles: 'manifest' // 指定包含 manifest 在内的 chunk
    })
]

pageArr.forEach((page) => {
    let filename = ''
    if (!devServer && (page === 'detail' || page === 'detail-baijiahao' || page === 'liveing' || page === 'report' || page === 'video')) {
        if (isOnlinepro) {
            filename += `../vm/online/${page}.vm`
        } else {
            filename += `../vm/test/${page}.vm`
        }
    } else {
        filename += `html/${page}.html`
    }
    const htmlPlugin = new HtmlWebpackPlugin({
        filename: `${filename}`, //vm文件和html文件分开
        template: path.resolve(dirlets.pagesDir, `./${page}/html.js`),
        chunks: ['manifest', page, 'static/commons'],
        hash: false, // 为静态资源生成hash值
        xhtml: false, //是否渲染link为自闭合的标签，true则为自闭合标签
        minify: false
    })
    configPlugins.push(htmlPlugin)
})

module.exports = configPlugins
