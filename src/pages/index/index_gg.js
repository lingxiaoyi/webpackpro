var GLOBAL={},currChannel='null';
GLOBAL.namespace = function(str){
    var arr = str.split("."),o = GLOBAL;
    for(var i = (arr[0] === "GLOBAL") ? 1 : 0; i < arr.length; i++){
        o[arr[i]] = o[arr[i]] || {};
        o = o[arr[i]];
    }
};
GLOBAL.namespace('baidugg');
GLOBAL.namespace('channel');
GLOBAL.namespace('nohannel');
GLOBAL.namespace('dfgdhdfhdfh');
//渠道 首页
GLOBAL.baidugg={
  indexGg:{//首页
	  'null':[
		  't4djpnfha9',
		  'nod95sacwj',
		  'pqdq498mou',
		  'rsd83p62l6'
	  ],
	  'baiducom':[
		  'fndinpjlgg',
		  'god95sdbw',
		  'hpdzm1cv8',
		  'ksd83p91m1'
	  ],
	  'tiyuywxl':[
		  'j1dczrkh4u',
		  'o6d2fwawak',
		  'tbdrpw5cff',
		  'ygdh5wurg5'
	  ],
	  'tiyursnet':[
		  'c6d2fxcr8k',
		  'gad18p8hw',
		  'icdi761won',
		  'kedz6my7ly'
	  ],
	  'tiyujhxinx':[
		  'ivdha84tpk',
		  'jwd8rb3j6n',
		  'lydpqr1yx4',
		  'mzdg3zzjec'
	  ],
	  '360ty':[
		  'wrjxjzaaguyxagjn',
		  'avnbndeesycx',
		  'dyqeqghhabfhnqu',
		  'cxpdpfgttaedgm'
	  ],
	  'tiyukwkj':[
		  'qldrhrruioshikmn',
		  'snftjttwoqum',
		  'niaoeooxrlprx',
		  'pkcqgqqzcnrcghj'
	  ],
	  'tiyucoolpad':[
		  'pkcqgqtgqnrcghj',
		  'rmesisvibpt',
		  'togukuxkkrvpq',
		  'wrjxnxansuyxagjn'
	  ],
	  'tiyuweimillq':[
		  'ojbpfpyypmqybf',
		  'rmesisbbept',
		  'snftjtccjqum',
		  'uphvlveeoswrxv'
	  ],
	  'tiyuydbrowser':[
		  'wrjxnxjjquyxagjn',
		  'xskyoykktvz',
		  'rmesiseispt',
		  'snftjtfjwqum'
	  ],
	  'tiyukubishouji':[
		  'ytlzpzpcbwai',
		  'qldrhrharoshikmn',
		  'snftjtjccqum',
		  'uphvlvlhhswrxv'
	  ],
	  'tiyuayoyllq':[
		  'cxpdtdtywaedgm',
		  'ezrfvfvabcgorvwy',
		  'bwocscsyszdec',
		  'fasgwgwbidh'
	  ],
	  'tiyumpllq':[
		  'rmesisjvvpt',
		  'togukulxgrvpq',
		  'wrjxnxoaquyxagjn',
		  'xskyoypbtvz'
	  ],
	  'tiyuucbrowsernykz':[
		  'uphvlyeemswrxv',
		  'vqiwmzffptxywzf',
		  'ytlzpciibwai',
		  'qldrhuadroshikmn'
	  ],
	  'tiyulieykj':[
		  'cxpdtgmzwaedgm',
		  'ezrfviobbcgorvwy',
		  'fasgwjpcidh',
		  'bwocsfleszdec'
	  ],
	  'tiyuoppobrowser01':[
		  'cxpdtmugfaedgm',
		  'uphvlemeyswrxv',
		  'vqiwmfnfftxywzf',
		  'xskyohphovz'
	  ],
	  'tiyuhaitunllq':[
		  'vqiwmiwintxywzf',
		  'wrjxnjxjquyxagjn',
		  'xskyokyktvz',
		  'rmesiesispt'
	  ],
	  'tiyuvivobrowser01':[
		  'hcuiyudkufjzb',
		  'kfxlbxgneimhnlou',
		  'lgymcyhohjn',
		  'mhzndzipjkon'
	  ],
	  'tiyuqqwl':[
		  'kfxlbbngcimhnlou',
		  'lgymccohfjn',
		  'mhznddpiikon',
		  'niaoeeqjklprx'
	  ],
	  'tiyuzhangliu':[
		  'cxpdtumzmaedgm',
		  'dyqeuvnaqbfhnqu',
		  'fasgwxpcxdh',
		  'gbthxyqdaeix',
	  ],
	  'tiyuzhzai':[
		  'dyqeuanhzbfhnqu',
		  'ezrfvboibcgorvwy',
		  'cxpdtzmmuaedgm',
		  'dyqeuannxbfhnqu',
	  ],
	  'tiyuzhd':[
		  'ezrfwyivacgorvwy',
		  'ytlzqscqcwai',
		  'cxpduwgwpaedgm',
		  'idvjacmclgkcef',
	  ],
	  'tiyumayibrowser':[
		  'uphvovhvmswrxv',
		  'wrjxqxjxsuyxagjn',
		  'rmeslsevvpt',
		  'uphvovhylswrxv',
	  ]
  }
};
//没渠道的固定广告
GLOBAL.noChannel={
	newsList:[
		'tudp264cdm',
		'vwd71hwrbn',
		'xydozxu734',
		'b3ds8fgw26',
		'd5da7v97tm',
		'f7dr677mrn',
		'jbdqy43cgf',
		'kcdhgcw2rn',
		'nfdpwvt257',
		'ogdge4srh5',
		'bwocoltoxzdec',
		'cxpdpmupzaedgm',
		'uphvhemlvswrxv',
		'ytlzliqppwai',
		'dyqeqnvuabfhnqu'
	]
};

/**
 * cookie扩展对象
 */
var CookieUtil = {
	/**
	 * 设置cookie
	 * @param name 名称
	 * @param value 值
	 * @param expires 有效时间（单位：小时）（可选） 默认：24h
	 */
	set: function(name, value, expires){
		var expTimes = expires ? (Number(expires) * 60 * 60 * 1000) : (24 * 60 * 60 * 1000); // 毫秒
		var expDate = new Date();
		expDate.setTime(expDate.getTime() + expTimes);
		var expString = expires ? '; expires=' + expDate.toUTCString() : '';
		var pathString = '; path=/';
		document.cookie = name + '=' + encodeURI(value) + expString + pathString;
	},
	/**
	 * 读cookie
	 * @param name
	 */
	get: function(name){
		var cookieStr = '; ' + document.cookie + '; ';
		var index = cookieStr.indexOf('; ' + name + '=');
		if(index !== -1){
			var s = cookieStr.substring(index + name.length + 3, cookieStr.length);
			return decodeURI(s.substring(0, s.indexOf('; ')));
		} else {
			return null;
		}
	},
	/**
	 * 删除cookie
	 * @param name
	 */
	del: function(name){
		this.set(name, "null", -1);
	}
};
/**
 * 获取url中的参数
 * @param {any} name   参数名
 * @returns
 */
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if (r != null) return unescape(r[2]);
	return null; //返回参数值
}
/**
 * Javascript获取页面来源(referer)
 * @from http://www.au92.com/archives/javascript-get-referer.html
 * @return {[type]} [description]
 */
function getReferrer() {
	var referrer = '';
	try {
		referrer = window.top.document.referrer;
	} catch(e) {
		if(window.parent) {
			try {
				referrer = window.parent.document.referrer;
			} catch(e2) {
				referrer = '';
			}
		}
	}
	if(referrer === '') {
		referrer = document.referrer;
	}
	return referrer;
}

(function () {

	var sports_qid=getUrlParam('qid');
	var specialChannel;
	if(sports_qid){
		CookieUtil.set('sports_qid',sports_qid);
	}else{
		// 通过搜索引擎进入的（渠道处理）
		specialChannel = [
			{referer: 'baidu.com', qid: 'baiducom'}/*,
			{referer: 'so.com', qid: '360so'},
			{referer: 'sogou.com', qid: 'sogoucom'},
			{referer: 'sm.cn', qid: 'smcn'},
			{referer: 'm.tq1.uodoo.com', qid: 'smcn'}*/
		];
		for (var i = 0; i < specialChannel.length; i++) {
			if(getReferrer() && getReferrer().indexOf(specialChannel[i].referer) !== -1){
				currChannel = specialChannel[i].qid;
				CookieUtil.set('sports_qid',currChannel);
				break;
			}
		}
	}

	if(CookieUtil.get('sports_qid')){//&&currChannel=='null' 这个暂时不计百度
		currChannel=CookieUtil.get('sports_qid');
		if(!GLOBAL.baidugg.indexGg[currChannel]){//没有这个渠道就用默认的
			currChannel='null';
		}
	}


})();
var _indexGg_ = GLOBAL.baidugg.indexGg;
var _newsList_ = GLOBAL.noChannel.newsList;
export  {_indexGg_,currChannel,_newsList_};
