/*
* @ config 用户配置
*/
import utils from './utils.js';
class Config  {
	constructor(options) {
		this.config = {
			localKey: 'hunter',
			url: 'http://lxh.error.brandwisdom.cn/error.gif?', //上报错误地址
			delay: 3000, //延迟上报时间
			repeat: 5 //重复五次不上报
		}
		this.config = utils.assignObject( this.config, options );
	}
	get (name) {
		return this.config[name];
	}
	set (name, value) {
		this.config[ name ] = value;
		return this.config[ name ];
	}
}
export default Config;