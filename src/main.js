import Vue from 'vue'
import App from './App.vue'
import Cookies from 'js-cookie'
import router from './router/router'
import store from './store'

require("./element-ui/element-ui.js")
Vue.config.productionTip = false

Vue.prototype.$cookie = Cookies

// 网络请求
import {request,requestPost} from "./network/request.js"
Vue.prototype.$get = request
Vue.prototype.$post = requestPost

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
