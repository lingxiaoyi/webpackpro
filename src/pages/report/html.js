const content = require('./content.ejs') // 调取存放本页面实际内容的模板文件
const layout = require('layout')
const config = require('configModule')
const scriptHtml = require('./templates/script-var.html')
const pageTitle = '文字直播'
const pageKeywords = '体育赛事，体育赛程，赛程预告，赛程表'
const pageDescription = '东方体育赛程频道提供最新的篮球赛程表，足球赛程表，帮助球迷及时了解最新的体育赛事，不错过每一次精彩的体育赛事。'
const hasLogo = false //判断有没有logo栏
    module.exports = layout.init({
        pageTitle,
        pageKeywords,
        pageDescription,
        scriptHtml,
        hasLogo
}).run(content(config))
