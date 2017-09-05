const buildFileConfig = require('configDir/build-file.config')
const moduleExports = {
    DIRS: {
        BUILD_FILE: buildFileConfig
    },

    PAGE_ROOT_PATH: '../../'
}

/* 帮助确定ie下CORS的代理文件 */
moduleExports.DIRS.SERVER_API_URL = moduleExports.SERVER_API_URL

/* global IS_PRODUCTION:true */ // 由于ESLint会检测没有定义的变量，因此需要这一个`global`注释声明IS_PRODUCTION是一个全局变量(当然在本例中并不是)来规避warning
if (IS_PRODUCTION) { // 由于本脚手架并没有牵涉到HTTP请求，因此此处仅作为演示分离开发/生产环境之用。
    moduleExports.API_ROOT = 'http://msports.eastday.com/'
} else {
    moduleExports.API_ROOT = '/'
}

if (IS_PRODUCTION) { // 本项目所用的所有接口
    moduleExports.API_URL = {
        HOST: 'http://dfsports_h5.dftoutiao.com/dfsports_h5/',
        HOST_LIVE: 'http://dfsportslive.dftoutiao.com/dfsports/',
        HOST_DSP_LIST: 'http://dftyttd.dftoutiao.com/partner/list',
        HOST_DSP_DETAIL: 'http://dftyttd.dftoutiao.com/partner/detail',
        HOME_LUNBO_API: 'http://msports.eastday.com/json/msponts/home_lunbo.json',
        ORDER_API: 'http://dfty.dftoutiao.com/index.php/Home/WechatOrder/yuyue?system_id=9&machid=',
        RZAPI: {
            active: 'http://dfsportsdatapc.dftoutiao.com/dfsportsdatah5/active',
            onclick: 'http://dfsportsdatapc.dftoutiao.com/dfsportsdatah5/onclick',
            online: 'http://dfsportsdatapc.dftoutiao.com/dfsportsdatah5/online'
        }
    }
} else {
    moduleExports.API_URL = {
        HOST: 'http://172.18.250.87:8381/dfsports_h5/',
        HOST_LIVE: 'http://172.18.250.87:8381/dfsports/',
        HOST_DSP_LIST: 'http://106.75.98.65/partner/list',
        HOST_DSP_DETAIL: 'http://106.75.98.65/partner/detail',
        HOME_LUNBO_API: 'http://msports.eastday.com/json/msponts/home_lunbo.json',
        ORDER_API: 'http://dfty.dftoutiao.com/index.php/Home/WechatOrder/yuyue?system_id=9&machid=',
        RZAPI: {
            active: 'http://172.18.250.87:8380/dfsportsdatah5/active',
            onclick: 'http://172.18.250.87:8380/dfsportsdatah5/onclick',
            online: 'http://172.18.250.87:8380/dfsportsdatah5/online'
        }
    }
}
module.exports = moduleExports
