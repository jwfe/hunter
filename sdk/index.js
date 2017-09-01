import utils from './utils';
import report from './report';
import config from './config';
import store from './store';

class hunter extends report(store(config)) {
	constructor(options) {
		super(options);
		this.rewriteError();
	}
	rewriteError () {
		let defaultOnerror = window.onerror || utils.noop;
		window.onerror = (msg, url, line, col, error) => {
			//有些浏览器没有col
			col = col || ( window.event && window.event.errorCharacter ) || 0;
			var reportMsg = msg;
			if ( error && error.stack ) {
			    reportMsg = this.handleErrorStack( error );
			} else {
			    //不存stack的话，对reportMsg做下处理 
			    var ext = [];
			    var f = arguments.callee.caller, // jshint ignore:line
			        c = 3;
			    //这里只拿三层堆栈信息
			    while ( f && ( --c > 0 ) ) {
			        ext.push( f.toString() );
			        if ( f === f.caller ) {
			            break; //如果有环
			        }
			        f = f.caller;
			    }
			    if( ext.length > 0 ){
			        reportMsg += '@' + ext.join( ',' );
			    }
			}
			if ( utils.typeDecide( reportMsg, "Event" ) ) {
			    reportMsg += reportMsg.type ?
			        ( "--" + reportMsg.type + "--" + ( reportMsg.target ?
			            ( reportMsg.target.tagName + "::" + reportMsg.target.src ) : "" ) ) : "";
			}
			if( reportMsg ){
			    this.error( {
			        msg: reportMsg,
			        rowNum: line,
			        colNum: col,
			        targetUrl: url
				} );
			}
			defaultOnerror.call( null, msg, url, line, col, error );
		}
	}
	// 处理onerror返回的error.stack
	handleErrorStack( error ) {
	    let stackMsg = error.stack;
	    let errorMsg = error.toString();
	    if( errorMsg ){
	        if ( stackMsg.indexOf( errorMsg ) === -1 ) {
	            stackMsg += '@' + errorMsg;
	        }
	    }else{
	        stackMsg = '';
	    }
	    return stackMsg;
	}
}
export default hunter;