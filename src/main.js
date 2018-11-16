import './common/style/toast.css'
import './common/style/reset.css'
import 'swiper/dist/css/swiper.css'

// 基本
import Vue from "vue"
import VueRouter from "vue-router"
import App from "./app.vue"
import routerConfig from "./router"
Vue.use(VueRouter)
import Api from './api/http.js'
Vue.prototype.$http= Api

const router = new VueRouter(routerConfig)
// 图片懒加载
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload);
// 时间插件
import moment from 'vue-moment'
import 'moment/locale/zh-cn'
Vue.use(moment);
Vue.moment().locale('zh-cn');
// 解决300延迟
import fastclick from 'fastclick'
fastclick.attach = function (body) {};
fastclick.attach(document.body);
// 饿了么滚动加载
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll);
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper);
// 点击与长按

// 路由
Vue.use(VueRouter);
// 自定义过滤器
Vue.filter('maxNum', function (num) {
    if (num) {
        return (num * 0.01).toFixed(2).split('.')[0] + '.';
    }
    return '0.';
});
Vue.filter('numFilter', function (num) {
    if(num === -1){
        return '本人';
    }
    return '过客 · ' + num.replace(/0/g, '〇').replace(/1/g, '一').replace(/2/g, '二').replace(/3/g, '三').replace(/4/g, '四').replace(/5/g, '五').replace(/6/g, '六').replace(/7/g, '七').replace(/8/g, '八').replace(/9/g, '九');
});
Vue.filter('minNum', function (num) {
    if (num) {
        return (num * 0.01).toFixed(2).split('.')[1];
    }
    return '00';
});
new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});