const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
const scriptHtml = require('./templates/script-var.html')
const pageTitle = '新闻内页'
const pageKeywords = '新闻内页'
const pageDescription = '新闻内页'
const hasLogo = false

module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    scriptHtml,
    hasLogo
}).run(content(config))
