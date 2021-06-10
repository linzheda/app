import axios from 'axios'
import store from '../store'
import {Dialog, Toast} from 'vant';
import utils from "@/utils/utils";


// 创建axios实例
const instance = axios.create({
    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},//设置以表单的形式提交  避免发两次请求
    timeout: 15000 // 请求超时时间
});
// request拦截器
instance.interceptors.request.use(config => {
    // 让每个请求携带自定义token 请根据实际情况自行修改
    const token = store.getters.token;
    config.headers.common['Authorization'] = token;
    return config;
}, error => {
    console.log(error); // for debug
    Promise.reject(error);
});

// respone拦截器
instance.interceptors.response.use(
    response => {
        //code为非200是抛错 可结合自己业务进行修改
        const res = response;
        if (res.status !== 200) {
            // 401:未登录;
            if (res.status === 401 || res.status === 403) {
                Dialog.alert({
                    title: '温馨提示',
                    message: res.message
                }).then(() => {
                    location.reload();
                });
            }
            return Promise.reject(response);
        } else {
            if (utils.isNotEmpty(response.headers['authorization'])) {
                store.dispatch("updateToken", response.headers['authorization']);
            }
            return response.data;
        }
    },
    error => {
        if (error.response.status === 401 || error.response.status === 403) {
            Dialog.alert({
                title: '温馨提示',
                message: error
            }).then(() => {
                store.dispatch('loginOut', 0).then(() => {
                    location.reload();// 为了重新实例化vue-router对象 避免bug
                });
            });
        } else {
            Toast({
                type: 'fail',
                message: error,
            });
        }
        console.log('err' + error);// for debug
        return Promise.reject(error);
    }
);

//转换为键值对的形式
function transformRequest(data) {
    let str = [];
    for (let key in data) {
        let value = utils.isEmpty(data[key]) ? '' : data[key];
        if (typeof value == 'string') {
            value = value.trim();
        }
        str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
    return str.join("&");
}

//获取所有配置的url
let result = {};
for (let key in process.env) {
    if (key.endsWith('_URL')) {
        let newkey = key.replace("VUE_APP_", '').replace("_URL", '');
        newkey = newkey.toLocaleLowerCase();
        result[newkey] = process.env[key];
        if (newkey === 'base' && process.env.NODE_ENV === 'dev') {
            result[newkey] = '/api/';
        }
    }
}
const urlApi = result;


const get = (url, params = {}, isCheck = true, baseUrl = urlApi['base'], isTransform = true) => {
    return doRequest('get', url, params, isCheck, baseUrl, isTransform)
};

const post = (url, params = {}, isCheck = true, baseUrl = urlApi['base'], isTransform = true) => {
    return doRequest('post', url, params, isCheck, baseUrl, isTransform)
};

const postFile = (url, params = {}, isCheck = true, baseUrl = urlApi['base'], isTransform = true) => {
    return doRequest('file', url, params, isCheck, baseUrl, isTransform);
}


function doRequest(way = 'post', url, params = {}, isCheck = true, baseUrl = urlApi['base'], isTransform = true) {
    url = baseUrl + url;
    //转换为键值对的形式
    if (isTransform) {
        params = transformRequest(params)
    }
    //检查约定的状态码
    if (isCheck) {
        return request(way, url, params).then(res => {
            if (res.code != 200) {
                Toast({
                    type: 'fail',
                    message: res.msg,
                    onClose: () => {
                        return Promise.reject(res);
                    },
                });
            } else {
                return res;
            }
        });
    } else {
        return request(way, url, params);
    }
}

async function request(way, url, params) {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    };
    switch (way) {
        case 'post':
            return instance.post(url, params);
        case 'get':
            return instance.get(url, params);
        case 'file':
            return instance.post(url, params, config);
    }
}

export {
    get,
    post,
    postFile,
    urlApi
}

export default {
    install(Vue) {
        Vue.http = {get, post, postFile, urlApi};
        Vue.prototype.$http = Vue.http;
    }
};

