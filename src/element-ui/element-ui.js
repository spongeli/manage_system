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
	Menu,
	Submenu,
	MenuItemGroup,
	MenuItem
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
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
// 挂载
Vue.prototype.$message = Message
