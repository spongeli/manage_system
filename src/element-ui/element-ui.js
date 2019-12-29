import Vue from "vue"

// elementx相关
import {
	Button,
	Select,
	Message,
	Form,
	FormItem,
	Input,
	InputNumber
} from 'element-ui';

// 使用
Vue.use(Button)
Vue.use(Select)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
// 挂载
Vue.prototype.$message = Message
