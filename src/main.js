import Vue from 'vue'
import App from './App.vue'
import Cookies from 'js-cookie'
import router from './router/router'
import store from './store'
import moment from 'moment'

require("@/element-ui/element-ui.js")
require("@/plugins/plugin.js")
require('@/assets/util.js')
Vue.config.productionTip = false

Vue.prototype.$cookie = Cookies

// 自定义函数
import CommonUtil from "./assets/common.js"
Vue.prototype.$util = CommonUtil
// 常量库
import CONST from "./assets/const.js"
Vue.prototype.$const = CONST

// 网络请求
import {
	request,
	requestPost
} from "./network/request.js"
Vue.prototype.$get = request
Vue.prototype.$post = requestPost

//全局过滤器
Vue.filter('dateFmt', (input, formatString = "YYYY-MM-DD") => {
	input = input.toString().length < 13 ? input * 1000 : input;
	return moment(input).format(formatString)
})
Vue.filter('zhBoolean', input => {
	return input == 0 ? true : false
})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
