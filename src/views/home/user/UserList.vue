<template>
	<div>
		<!-- 面包屑导航区 -->
		<bread-crumb :breadcrumbItem="['用户管理', '用户列表']"></bread-crumb>

		<!-- 卡片视图区域 -->
		<el-card class="box-card">
			<!-- 搜索区 -->
			<el-row :gutter="18">
				<el-col :span="7">
					<el-input placeholder="请输入内容" v-model="searchText" class="input-with-select" clearable @clear="innitConsumerList">
						<el-button slot="append" icon="el-icon-search" @click="innitConsumerList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="2"><el-button type="primary">添加用户</el-button></el-col>
			</el-row>

			<!-- 列表区 -->
			<template>
				<el-table :data="consumerInfo.list" stripe border :highlight-current-row="true">
					<el-table-column type="index" width="40" align="center"></el-table-column>
					<el-table-column label="头像" width="70">
						<template slot-scope="scope">
							<img class="table_user_pic" :src="scope.row.wxUserpic" />
						</template>
					</el-table-column>
					<el-table-column prop="wxNickname" label="昵称" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="phone" label="电话"></el-table-column>
					<el-table-column prop="" label="邮箱"></el-table-column>
					<el-table-column prop="status" label="用户状态">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.statusMsg" @change="changUserStatus(scope.row)"></el-switch>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="用户注册时间"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini">编辑</el-button>
							<el-button size="mini" type="danger">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>

			<!-- 分页区 -->
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="consumerInfo.pageNum"
				:page-sizes="[10, 15, 20, 30]"
				:page-size="1"
				layout="total, sizes, prev, pager, next, jumper"
				:total="consumerInfo.total"
			></el-pagination>
		</el-card>
	</div>
</template>

<script>
import BreadCrumb from '@/components/main/common/bread-crumb.vue';
export default {
	components: {
		BreadCrumb
	},
	data() {
		return {
			searchText: '',
			consumerInfo: {}
		};
	},
	created() {
		this.innitConsumerList();
	},
	methods: {
		innitConsumerList() {
			let data = {
				search: this.searchText,
				pageInparam: {
					pageSize: this.consumerInfo.pageSize,
					pageCurrentPage: this.consumerInfo.pageNum
				}
			};
			this.$post('/consumer/shopping_users', data).then(res => {
				res.data.list.forEach(item => {
					item.statusMsg = item.status == 0;
				});
				this.consumerInfo = res.data;
			});
		},
		handleSizeChange(size) {
			this.consumerInfo.pageSize = size;
			this.innitConsumerList();
		},
		handleCurrentChange(currentIndex) {
			this.consumerInfo.pageNum = currentIndex;
			this.innitConsumerList();
		},
		async changUserStatus(item) {
			const {data} =  await this.$post(`/consumer/${item.userId}/upadte_status`, { status: item.statusMsg ? 0 : 1 });
			this.$message.success("修改成功!");
		}
	}
};
</script>

<style scoped>
.el-row {
	margin-bottom: 20px;
}
.table_user_pic {
	width: 50px;
	height: 50px;
}
.el-pagination {
	margin-top: 15px;
}
</style>
