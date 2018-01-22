const utils = {
	assignObject: function ( obj1, obj2 ) {
	    for ( let name in obj2 ) {
	        if ( obj2.hasOwnProperty( name ) ) {
	            obj1[ name ] = obj2[ name ];
	        }
	    }
	    return obj1;
	},
    stringify: function ( obj ) {
        if ( window.JSON && window.JSON.stringify ) {
            return JSON.stringify( obj );
        }
        var t = typeof ( obj );
        if ( t != "object" || obj === null ) {
            // simple data type
            if ( t == "string" ) obj = '"' + obj + '"';
            return String( obj );
        } else {
            // recurse array or object
            var n, v, json = [],
                arr = ( obj && obj.constructor == Array );

            // fix.
            var self = arguments.callee;

            for ( n in obj ) {
                if ( obj.hasOwnProperty( n ) ) {

                    v = obj[ n ];
                    t = typeof ( v );
                    if ( obj.hasOwnProperty( n ) ) {
                        if ( t == "string" ) v = '"' + v + '"';
                        else if ( t == "object" && v !== null )
                            // v = jQuery.stringify(v);
                            v = self( v );
                        json.push( ( arr ? "" : '"' + n + '":' ) + String( v ) );
                    }
                }
            }
            return ( arr ? "[" : "{" ) + String( json ) + ( arr ? "]" : "}" );
        }
    },
	parse: function ( str ) {
        str = str != 'undefined' ? str : {};
        return window.JSON && window.JSON.parse ? JSON.parse( str ) : new Function( 'return ' + str )();
    },
    getPlatType: () => {
        try {
            document.createEvent( "TouchEvent" );
            return 'Mobile';
        } catch ( e ) {
            return 'PC';
        }
    },
    getSystemInfo: function () {
        let scr = window.screen;
        return {
            userAgent: window.navigator.userAgent,
            currentUrl: window.location.href,
            timestamp: +new Date() + Math.random(),
            projectType: utils.getPlatType(),
            title: document.title,
            screenSize: scr.width + "x" + scr.height,
            referer: document.referrer ? document.referrer.toLowerCase() : '',
            host: window.location.protocol + '//' + window.location.hostname,
            env: window.location.hostname.split('.')[0]
        };
    },
    typeDecide: function ( o, type ) {
        return Object.prototype.toString.call( o ) === "[object " + type + "]";
    },
    toArray: (arr) => {
        return Array.prototype.slice.call( arr );
    },
    serializeObj: function ( obj ) {
        let parames = '';
        Object.keys( obj ).forEach( name => {
            if ( utils.typeDecide( obj[ name ], 'Object' ) ) {
                parames +=  utils.stringify( obj[ name ] ) + ',';
            } else {
                parames +=  obj[ name ] + ','; 
            }
        } );
        return encodeURIComponent(parames);
    },
    getErrorInfo: function(ex){
        if (typeof ex.stack === 'undefined' || !ex.stack) {
            return {

                'msg': ex.name + ':' + ex.message,
                'level': 4
            };
        }else{
            var chrome = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
                gecko = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i,
                winjs = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,

                // Used to additionally parse URL/line/column from eval frames
                geckoEval = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
                chromeEval = /\((\S*)(?::(\d+))(?::(\d+))\)/,

                lines = ex.stack.split('\n'),
                stack = [],
                submatch,
                parts,
                element,
                reference = /^(.*) is undefined$/.exec(ex.message);
            if ((parts = chrome.exec(lines[1]))) {
                var isNative = parts[2] && parts[2].indexOf('native') === 0; // start of line
                var isEval = parts[2] && parts[2].indexOf('eval') === 0; // start of line
                if (isEval && (submatch = chromeEval.exec(parts[2]))) {
                    // throw out eval line/column and use top-most line/column number
                    parts[2] = submatch[1]; // url
                    parts[3] = submatch[2]; // line
                    parts[4] = submatch[3]; // column
                }
                element = {
                    'url': !isNative ? parts[2] : null,
                    'line': parts[3] ? +parts[3] : null,
                    'column': parts[4] ? +parts[4] : null
                };
            } else if ( parts = winjs.exec(lines[1]) ) {
                element = {
                    'url': parts[2],
                    'line': +parts[3],
                    'column': parts[4] ? +parts[4] : null
                };
            } else if ((parts = gecko.exec(lines[1]))) {
                var isEval = parts[3] && parts[3].indexOf(' > eval') > -1;
                if (isEval && (submatch = geckoEval.exec(parts[3]))) {
                    // throw out eval line/column and use top-most line number
                    parts[3] = submatch[1];
                    parts[4] = submatch[2];
                    parts[5] = null; // no column when eval
                } else if (i === 0 && !parts[5] && typeof ex.columnNumber !== 'undefined') {
                    // FireFox uses this awesome columnNumber property for its top frame
                    // Also note, Firefox's column number is 0-based and everything else expects 1-based,
                    // so adding 1
                    // NOTE: this hack doesn't work if top-most frame is eval
                    stack[0].column = ex.columnNumber + 1;
                }
                element = {
                    'url': parts[3],
                    'line': parts[4] ? +parts[4] : null,
                    'column': parts[5] ? +parts[5] : null
                };
            } 

            return {
                'msg': ex.name + ':' + ex.message,
                'rowNum': element.line,
                'colNum': element.column,
                'targetUrl': element.url,
                'level': 4
            };
        }
    },
    //空回调
    noop: function () {}
}

export default utils;