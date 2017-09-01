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
                parames +=  utils.stringify( obj[ name ] );
            } else {
                parames +=  obj[ name ]; 
            }
        } );
        return encodeURIComponent(parames);
    },
    //空回调
    noop: function () {}
}

export default utils;