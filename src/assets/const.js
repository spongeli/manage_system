export default {
	// 订单状态常量
	// 订单状态<>0=CREATE=待支付&1=PAID=代发货&2=SEND=已发货&3=CONFIRM=确认收货&4=FINAL=交易完成
	ORDER_STATUS_CREATE: 0,
	ORDER_STATUS_PAID: 1,
	ORDER_STATUS_SEND: 2,
	ORDER_STATUS_CONFIRM: 3,
	ORDER_STATUS_FINAL: 4,


	// 上传图片地址
	IMG_UPLOAD_URL: "http://127.0.0.1:8888/mall/manager/upload/img"
}
