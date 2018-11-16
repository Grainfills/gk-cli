window.GK = window.GK || {};
(function (GK, $) {
    GK = $.extend(GK, {
        id: 0,
        getHost: function () {
            if (!String.prototype.startsWith) {
                String.prototype.startsWith = function (searchString, position) {
                    return this.substr(position || 0, searchString.length) === searchString;
                };
            }
            var host = document.location.host;
            if (host && host.indexOf(".") !== -1 && host !== '127.0.0.1') {
                if (host.startsWith('test.')) {
                    return 'https://test' + host.substring(host.indexOf('.')) + '/';
                }
                return 'https://www' + host.substring(host.indexOf('.')) + '/';
            }
            return 'https://test.gorkor.com/';
        },
        toast: function (message, callback, timeout) {
            timeout = timeout || 1.8;
            var toast = document.getElementById("toast");
            if (toast === null) {
                var toastHTML = '<div id="toast">' + message + '</div>';
                document.body.insertAdjacentHTML('beforeEnd', toastHTML);
                toast = document.getElementById("toast");
            }

            if (toast.className === 'showing') {
                return;
            }

            // 变换
            toast.className = 'showing';
            toast.style.marginLeft = (document.body.clientWidth - toast.clientWidth) / 2.0 + 'px';
            toast.style.webkitAnimationDuration = timeout + 's';
            toast.innerHTML = message;
            setTimeout(function () {
                toast.style.WebkitAnimation = '';
                toast.className = '';
                toast.parentNode.removeChild(toast);
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }, 1000 * (timeout - 0.5));
        },
        loadScript: function (src, callback) {
            var script = document.createElement('script');
            script.async = true;
            script.src = src;
            if (callback && typeof  callback === 'function') {
                script.onload = callback;
            }
            document.getElementsByTagName("head")[0].appendChild(script);
        },
        getUrlParam: function (key) {
            var url = document.URL;
            var params = {};
            url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
                params[key] = value;
            });
            return (key && params[key]) || '';
        },
        redirectTo: function (url) {
            document.location = 'https://' + document.location.host + '/' + url;
        },
        isWX: function () {
            var u = navigator.userAgent;
            return /micromessenger/i.test(u);
        },
        isAndroid: function () {
            var u = navigator.userAgent;
            return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        },
        isAndroidGKAPPGreaterThan: function (versionCode, callback) {
            if (isNaN(versionCode)) {
                if ($.isFunction(callback)) {
                    callback(false);
                }
                return;
            }
            GK.plus.ready(function () {
                if ($.isFunction(callback)) {
                    callback(GK.isGKAPP() && GK.isAndroid() && GK.plus.versionInfo['0'] && GK.plus.versionInfo['0'] >= versionCode);
                }
            });
        },
        isAndroidGKAPPLessThan: function (versionCode, callback) {
            if (isNaN(versionCode)) {
                if ($.isFunction(callback)) {
                    callback(false);
                }
                return;
            }
            GK.plus.ready(function () {
                if ($.isFunction(callback)) {
                    callback(GK.isGKAPP() && GK.isAndroid() && GK.plus.versionInfo['0'] && GK.plus.versionInfo['0'] < versionCode);
                }
            });
        },
        isiOS: function () {
            var u = navigator.userAgent;
            return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        },
        isiOSGKAPPGreaterThan: function (versionCode, callback) {
            if (isNaN(versionCode)) {
                if ($.isFunction(callback)) {
                    callback(false);
                }
                return;
            }
            GK.plus.ready(function () {
                if ($.isFunction(callback)) {
                    callback(GK.isGKAPP() && GK.isiOS() && GK.plus.versionInfo['1'] && GK.plus.versionInfo['1'] >= versionCode);
                }
            });
        },
        isiOSGKAPPLessThan: function (versionCode, callback) {
            if (isNaN(versionCode)) {
                if ($.isFunction(callback)) {
                    callback(false);
                }
                return;
            }
            GK.plus.ready(function () {
                if ($.isFunction(callback)) {
                    callback(GK.isGKAPP() && GK.isiOS() && GK.plus.versionInfo['1'] && GK.plus.versionInfo['1'] < versionCode);
                }
            });
        },
        isHW: function () {
            var u = navigator.userAgent;
            return !!u.match(/huawei|honor/ig);
        },
        isGKAPP: function () {
            if (GK.isiOS() && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.NativeMethod) {
                return true;
            }
            if (GK.isAndroid() && window.NativeMethod) {
                return true;
            }
            return false;
        },
        plus: {
            enableChecked: false,
            versionInfo: {},
            callNativeError: function (result) {
                GK.plus.toast(result);
            },
            callNativeSuccess: function (result) {
                // do nothing
            },
            callNativeDetail: function (type, data, successCallback, errorCallback) {
                GK.id = GK.id + 1;
                var successCallbackName = "GK.plus.callNativeSuccess";
                var successName = 'successCallback' + GK.id;
                if ($.isFunction(successCallback)) {
                    GK.plus[successName] = function (result) {
                        successCallback(result);
                        if (type !== 'submit') {
                            GK.plus[successName] = null;
                        }
                    };
                    successCallbackName = 'GK.plus.' + successName;
                }
                var errorCallbackName = 'GK.plus.callNativeError';
                var errorName = 'errorCallback' + GK.id;
                if ($.isFunction(errorCallback)) {
                    GK.plus[errorName] = function (result) {
                        errorCallback(result);
                        GK.plus[errorName] = null;
                    };
                    errorCallbackName = 'GK.plus.' + errorName;
                }
                var nativeMethod = null;
                if (GK.isiOS()) {
                    nativeMethod = window.webkit.messageHandlers.NativeMethod;
                    nativeMethod.postMessage({
                        type: type,
                        data: data,
                        successCallback: successCallbackName,
                        errorCallback: errorCallbackName
                    });
                } else if (GK.isAndroid()) {
                    nativeMethod = window.NativeMethod;
                    nativeMethod.postMessage(JSON.stringify({
                        type: type,
                        data: data,
                        successCallback: successCallbackName,
                        errorCallback: errorCallbackName
                    }));
                }
                if (type === 'version') {
                    setTimeout(function () {
                        if (GK.plus[successName] && GK.plus[errorName]) {
                            GK.plus[errorName]('调用失败, Error: 客户端无响应');
                        }
                    }, 1000);
                }
            },
            callNative: function (type, data, successCallback, errorCallback) {
                if (!GK.isGKAPP()) {
                    if (type === 'toast') {
                        GK.toast(data['message'], successCallback);
                    } else if (type === 'version') {
                        if ($.isFunction(errorCallback)) {
                            errorCallback();
                        }
                    } else if (type === 'gkalert') {
                        window.alert(data['message']);
                        if ($.isFunction(successCallback)) {
                            successCallback();
                        }
                    } else if (type === 'gkconfirm') {
                        if (window.confirm(data['message'])) {
                            if ($.isFunction(successCallback)) {
                                successCallback();
                            }
                        }
                    } else if (type === 'gkprompt') {
                        var result = window.prompt(data['title'], data['message'] || '');
                        if (result) {
                            if ($.isFunction(successCallback)) {
                                successCallback(result);
                            }
                        }
                    } else if (type === 'title') {
                        document.title = data.title;
                    } else if (type === 'submit' || type === 'wxpay' || type === 'uid' || type === 'version') {
                        // do nothing
                    } else if (type === 'webview') {
                        document.location.href = data.url;
                    } else {
                        GK.toast("过客APP外部无法调用混合开发API", errorCallback);
                    }
                    return;
                }

                if (type === 'version') {
                    GK.plus.callNativeDetail(type, data, successCallback, errorCallback);
                    return;
                }

                GK.plus.ready(function () {
                    if (type === 'title' || type === 'submit' || type === 'webview') {
                        if ((GK.plus.versionInfo['0'] && GK.plus.versionInfo['0'] < 62) || (GK.plus.versionInfo['1'] && GK.plus.versionInfo['1'] < 20)) {
                            return;
                        }
                    }
                    if (type === 'uid') {
                        if ((GK.plus.versionInfo['0'] && GK.plus.versionInfo['0'] < 77) || (GK.plus.versionInfo['1'] && GK.plus.versionInfo['1'] < 23)) {
                            return;
                        }
                    }
                    if (type === 'wxpay') {
                        if ((GK.plus.versionInfo['0'] && GK.plus.versionInfo['0']) < 77 || GK.plus.versionInfo['1']) {
                            return;
                        }
                    }
                    GK.plus.callNativeDetail(type, data, successCallback, errorCallback);
                });
            },
            alert: function (data, callback) {
                GK.plus.callNative("gkalert", data, callback, function () {
                    window.alert(data['message']);
                    if ($.isFunction(callback)) {
                        callback();
                    }
                });
            },
            confirm: function (data, callback) {
                GK.plus.callNative("gkconfirm", data, callback, function () {
                    if (window.confirm(data['message'])) {
                        if ($.isFunction(callback)) {
                            callback();
                        }
                    }
                });
            },
            prompt: function (data, callback) {
                GK.plus.callNative("gkprompt", data, function (result) {
                    if (result) {
                        if ($.isFunction(callback)) {
                            callback(decodeURIComponent(escape(window.atob(result))));
                        }
                    }
                }, function () {
                    var result = window.prompt(data['title'], data['message'] || '');
                    if (result) {
                        if ($.isFunction(callback)) {
                            callback(result);
                        }
                    }
                });
            },
            toast: function (message, callback, errorCallback) {
                GK.plus.callNative("toast", {
                    message: message
                }, callback, errorCallback);
            },
            input: function (data, callback, errorCallback) {
                GK.plus.callNative("input", data, function (result) {
                    if (result) {
                        if ($.isFunction(callback)) {
                            callback(decodeURIComponent(escape(window.atob(result))));
                        }
                    }
                }, errorCallback);
            },
            share: function (data, callback, errorCallback) {
                GK.plus.callNative("share", data, callback, errorCallback);
            },
            version: function (callback, errorCallback) {
                GK.plus.callNative("version", {}, callback, errorCallback);
            },
            letter: function (data, callback, errorCallback) {
                GK.plus.callNative("letter", data, callback, errorCallback);
            },
            title: function (title, callback, errorCallback) {
                document.title = title;
                GK.plus.callNative("title", {
                    title: title
                }, callback, errorCallback);
            },
            submit: function (data, callback, errorCallback) {
                GK.plus.callNative("submit", data, callback, errorCallback);
            },
            webview: function (url, callback, errorCallback) {
                GK.plus.callNative("webview", {
                    url: url
                }, callback, errorCallback);
            },
            read: function (data, callback, errorCallback) {
                GK.plus.callNative("read", data, callback, errorCallback);
            },
            wxpay: function (data, callback, errorCallback) {
                GK.plus.callNative("wxpay", data, callback, errorCallback);
            },
            uid: function (callback, errorCallback) {
                GK.plus.callNative("uid", {}, callback, errorCallback);
            },
            ready: function (callback) {
                if (!GK.isGKAPP()) {
                    if ($.isFunction(callback)) {
                        callback();
                    }
                    return;
                }
                // 版本检测
                if (GK.plus.enableChecked) {
                    if ($.isFunction(callback)) {
                        callback();
                    }
                    return;
                }
                GK.plus.version(function (result) {
                    result = JSON.parse(result);
                    if (result && result['versionCode'] && (result['versionType'] === '0' || result['versionType'] === '1')) {
                        GK.plus.versionInfo[result['versionType']] = parseInt(result['versionCode']);
                    }
                    if ($.isFunction(callback)) {
                        callback();
                    }
                    GK.plus.enableChecked = true;
                });
            }
        }
    });
})(GK, $);