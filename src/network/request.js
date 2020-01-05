import Vue from "vue"
import axios from 'axios'
import {
	Message
} from 'element-ui';
axios.defaults.baseURL = 'http://127.0.0.1:8888/mall/manager/'
axios.defaults.withCredentials = true;
export function request(config) {
	const instance = axios.create({
		timeout: 5000,
	});

	instance.interceptors.request.use(config => {
		console.log("URL=", config.url, ",data=", config.data);
		config.headers.token = this.$cookie.get("token")
		return config
	}, err => {
		Vue.$message.error(err)
	});

	instance.interceptors.response.use(config => {
		console.log(config.data);
		if (config.data.status == 200) {
			return config.data
		} else if (config.data.status == 300) {
			// 登陆过期
			Message.error(config.data.msg);
			this.$cookie.remove("token");
			this.$router.replace('/login');
		} else {
			Message.error(config.data.msg);
		}
	}, err => {
		console.log(err)
	});

	// 发送网络请求 ==> 且返回的是一个Promise
	return instance(config);
}

export function requestPost(url, data) {
	const instance = axios.create({
		timeout: 5000,
	});

	instance.interceptors.request.use(config => {
		console.log("URL=", config.url, ",data=", config.data)
		//请求偷里添加 token字段 用于校验登陆状况
		config.headers.token = this.$cookie.get("token");
		return config
	}, err => {
		Message.error(err);
	});

	instance.interceptors.response.use(config => {
		console.log(config.data);
		if (config.data.status == 200) {
			return config.data
		} else if (config.data.status == 300) {
			// 登陆过期
			Message.error(config.data.msg);
			this.$cookie.remove("token");
			this.$router.replace('/login');
		} else {
			Message.error(config.data.msg);
		}
	}, err => {
		console.log(err)
	});

	// 发送网络请求 ==> 且返回的是一个Promise
	return instance.post(url, data);
}
