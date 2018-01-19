import utils from "./utils";
import config from "./config";
function callByArgs( func, args, global ) {
    return func.apply( global, args );
}
function handleItem (data) {
    let handleData = data ? utils.parse(data) : {};
    return handleData;
}
const store = {
    //存储localstorage的json中的key
    getKey: (error) => {
        const getDetail = (name) => {
            return error[name];
        }
        return [ 'msg', 'colNum', 'rowNum' ].filter( getDetail ).map( getDetail ).join( '@' ); 
    },
    getInfo: (key, errorObj) => {
        let source = store.getItem(key);
        if ( errorObj ) {
            let name = store.getKey( errorObj.msg );
            source[ name ] = {
                value: errorObj
            };
        }
        return utils.stringify( source );
    },
    //获取localstorage内容
    getItem: (key) => {
        return handleItem(localStorage.getItem(key));
    },
    setItem: (...args) => {
        return localStorage.setItem(args[0], callByArgs(store.getInfo, args, store))
    },
    clear: (key) => {
        return key ? localStorage.removeItem( key ) : localStorage.clear();
    }
}
const Storage = (supperclass) => class extends supperclass {
    constructor( options ) {
        super( options );
        this.setItem();
    }
    //得到元素值 获取元素值 若不存在则返回''
    getItem( key ) {
        return store.getItem( key );
    }
    // 设置一条localstorage或cookie
    setItem( errorObj ) {
        console.log(errorObj, 'error****')
        let _config = this.config;
        store.setItem( this.config.localKey, errorObj );
        return utils.stringify( errorObj );
    }
    clear( key ) {
        store.clear( key );
    }
}
export default Storage;