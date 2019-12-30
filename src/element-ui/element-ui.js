import Vue from "vue"

// elementx相关
import {
	Button,
	Select,
	Message,
	Form,
	FormItem,
	Input,
	InputNumber,
	Container,
	Header,
	Aside,
	Main,
} from 'element-ui';

// 使用
Vue.use(Button)
Vue.use(Select)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
// 挂载
Vue.prototype.$message = Message
