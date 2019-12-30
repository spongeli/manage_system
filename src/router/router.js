import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
Vue.use(VueRouter)

const routes = [{
	path: "",
	redirect: "/login"
}, {
	path: "/login",
	component: () => import("../views/Login")
}, {
	path: "/home",
	component: () => import("../views/home/Home")
}]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

// 设置导航守卫
router.beforeEach((to, from, next) => {
	let userinfo = Cookies.get("userinfo")
	if (to.path != '/login') {
		// 说明不是去登录页,判断是否登陆
		if (userinfo) {
			next()
		} else {
			router.replace("/login").catch(err => {});
		};
	} else {
		if(userinfo){
			router.replace("/home")
		}
	}
	next();
})
export default router
