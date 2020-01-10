<template>
	<div>
		<!-- 面包屑导航区 -->
		<bread-crumb :breadcrumbItem="['商品管理', '商品列表']"></bread-crumb>

		<!-- 卡片区 -->
		<el-card>
			<el-row :gutter="15">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="searchText" clearable class=""><el-button slot="append" icon="el-icon-search" @click="innitGoodsData"></el-button></el-input>
				</el-col>
				<el-col :span="2"><el-button type="primary" @click="addGoods">添加商品</el-button></el-col>
			</el-row>

			<!-- 表格区-->
			<el-table :data="goodsData.list" stripe border highlight-current-row>
				<el-table-column type="index" width="40" align="center" label="#"></el-table-column>
				<el-table-column label="商品ID" align="center" prop="goodsId" width="65" show-overflow-tooltip></el-table-column>
				<el-table-column label="商品首图" width="80px">
					<template slot-scope="scope">
						<el-image
							style="width: 60px; height: 60px"
							:src="getGoodsFirstImg(scope.row.goodsHeaderImg)"
							fit="fit"
							:preview-src-list="scope.row.goodsHeaderImg.split(',')"
						></el-image>
					</template>
				</el-table-column>
				<el-table-column label="商品名称" prop="goodsName"></el-table-column>
				<el-table-column label="商品分类" prop="cateName" width="150px"></el-table-column>
				<el-table-column label="商品价格" prop="goodsPrice" width="80px" align="center"></el-table-column>
				<el-table-column label="库存" prop="goodsCount" width="70px" align="center"></el-table-column>
				<el-table-column label="状态" prop="goodsStatus" width="60px">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.goodsStatus == 0" @change="changGoodsStatus(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="120px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="openUpdateGoodsDialog(scope.row)"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row)"></el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页插件 -->
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="goodsData.pageNum"
				:page-sizes="[5, 10, 20, 30]"
				:page-size="goodsData.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="goodsData.total"
			></el-pagination>
		</el-card>

		<!-- 修改商品信息 -->
		<el-dialog
			title="修改商品信息"
			:visible.sync="updateGoodsDialogVisible"
			width="60%"
			:before-close="updateGoodsClose"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<el-tabs type="border-card">
				<el-tab-pane label="商品基础属性">用户管理</el-tab-pane>
				<el-tab-pane label="商品主图">配置管理</el-tab-pane>
				<el-tab-pane label="商品富文本">角色管理</el-tab-pane>
			</el-tabs>
			<span slot="footer" class="dialog-footer">
				<el-button @click="updateGoodsDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="updateGoodsDialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
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
			// 初始化列表参数
			searchText: '',
			goodsData: {},

			// 修改商品数据信息
			updateGoodsDialogVisible: false,
			originalGoodsItem: {}
		};
	},
	created() {
		this.innitGoodsData();
	},
	methods: {
		//初始化数据
		innitGoodsData() {
			let data = {
				search: this.searchText,
				pageInparam: {
					pageSize: this.goodsData.pageSize,
					pageCurrentPage: this.goodsData.pageNum
				}
			};
			this.$post(`/goods`, data).then(data => {
				if (!data) return;
				this.goodsData = data;
			});
		},
		// 打开增加商品页面
		addGoods() {
			this.$router.push('/add_goods');
		},
		// 分页插件相关
		// 选择每页大小
		handleSizeChange(size) {
			this.goodsData.pageSize = size;
			this.innitGoodsData();
		},
		// 改变页数
		handleCurrentChange(currentPage) {
			this.goodsData.pageNum = currentPage;
			this.innitGoodsData();
		},
		getGoodsFirstImg(item) {
			return item ? item.split(',')[0] : '';
		},
		changGoodsStatus(item) {
			item.goodsStatus = item.goodsStatus == 0 ? 1 : 0;
			this.$post(`/goods/update_status/${item.goodsId}/${item.goodsStatus}`).then(res => {
				this.$message.success(`更新状态成功`);
			});
		},
		// 修改商品数据信息方法
		updateGoodsClose() {
			this.updateGoodsDialogVisible = false;
		},
		openUpdateGoodsDialog(item) {
			this.updateGoodsDialogVisible = true;
			this.originalGoodsItem = item;
			console.log(item);
		},
		deleteGoods(item){
			this.$confirm('此操作将永久删除商品, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$post(`/goods/${item.goodsId}/delete`).then(data => {
						if (!data) return;
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.innitGoodsData();
					});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
		}
	}
};
</script>

<style scoped></style>
