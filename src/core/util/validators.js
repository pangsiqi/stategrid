/** 这个文件只允许放表单验证方法 
正则表达式：
只能输入数字："^[0-9]*$"。
只能输入n位的数字："^\d{n}$"。
只能输入至少n位的数字："^\d{n,}$"。
只能输入m~n位的数字："^\d{m,n}$"。
只能输入零和非零开头的数字："^(0|[1-9][0-9]*)$"。 
只能输入有两位小数的正实数："^[0-9]+(.[0-9]{2})?$"。 
只能输入有1~3位小数的正实数："^[0-9]+(.[0-9]{1,3})?$"。 
只能输入非零的正整数："^\+?[1-9][0-9]*$"。 
只能输入非零的负整数："^\-[1-9][]0-9"*$。 
只能输入长度为3的字符："^.{3}$"。 
只能输入由26个英文字母组成的字符串："^[A-Za-z]+$"。 
只能输入由26个大写英文字母组成的字符串："^[A-Z]+$"。 
只能输入由26个小写英文字母组成的字符串："^[a-z]+$"。 
只能输入由数字和26个英文字母组成的字符串："^[A-Za-z0-9]+$"。 
只能输入由数字、26个英文字母或者下划线组成的字符串："^\w+$"。 
验证用户密码："^[a-zA-Z]\w{5,17}$"正确格式为：以字母开头，长度在6~18之间，只能包含字符、数字和下划线。 
验证用户密码强："^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*_-()\/<>+={}]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*_\/<>{}]+$)(?![\d!@#$%^&*_\/<>{}]+$)[a-zA-Z\d!@#$%^&*_\/<>{}]+$"字母+数字+特殊字符
验证用户密码中："^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$"字母+数字，字母+特殊字符，数字+特殊字符
验证用户密码弱："^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$"纯数字，纯字母，纯特殊字符
同时验证手机号码和固定电话号码：“/^((1[3456789]))\d{9}$|^0\d{2,3}-?\d{7,8}$”
验证是否含有^%&',;=?$\"等字符："[^%&',;=?$\x22]+"。 
只能输入汉字："^[\u4e00-\u9fa5]{0,}$"
以英文字母开头，只能包含英文字母、数字、下划线："^[a-zA-Z][a-zA-Z0-9_]*$"。
只能输入汉字、英文字母和数字"/^[\u0391-\uFFE5A-Za-z0-9]+$/"。
覆盖的优先级： 自定义规则 > 选项规则 > 默认规则
**/
const validators = {
	LetterNumber:function (str) {// 英文、数字或下划线
		const letterNumber = /^\w+$/;
		return letterNumber.test(str);
	},


	LowerCase:function (str) {/* 小写字母*/
		const reg = /^[a-z]+$/;
		return reg.test(str);
	},

	URL:function (str) {/* 合法URL*/
		const urlregex =  "[`#^&*()={}';',\\[\\]<>?~！#……&*{}‘；']‘'"; 
		for (var i = 0; i < str.length; i++) {
				if (urlregex.indexOf(str.substr(i, 1)) != -1) {
					return false;
				}
			}
		// const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
		return true;
	},


	SpecificWord:function (str) {// 特殊字符
		if( str!=null||str != undefined){
			var specialKey = "[`~!#^&*()=|{}':;'\\[\\]<>?~！#……&*{}‘']‘'"; 
			for (var i = 0; i < str.length; i++) {
				if (specialKey.indexOf(str.substr(i, 1)) != -1) {
					return false;
				}
			}
		}
		return true;
	},

	Mandarin:function (str) {/* 仅限中文*/
		if( str!=null||str != undefined){
			var mandarins = /^[\u4e00-\u9fa5]{0,}$/;
			for (var i = 0; i < str.length; i++) {
				if (mandarins.indexOf(str.substr(i, 1)) != -1) {
					return false;
				}
			}
			// return mandarins.test(str);
		}
		return true;
	},

	Englishs:function (str) {/* 仅限英文*/
		const eng = /^[A-Za-z]+$/;
		return eng.test(str);
	},

	Numbers:function (str) {// 仅限数字
		const numbe = /^[0-9]*$/;
		return numbe.test(str);
	},

	CompanyCode:function (str) {// 统一社会信用代码 正则验证
		const companycode = /[1-9A-GY]{1}[1239]{1}[1-5]{1}[0-9]{5}[0-9A-Z]{10}/;
		return companycode.test(str);
	},

//---------------------------------------------------------------------------------------------//
	isSpecificKey:function (rule, value, callback) { //不允许特殊字符
		if(!value) {
			callback();
		}
		setTimeout(() => {
			var regs = /^.{1,120}$/g
			if (!regs.test(value)) {
				callback(new Error('内容不少于1位且不能大于120位'));
			} else {
				if(!validators.SpecificWord(value)) {
					callback(new Error('不支持特殊符号'));
				} else {
					callback();
				}
			}
		}, 500);
	},

	isCompanyCode:function (rule, value, callback) { //统一社会信用代码
		if(!value) {
			callback();
		} else {
			if(!validators.CompanyCode(value)) {
				callback(new Error('不是有效的统一社会信用代码'));
			} else {
				callback();
			}
		}
	},

	isPrices:function (rule, value, callback) {//验证价格
		if(!value) {
			callback();
		}
		setTimeout(() => {
			var regp = /^(-)?\d{1,3}(,\d{3})*(.\d+)?$/
			if (!regp.test(value)) {
				callback(new Error('请输入数字'));
			} else {
				var regs = /^.{1,21}$/g
				if(!regs.test(value)) {
					callback(new Error('内容不少于1位且不能大于16位'));
				} else {
					callback();
				}
			}
		}, 500);
	},
	isWorknumber:function (rule, value, callback) {//验证工号内容最长30位
		if(!value) {
			callback();
		}
		setTimeout(() => {
			var regs = /^.{2,30}$/g
			if (!regs.test(value)) {
				callback(new Error('内容不少于2位且不能大于30位'));
			} else {
				if(!validators.SpecificWord(value)) {
					callback(new Error('不支持特殊符号'));
				} else {
					if(!validators.LetterNumber(value)) {
						callback(new Error('只支持英文、数字或下划线'));
					} else {
						callback();
					}
				}
			}
		}, 500);
	},

	
	isCodeNum:function (rule, value, callback) {// 验证编码号内容最长120位
		if(!value){
			callback();
		}
		setTimeout(() => {
			var regs = /^.{2,120}$/g
			if (!regs.test(value)) {
				callback(new Error('内容不少于2位且不能大于120位'));
			} else {
				if(!validators.SpecificWord(value)) {
					callback(new Error('不支持特殊符号'));
				} else {
					callback();
				}
			}
		}, 500);
	},

	isUserName:function (rule, value, callback) { //验证用户名
		if(!value) {
			callback(new Error('不能为空'));
		}
		setTimeout(() => {
			var regs = /^.{3,30}$/g
			if (!regs.test(value)) {
				callback(new Error('内容不少于3位且不能大于30位'));
			} else {
				if(!validators.SpecificWord(value)) {
					callback(new Error('不支持特殊符号'));
				} else {
					var targ = /^[a-zA-Z][a-zA-Z0-9_]*$/;
					if( !targ.test(value)){
						callback(new Error('只能由字母开头可含数字下划线'));
					} else {
						callback();
					}
				}
			}
		}, 500);		
	},
	

	isPhones:function (rule, value, callback) {//验证座机和手机号
		if(value && (!(/^((1[3456789]))\d{9}$|^0\d{2,3}-?\d{7,8}$/).test(value))) {
			callback(new Error('请输入有效的座机号或手机号'))
		} else {
			callback();
		}
	},

	isPhone:function (rule, value, callback) {//验证手机号
		if(value && (!(/^1[3456789]\d{9}$/).test(value))) {
			callback(new Error('请输入有效的手机号'))
		} else {
			callback();
		}
	},

	isEmail:function (rule, value, callback) { //验证电子邮箱
		if(value && (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(value))) {
			callback(new Error('邮箱地址不符合规范，xxx@xxx.xxx'))
		} else {
			callback();
		}
	},

	isNickname:function (rule, value, callback) {//验证人员姓名
	   if(value && (!validators.SpecificWord(value))) {
			callback(new Error('不支持特殊符号'));
		}
		setTimeout(() => {
			var regs = /^.{2,30}$/g
			if (!regs.test(value)) {
				callback(new Error('内容不少于2位且不能大于30位'));
			} else {
				if(validators.Numbers(value)) {
					callback(new Error('不只支持全数字'));
				} else {
					callback();
				}
			}
		}, 500);
	},

	isIdnumber:function (rule, value, callback) { //验证身份证号
		if(value && (!(/\d{17}[\d|x]|\d{15}/).test(value) || (value.length !== 15 && value.length !== 18))) {
			callback(new Error('请输入有效的身份证号'))
		} else {
			callback();
		}
	},

	isIpaddress:function (rule, value, callback) { //验证IP地址
		if(value && (!(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/).test(value))) {
			callback(new Error('IP地址不符合规范，xxx.xxx.xxx.xxx'))
		} else {
			callback();
		}
	},

	isMacaddress:function (rule, value, callback) { //验证MAC地址
		if(value && (!(/^[A-F0-9]{2}(-[A-F0-9]{2}){5}$|^[A-F0-9]{2}(:[A-F0-9]{2}){5}$/).test(value))) {
			callback(new Error('MAC地址不符合规范，xx-xx-xx-xx-xx-xx'))
		} else {
			callback();
		}
	},

	isAddress:function (rule, value, callback) {//验证通信地址
		if(!value){
			callback();
		}
		setTimeout(() => {
			var regs = /^.{3,250}$/g
			if (!regs.test(value)) {
				callback(new Error('内容不少于3位且不能大于250位'));
			} else {
				if(!validators.SpecificWord(value)) {
					callback(new Error('不支持特殊符号'));
				} else {
					callback();
				}
			}
		}, 500);
	},

	isZipcode:function (rule, value, callback) {//验证邮政编码
		if (value && (!(/^[0-9]{6}$/).test(value))) {
			callback(new Error('请输入有效的邮政编码'))
		} else {
			callback();
		}
	},

	isTelephone:function (rule, value, callback) {//验证电话号码/传真
		if (value && (!(/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/).test(value))) {
			callback(new Error('请输入有效的固定电话格式'));
		} else {
			callback();
		}
	},

	isLinkURL:function (rule, value, callback) { //验证连接地址
		if(!value) {
			callback();
		}
		setTimeout(() => {
			var regs = /^.{3,200}$/g
			if (!regs.test(value)) {
				callback(new Error('内容不少于3位且不能大于200位'));
			} else {
				if(!validators.URL(value)) {
					callback(new Error('输入有效的URL'));
				} else {
					callback();
				}
			}
		}, 500);
	},

	
	isFillTips:function (rule, value, callback) {//验证备注内容最长200位
		if(!value) {
			callback();
		}
		setTimeout(() => {
			var regs = /^.{3,200}$/g
			if (!regs.test(value)) {
				callback(new Error('内容不少于3位且不能大于200位'));
			} else {
				if(!validators.SpecificWord(value)) {
					callback(new Error('不支持特殊符号'));
				} else {
					callback();
				}
			}
		}, 500);
	},

	// 验证是否整数
	isInteger:function (rule, value, callback) {
		if (!value) {
			callback();
		}
		setTimeout(() => {
			if (!Number(value)) {
				callback(new Error('请输入数字'));
			} else {
				const re = /^[0-9]*[1-9][0-9]*$/;
				const rsCheck = re.test(value);
				if (!rsCheck) {
					callback(new Error('请输入正整数'));
				} else {
					callback();
				}
			}
		}, 1000);
	},
	 
	 
	// 验证是否是[0-1]的小数
	isDecimal:function (rule, value, callback) {
		if (!value) {
			callback(new Error('不可以为空'));
		}
		setTimeout(() => {
			if (!Number(value)) {
				callback(new Error('请输入数字'));
			} else {
				if (value < 0 || value > 1) {
					callback(new Error('请输入[0,1]之间的数字'));
				} else {
					callback();
				}
			}
		}, 1000);
	},

	// 带两位小数的数字
	isPriceNum:function (rule, value, callback) {
		if (!value) {
			callback();
		}
		setTimeout(() => {
			if(!validators.SpecificWord(value)) {
				callback(new Error('不支持特殊符号'));
			} else {
				if (!Number(value)) {
					callback(new Error('请输入数字'));
				} else {
					callback();
				}
			}
		}, 500);
	},

	// 验证端口是否在[0,65535]之间
	isPort:function (rule, value, callback) {
		if (!value) {
			return callback(new Error('不可以为空'));
		}
		setTimeout(() => {
			if (value == '' || typeof(value) == undefined) {
				callback(new Error('请输入端口值'));
			} else {
				const re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
				const rsCheck = re.test(value);
				if (!rsCheck) {
					callback(new Error('请输入在[0-65535]之间的端口值'));
				} else {
					callback();
				}
			}
		}, 1000);
	},


	isChinese:function (rule, value, callback) { //中文名称
		if(!value) {
			callback();
		} else {
			setTimeout(() => {
				var regs = /^.{1,200}$/g
				if (!regs.test(value)) {
					callback(new Error('内容不少于1位且不能大于200位'));
				} else {
					if(!validators.SpecificWord(value)) {
						callback(new Error('不支持特殊符号'));
					} else {
						callback();
					}
				}
			}, 500);
		}
	},

	isEnglish:function (rule, value, callback) { //英文名称
		if(!value) {
			callback();
		} else {
			setTimeout(() => {
				var regs = /^.{1,1000}$/g
				if (!regs.test(value)) {
					callback(new Error('内容不少于1位且不能大于1000位'));
				} else {
					if(!validators.SpecificWord(value)) {
						callback(new Error('不支持特殊符号'));
					} else {
						if(!validators.Mandarin(value)) {
							callback(new Error('不支持中文'));
						} else {
							callback();
						}
					}
				}
			}, 500);
		}
	},


	isChoosedata:function (rule, value, callback) {//放大镜选择验证
		// (value == '' || typeof(value) == undefined)
		if (typeof(value) == undefined || value == '' || value == null) {
			callback(new Error('请选择'));
		} else {
			callback();
		}
	},


	isCheckOldpassword:function (rule, value, callback) {//原始密码
		if (!value) {
			return callback(new Error('密码不能为空'));
		}
		setTimeout(() => {
			var regs = /^.{8,20}$/g
			if (!regs.test(value)) {
				callback(new Error('密码长度不能少于8位且不能大于20位'));
			} else {
				const regsStrong = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{8,20}$/;
				const rsChecks = regsStrong.test(value);
				if (!rsChecks) {
					callback(new Error('密码需包含字母、数字、特殊符号'));
				} else {
					callback();
				}
			}
		}, 500);
	},

	isValidatePass:function (rule, value, callback) {//新密码
		if (!value) {
			callback(new Error('请输入密码'));
		}
		setTimeout(() => {
			var regs = /^.{8,20}$/g
			if (!regs.test(value)) {
				callback(new Error('密码长度不能少于8位且不能大于20位'));
			} else {
				const regsStrong = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{8,20}$/;
				const rsChecks = regsStrong.test(value);
				if (!rsChecks) {
					callback(new Error('密码需包含字母、数字、特殊符号'));
				} else {
					callback();
				}
			}
		}, 500);
	},
    
};


export default validators