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
	MenuItem,
	Breadcrumb,
	BreadcrumbItem,
	Card,
	Row,
	Col,
	Table,
	TableColumn,
	Switch,
	Pagination,
	Dialog,
	Cascader,
	MessageBox,
	Alert,
	Tabs,
	TabPane,
	Tag,
	Image,
	Steps,
	Step,
	Tooltip,
	Upload,
	Option,
	Transfer
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
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Image)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tooltip)
Vue.use(Upload)
Vue.use(Option)
Vue.use(Transfer)
// 挂载
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
