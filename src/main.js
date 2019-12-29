import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

require("./element-ui/element-ui.js")
Vue.config.productionTip = false

// 网络请求
import {request,requestPost} from "./network/request.js"
Vue.prototype.$get = request
Vue.prototype.$post = requestPost


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
