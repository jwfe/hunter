import utils from "./utils";
import store from './store';
let Report = (supperclass) => class extends supperclass {
	constructor(options) {
		super( options );
        this.errorQueue = [];
        this.repeatList = {};
        [ 'warn', 'error' ].forEach( ( type, index ) => {
            this[ type ] = ( msg ) => {
                return this.handle( msg, type, index );
            };
        });
	}
	request( url, cb ) {
        let img = new window.Image();
        img.onload = cb;
        img.src = url;
    }
    report( cb ) {
        let url = this.config.url;
        let key = this.config.localKey;
        let curQueue = this.getItem(key);
        // 合并上报
        let parames = utils.serializeObj(curQueue);
        url += parames;
        this.request( url, () => {
            if ( cb ) {
                cb.call( this );
            }
        } );

        return url;
    }
	//重复错误不收集
	repeat( error ) {
        let rowNum = error.rowNum || '';
        let colNum = error.colNum || '';
        let repeatName = error.msg + rowNum + colNum;
        this.repeatList[ repeatName ] = this.repeatList[ repeatName ] ? this.repeatList[ repeatName ] + 1 : 1;
        return this.repeatList[ repeatName ] > this.config.repeat;
    }
	//收集错误到localstorage
	catchError (err) {
        this.setItem(err)
		if(this.repeat(err)) {
			return false;
		}
        return true;
	}
	// 发送
    send( cb ) {
        let callback = cb || utils.noop;
        let delay =  this.config.delay;
        setTimeout( () => {
            this.report( callback );
        }, delay );

    }
	//手动上报
	handle (msg, type, level) {
        let key = this.config.localKey;
		let errorMsg = {
		    msg: msg,
		    level: level
		};
        errorMsg = utils.assignObject( utils.getSystemInfo(), errorMsg );
		if ( this.catchError( errorMsg ) ) {
		    this.send(() => {
                this.clear(key)
            });
		}
		return errorMsg;
	}
}
export default Report;