var path = require('path');
var dirVars = require('./base/dir-vars.config.js');
var pageArr = require('./base/page-entries.config.js');
var configEntry = {};

pageArr.forEach((page) => {
  configEntry[page] = path.resolve(dirVars.pagesDir, page + '/index');
});
configEntry['vendor']=['jquery']
/*configEntry['swiper']=[path.resolve(dirVars.vendorDir, './swiper.min')]*/
console.log(configEntry)
module.exports = configEntry;
