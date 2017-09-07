const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const pageTitle = '$!{page.title}'
const pageKeywords = '$!{page.title}'
const pageDescription = '$!{description}'
const hasLogo = false
scriptHtml = scriptHtml()
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    scriptHtml,
    hasLogo
}).run(content(config))