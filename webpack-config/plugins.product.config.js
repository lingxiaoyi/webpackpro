const webpack = require('webpack')
let pluginsConfig = require('./inherit/plugins.config.js')
const CleanWebpackPlugin = require('clean-webpack-plugin')
let dirlets = require('./base/dir-vars.config.js')
let ROOT_PATH = dirlets.staticRootDir

//清理build文件夹
pluginsConfig.unshift(new CleanWebpackPlugin(['dist', 'build'],
    {
        root: ROOT_PATH, //根目录
        verbose: true, //开启在控制台输出信息
        dry: false //启用删除文件
    })
)

/* webpack1下，用了压缩插件会导致所有loader添加min配置，而autoprefixser也被定格到某个browers配置 */
pluginsConfig.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
}))

pluginsConfig.push(new webpack.DefinePlugin({
    IS_PRODUCTION: true,
    'process.env.NODE_ENV': JSON.stringify('production')
}))

pluginsConfig.push(new webpack.NoEmitOnErrorsPlugin()) // 配合CLI的--bail，一出error就终止webpack的编译进程

/* HashedModuleIdsPlugin 这个插件，他是根据模块的相对路径生成一个长度只有四位的字符串作为模块的 module id ，
这样就算引入了新的模块，也不会影响 module id 的值，只要模块的路径不改变的话。 */
pluginsConfig.push(new webpack.HashedModuleIdsPlugin())

module.exports = pluginsConfig
