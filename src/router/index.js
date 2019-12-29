import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from "../views/Login.vue"

const routes = [{
	path: "",
	redirect: "/Login"
}, {
	path: "/login",
	component: () => import("../views/Login.vue")
}]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
