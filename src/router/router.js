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
	redirect: "/welcome",
	component: () => import("../views/home/Home"),
	children: [{
			path: "/welcome",
			component: () => import("@/components/main/WelCome.vue")
		}, {
			path: "/user_list",
			component: () => import("@/views/home/user/UserList.vue")
		}, {
			path: "/role_list",
			component: () => import("@/views/home/power/RoleList.vue")
		}, {
			path: "/power_list",
			component: () => import("@/views/home/power/PowerList.vue")
		}, {
			path: "/goods_list",
			component: () => import("@/views/home/goods/GoodsList.vue")
		}, {
			path: "/goods_classes",
			component: () => import("@/views/home/goods/GoodsClasses.vue")
		}, {
			path: "/order_list",
			component: () => import("@/views/home/order/OrderList.vue")
		}, {
			path: "/statistics_report",
			component: () => import("@/views/home/data/StatisticsReport.vue")
		}
	]
}]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

// 设置导航守卫
router.beforeEach((to, from, next) => {
	let userinfo = Cookies.get("token")
	if (to.path != '/login') {
		// 说明不是去登录页,判断是否登陆
		if (userinfo) {
			next()
		} else {
			router.replace("/login");
		};
	} else {
		if (userinfo) {
			router.replace("/home")
		}
	}
	next();
})
export default router
