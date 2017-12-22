(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.hunter = factory());
}(this, (function () {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var utils = {
    assignObject: function assignObject(obj1, obj2) {
        for (var name in obj2) {
            if (obj2.hasOwnProperty(name)) {
                obj1[name] = obj2[name];
            }
        }
        return obj1;
    },
    stringify: function stringify(obj) {
        if (window.JSON && window.JSON.stringify) {
            return JSON.stringify(obj);
        }
        var t = typeof obj === "undefined" ? "undefined" : _typeof(obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        } else {
            // recurse array or object
            var n,
                v,
                json = [],
                arr = obj && obj.constructor == Array;

            // fix.
            var self = arguments.callee;

            for (n in obj) {
                if (obj.hasOwnProperty(n)) {

                    v = obj[n];
                    t = typeof v === "undefined" ? "undefined" : _typeof(v);
                    if (obj.hasOwnProperty(n)) {
                        if (t == "string") v = '"' + v + '"';else if (t == "object" && v !== null)
                            // v = jQuery.stringify(v);
                            v = self(v);
                        json.push((arr ? "" : '"' + n + '":') + String(v));
                    }
                }
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    },
    parse: function parse(str) {
        str = str != 'undefined' ? str : {};
        return window.JSON && window.JSON.parse ? JSON.parse(str) : new Function('return ' + str)();
    },
    getPlatType: function getPlatType() {
        try {
            document.createEvent("TouchEvent");
            return 'Mobile';
        } catch (e) {
            return 'PC';
        }
    },
    getSystemInfo: function getSystemInfo() {
        var scr = window.screen;
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
    typeDecide: function typeDecide(o, type) {
        return Object.prototype.toString.call(o) === "[object " + type + "]";
    },
    toArray: function toArray$$1(arr) {
        return Array.prototype.slice.call(arr);
    },
    serializeObj: function serializeObj(obj) {
        var parames = '';
        Object.keys(obj).forEach(function (name) {
            if (utils.typeDecide(obj[name], 'Object')) {
                parames += utils.stringify(obj[name]);
            } else {
                parames += obj[name];
            }
        });
        return encodeURIComponent(parames);
    },
    //空回调
    noop: function noop() {}
};

/*
* @ config 用户配置
*/
var Config = function () {
	function Config(options) {
		classCallCheck(this, Config);

		this.config = {
			localKey: 'hunter',
			url: 'http://lxh.error.brandwisdom.cn/error.gif?', //上报错误地址
			delay: 3000, //延迟上报时间
			repeat: 5 //重复五次不上报
		};
		this.config = utils.assignObject(this.config, options);
	}

	createClass(Config, [{
		key: 'get',
		value: function get$$1(name) {
			return this.config[name];
		}
	}, {
		key: 'set',
		value: function set$$1(name, value) {
			this.config[name] = value;
			return this.config[name];
		}
	}]);
	return Config;
}();

function callByArgs(func, args, global) {
    return func.apply(global, args);
}
function handleItem(data) {
    var handleData = data ? utils.parse(data) : {};
    return handleData;
}
var store = {
    //存储localstorage的json中的key
    getKey: function getKey(error) {
        var getDetail = function getDetail(name) {
            return error[name];
        };
        return ['msg', 'colNum', 'rowNum'].filter(getDetail).map(getDetail).join('@');
    },
    getInfo: function getInfo(key, errorObj) {
        var source = store.getItem(key);
        if (errorObj) {
            var name = store.getKey(errorObj.msg);
            source[name] = {
                value: errorObj
            };
        }
        return utils.stringify(source);
    },
    //获取localstorage内容
    getItem: function getItem(key) {
        return handleItem(localStorage.getItem(key));
    },
    setItem: function setItem() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return localStorage.setItem(args[0], callByArgs(store.getInfo, args, store));
    },
    clear: function clear(key) {
        return key ? localStorage.removeItem(key) : localStorage.clear();
    }
};
var Storage$1 = function Storage(supperclass) {
    return function (_supperclass) {
        inherits(_class, _supperclass);

        function _class(options) {
            classCallCheck(this, _class);

            var _this = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, options));

            _this.setItem();
            return _this;
        }
        //得到元素值 获取元素值 若不存在则返回''


        createClass(_class, [{
            key: "getItem",
            value: function getItem(key) {
                return store.getItem(key);
            }
            // 设置一条localstorage或cookie

        }, {
            key: "setItem",
            value: function setItem(errorObj) {
                var _config = this.config;
                store.setItem(this.config.localKey, errorObj);
                return utils.stringify(errorObj);
            }
        }, {
            key: "clear",
            value: function clear(key) {
                store.clear(key);
            }
        }]);
        return _class;
    }(supperclass);
};

var Report$1 = function Report(supperclass) {
    return function (_supperclass) {
        inherits(_class, _supperclass);

        function _class(options) {
            classCallCheck(this, _class);

            var _this = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, options));

            _this.errorQueue = [];
            _this.repeatList = {};
            ['warn', 'error'].forEach(function (type, index) {
                _this[type] = function (msg) {
                    return _this.handle(msg, type, index);
                };
            });
            return _this;
        }

        createClass(_class, [{
            key: 'request',
            value: function request(url, cb) {
                url = url.slice(0, 8180);
                var img = new window.Image();
                img.onload = cb;
                img.src = url;
            }
        }, {
            key: 'report',
            value: function report(cb) {
                var _this2 = this;

                var url = this.config.url;
                var key = this.config.localKey;
                var curQueue = this.getItem(key);
                // 合并上报
                var parames = utils.serializeObj(curQueue);
                url += parames;
                this.request(url, function () {
                    if (cb) {
                        cb.call(_this2);
                    }
                });

                return url;
            }
            //重复错误不收集

        }, {
            key: 'repeat',
            value: function repeat(error) {
                var rowNum = error.rowNum || '';
                var colNum = error.colNum || '';
                var repeatName = error.msg + rowNum + colNum;
                this.repeatList[repeatName] = this.repeatList[repeatName] ? this.repeatList[repeatName] + 1 : 1;
                return this.repeatList[repeatName] > this.config.repeat;
            }
            //收集错误到localstorage

        }, {
            key: 'catchError',
            value: function catchError(err) {
                this.setItem(err);
                if (this.repeat(err)) {
                    return false;
                }
                return true;
            }
            // 发送

        }, {
            key: 'send',
            value: function send(cb) {
                var _this3 = this;

                var callback = cb || utils.noop;
                var delay = this.config.delay;
                setTimeout(function () {
                    _this3.report(callback);
                }, delay);
            }
            //手动上报

        }, {
            key: 'handle',
            value: function handle(msg, type, level) {
                var _this4 = this;

                var key = this.config.localKey;
                var errorMsg = {
                    msg: msg,
                    level: level
                };
                errorMsg = utils.assignObject(utils.getSystemInfo(), errorMsg);
                if (this.catchError(errorMsg)) {
                    this.send(function () {
                        _this4.clear(key);
                    });
                }
                return errorMsg;
            }
        }]);
        return _class;
    }(supperclass);
};

var hunter = function (_report) {
	inherits(hunter, _report);

	function hunter(options) {
		classCallCheck(this, hunter);

		var _this = possibleConstructorReturn(this, (hunter.__proto__ || Object.getPrototypeOf(hunter)).call(this, options));

		_this.rewriteError();
		return _this;
	}

	createClass(hunter, [{
		key: 'rewriteError',
		value: function rewriteError() {
			var _this2 = this,
			    _arguments = arguments;

			var defaultOnerror = window.onerror || utils.noop;
			window.onerror = function (msg, url, line, col, error) {
				//有些浏览器没有col
				col = col || window.event && window.event.errorCharacter || 0;
				var reportMsg = msg;
				if (error && error.stack) {
					reportMsg = _this2.handleErrorStack(error);
				} else {
					//不存stack的话，对reportMsg做下处理 
					var ext = [];
					var f = _arguments.callee.caller,
					    // jshint ignore:line
					c = 3;
					//这里只拿三层堆栈信息
					while (f && --c > 0) {
						ext.push(f.toString());
						if (f === f.caller) {
							break; //如果有环
						}
						f = f.caller;
					}
					if (ext.length > 0) {
						reportMsg += '@' + ext.join(',');
					}
				}
				if (utils.typeDecide(reportMsg, "Event")) {
					reportMsg += reportMsg.type ? "--" + reportMsg.type + "--" + (reportMsg.target ? reportMsg.target.tagName + "::" + reportMsg.target.src : "") : "";
				}
				if (reportMsg) {
					_this2.error({
						msg: reportMsg,
						rowNum: line,
						colNum: col,
						targetUrl: url
					});
				}
				defaultOnerror.call(null, msg, url, line, col, error);
			};
		}
		// 处理onerror返回的error.stack

	}, {
		key: 'handleErrorStack',
		value: function handleErrorStack(error) {
			var stackMsg = error.stack;
			var errorMsg = error.toString();
			if (errorMsg) {
				if (stackMsg.indexOf(errorMsg) === -1) {
					stackMsg += '@' + errorMsg;
				}
			} else {
				stackMsg = '';
			}
			return stackMsg;
		}
	}]);
	return hunter;
}(Report$1(Storage$1(Config)));

return hunter;

})));
