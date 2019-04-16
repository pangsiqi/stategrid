import Vue from 'vue'
import router from '../router'
import axios  from 'axios' 
// import { Loading } from 'element-ui';
import { Message } from 'element-ui';

// axios.defaults.headers.post['Content-Type'] = 'application/json';
var loading;
axios.interceptors.request.use(
  request => {
    var token = sessionStorage.getItem('access_token');
    if (token) {
        request.headers.Authorization = 'Bearer ' + token;
    }
    return request;
  },
  err => {
    loading.close();
    return Promise.reject(err)
  },
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    var _this = this;
    return response;
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          Message.error('未授权，请登录');
          router.push({ path: '/' });
          break;
        case 403:
          Message.error('拒绝访问');
          router.push({ path: '/' });
          break;
      }
    }
    return Promise.reject(error.response.data);
  },

)

Vue.prototype.$axios = axios
