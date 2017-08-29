const content = require('./content.ejs') // 调取存放本页面实际内容的模板文件
const layout = require('layout') // 调用管理后台内部所使用的布局方案，我在webpack配置里定义其别名为'layout'
const pageTitle = '东方体育数据页面' // 页面名称
module.exports = layout.init({pageTitle}).run(content())
