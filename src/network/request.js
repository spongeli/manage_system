import Vue from "vue"
import axios from 'axios'
import {Message} from 'element-ui';
axios.defaults.baseURL = 'http://127.0.0.1:8888/mall/manager/'
axios.defaults.withCredentials=true;
export function request(config) {
	const instance = axios.create({
		timeout: 5000,
	});

	instance.interceptors.request.use(config => {
		console.log("URL=", config.url, ",data=", config.data);
		var token = getToken();
		return config
	}, err => {
		Vue.$message.error(err)
	});

	instance.interceptors.response.use(config => {
			if(config.data.status == 200){
				return config.data
			}else{
				Message.error(config.data.msg);
			}
	}, err => {
		console.log(err)
		
	});

	// 发送网络请求 ==> 且返回的是一个Promise
	return instance(config);
}

export function requestPost(url,data) {
	const instance = axios.create({
		timeout: 5000,
	});

	instance.interceptors.request.use(config => {
		console.log("URL=", config.url, ",data=", config.data)
		var token = getToken()
		config.headers.token = getToken()
		return config
	}, err => {
		Message.error(err);
	});

	instance.interceptors.response.use(config => {
			if(config.data.status == 200){
				return config.data
			}else{
				Message.error(config.data.msg);
			}
	}, err => {
		console.log(err)
	});

	// 发送网络请求 ==> 且返回的是一个Promise
	return instance.post(url,data);
}


function getToken(){
	if(document.cookie.indexOf("token=") > 0){
		var tokenStr = document.cookie.substring(document.cookie.indexOf("token=") + 6)
		if(tokenStr.indexOf(";") > 0)
			return tokenStr.substring(0,tokenStr.indexOf(";"))
		return tokenStr
	}
	return '';
}