const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const crumbsHtml = require('./templates/header-crumbs.html')
const pageTitle = '$!{page.title}_东方体育视频'
const pageKeywords = '$!{videokeywords}'
const pageDescription = '$!{page.title}'
scriptHtml = scriptHtml()
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    scriptHtml,
    crumbsHtml
}).run(content(config))
