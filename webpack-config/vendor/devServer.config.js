module.exports = {
    contentBase: './build/',
    host: '172.18.3.236', //此配置为自己机子的ip 利于手机或者别人测试用
    port: 8080, // 默认8080
    inline: true, // 可以监控js变化
    hot: true, // 热启动
    compress: true,
    watchContentBase: false
}
