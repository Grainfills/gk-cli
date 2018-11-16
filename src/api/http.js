import axios from 'axios'
import qs from 'qs'

axios.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
});

axios.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.reject(error)
});

function checkStatus(res, successCallback, errorCallback) {
    // loading
    let result = res && res.data;
    // 如果http状态码正常，则直接返回数据
    if (result && result.status === 1) {
        if (successCallback && typeof successCallback === 'function') {
            successCallback(result.result);
        }
    } else {
        if (result.errorCode === 0) {
            GK.plus.toast(result.message);
        }
        if (errorCallback && typeof errorCallback === 'function') {
            errorCallback(result);
        }
    }
}

function checkCode(res) {
    let code = res && res.status;
    if (code === 500) {
        GK.plus.toast('对不起, 服务器异常');
    } else if (code === 504) {
        GK.plus.toast('对不起, 请求已超时');
    } else if (code === 400) {
        GK.plus.toast('对不起, 请求参数错误');
    } else if (code === 403) {
        GK.plus.toast('对不起, 登录已过期', function () {
            document.location.href = GK.getHost() + 'h5/login.html?redirect_uri=' + encodeURIComponent(document.location.href);
        });
    } else if (code === 401) {
        GK.plus.toast('对不起, 用户信息不完善', function () {
            document.location.href = GK.getHost() + 'h5/fix.html?redirect_uri=' + encodeURIComponent(document.location.href)
        });
    } else {
        // GK.plus.toast('对不起, 未知异常');
    }
}

export default {
    $http: function (type, url, data, successCallback, errorCallback) {
        type = type || 'GET';
        if (url.indexOf('?') !== -1) {
            url = url + '&r=' + Math.random();
        } else {
            url = url + '?r=' + Math.random();
        }
        let baseURL = process.env.baseURL;
        if (data['_baseURL']) {
            baseURL = data['_baseURL'];
            data['_baseURL'] = null;
        }
        axios({
            method: type,
            baseURL: baseURL,
            url,
            data: qs.stringify(data),
            timeout: 30000,
            withCredentials: true,
            headers: {
                'Client-Type': 0,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(res => {
            let code = res.status;
            if (code === 200) {
                checkStatus(res, successCallback, errorCallback);
            } else {
                checkCode(res);
            }
        }).catch(error => {
            checkCode(error.response);
        });
    },
    get(url, data, successCallback, errorCallback) {
        this.$http('GET', url, data, successCallback, errorCallback);
    },
    post(url, data, successCallback, errorCallback) {
        this.$http('POST', url, data, successCallback, errorCallback);
    },
    put(url, data, successCallback, errorCallback) {
        this.$http('PUT', url, data, successCallback, errorCallback);
    },
    delete(url, data, successCallback, errorCallback) {
        this.$http('DELETE', url, data, successCallback, errorCallback);
    }
}