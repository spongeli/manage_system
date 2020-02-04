<template>
	<div id="order_container">
		<!-- 面包屑导航区 -->
		<bread-crumb :breadcrumbItem="['订单管理', '订单列表']"></bread-crumb>

		<el-card>
			<!-- 搜索区域 -->
			<el-input class="search_container" placeholder="请输入内容" v-model="searchParam.search" clearable>
				<el-button slot="append" icon="el-icon-search" @click="innitGoodsData"></el-button>
			</el-input>

			<!--列表区域 -->
			<!-- 表格区-->
			<el-table :data="orderData.list" stripe border highlight-current-row>
				<!-- 内插巢 -->
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-form label-position="left" inline class="demo-table-expand">
							<el-form-item label="商品名称">
								<span>{{ props.row.goodName}}</span>
							</el-form-item>
							<el-form-item label="订单地址">
								<span>{{ props.row.addressCity}}</span>
							</el-form-item>
							<el-form-item label="订单详细地址">
								<span>{{ props.row.addressDetail}}</span>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				
				<el-table-column type="index" width="40" align="center" label="#"></el-table-column>
				<el-table-column label="订单Id" align="center" prop="orderId" width="70" show-overflow-tooltip></el-table-column>
				<el-table-column label="用户Id" align="center" prop="userId" width="70" show-overflow-tooltip></el-table-column>
				<el-table-column label="商品Id" align="center" prop="goodId" width="70" show-overflow-tooltip></el-table-column>
				<el-table-column label="商品名称" align="center" prop="goodName" show-overflow-tooltip></el-table-column>
				<el-table-column label="商品金额" align="center" prop="money" show-overflow-tooltip></el-table-column>
				<el-table-column label="优惠金额" align="center" prop="favorablePrice" show-overflow-tooltip></el-table-column>
				<el-table-column label="订单状态" align="center" prop="status" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-tag v-if="$const.ORDER_STATUS_CREATE == scope.row.status">待支付</el-tag>
						<el-tag v-if="$const.ORDER_STATUS_PAID == scope.row.status" type="success">待发货</el-tag>
						<el-tag v-if="$const.ORDER_STATUS_SEND == scope.row.status" type="danger">已发货</el-tag>
						<el-tag v-if="$const.ORDER_STATUS_CONFIRM == scope.row.status" type="warning">确认收货</el-tag>
						<el-tag v-if="$const.ORDER_STATUS_FINAL == scope.row.status" type="info">交易完成</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="createTime" show-overflow-tooltip>
					<template slot-scope="scope">
						{{scope.row.createTime | dateFmt('YYYY-MM-DD HH:mm:ss')}}
					</template>
				</el-table-column>
				<el-table-column label="支付时间" align="center" prop="payTime" show-overflow-tooltip>
					<template slot-scope="scope">
						{{scope.row.payTime | dateFmt('YYYY-MM-DD HH:mm:ss')}}
					</template>
				</el-table-column>
				<el-table-column label="确认收货时间" align="center" prop="confirmTime" show-overflow-tooltip>
					<template slot-scope="scope">
						{{scope.row.confirmTime | dateFmt('YYYY-MM-DD HH:mm:ss')}}
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<div class="v-f">
							<el-button v-if="$const.ORDER_STATUS_PAID == scope.row.status" type="primary" size="mini">确认发货</el-button>
							<el-button v-if="$const.ORDER_STATUS_CONFIRM == scope.row.status" type="primary" size="mini">交易完成</el-button>
							<!-- 删除订单 始终存在 -->
							<el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	import BreadCrumb from "@/components/main/common/bread-crumb.vue"
	export default {
		components: {
			BreadCrumb
		},
		data() {
			return {
				// 搜索对象
				searchParam: {
					search: "",
					pageInparam: {
						pageSize: 5,
						pageCurrentPage: 1
					}
				},
				orderData: {}
			}
		},
		created() {
			this.innitGoodsData()
		},
		methods: {
			innitGoodsData() {
				this.$post("/order", this.searchParam).then(res => {
					if (!res) return
					this.orderData = res;
				})
			}
		}
	}
</script>

<style>
	.search_container {
		width: 350px;
	}

	.demo-table-expand {
		font-size: 0;
	}

	.demo-table-expand label {
		width: 120px;
		color: #99a9bf;
	}

	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 60%;
	}
</style>
