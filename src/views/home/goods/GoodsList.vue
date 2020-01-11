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
		<el-form ref="updateGoodFormRef" :model="originalGoodsItem" :rules="originalGoodsItemRules" label-width="110px">
			<el-dialog
				title="修改商品信息"
				:visible.sync="updateGoodsDialogVisible"
				width="60%"
				:before-close="updateGoodsClose"
				:close-on-click-modal="false"
				:close-on-press-escape="false"
			>
				<el-tabs type="border-card" v-model="activeTab">
					<el-tab-pane label="商品基础属性" name="baseInfo">
						<el-form-item label="商品分类" prop="cateId">
							<template slot-scope="scope">
								<el-cascader
									:options="cateData"
									v-model="originalGoodsItem.cateIds"
									filterable
									:props="{ value: 'categoryId', label: 'categoryName', expandTrigger: 'hover', checkStrictly: true }"
									clearable
								></el-cascader>
							</template>
						</el-form-item>
						<el-form-item label="商品名称" prop="goodsName"><el-input v-model="originalGoodsItem.goodsName"></el-input></el-form-item>
						<el-form-item label="商品原价格(元)"><el-input v-model="originalGoodsItem.goodsOriginalPrice"></el-input></el-form-item>
						<el-form-item label="商品价格(元)" prop="goodsPrice"><el-input v-model="originalGoodsItem.goodsPrice"></el-input></el-form-item>
						<el-form-item label="商品重量(g)" prop="goodsWeight"><el-input v-model.number="originalGoodsItem.goodsWeight"></el-input></el-form-item>
						<el-form-item label="商品数量" prop="goodsCount"><el-input v-model.number="originalGoodsItem.goodsCount"></el-input></el-form-item>
					</el-tab-pane>

					<el-tab-pane label="商品主图">
						<el-upload
							:action="uploadImgUrl"
							list-type="picture-card"
							:file-list="fileList"
							:on-preview="handlePictureCardPreview"
							:on-remove="handleRemove"
							:on-error="uploadErr"
							:on-success="uploadSuccess"
							:headers="uploaderHeaders"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible"><img width="100%" :src="dialogImageUrl" alt="" /></el-dialog>
					</el-tab-pane>
					<el-tab-pane label="商品详情">
						<quill-editor v-model="originalGoodsItem.goodsDetail"></quill-editor>
					</el-tab-pane>
				</el-tabs>
				<span slot="footer" class="dialog-footer">
					<el-button @click="updateGoodsDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitUpdate">确 定</el-button>
				</span>
			</el-dialog>
		</el-form>
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
			activeTab:"baseInfo",
			cateData: [],
			cateMap: null,
			updateGoodsDialogVisible: false,
			originalGoodsItem: {
				cateIds: []
			},
			originalGoodsItemRules: {
				goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
				goodsPrice: [{ required: true, message: '请填写正确的金额,保留两位小数', pattern: /(^[\d]|^[1-9][\d]*)($|[\.][\d]{0,2}$)/ }],
				goodsWeight: [{ required: true, message: '请填写商品重量', trigger: 'blur' }],
				cateId: [{ required: true, message: '请输入商品类别', trigger: ['blur', 'change'] }],
				goodsCount: [{ required: true, message: '请输入商品库存', trigger: 'blur' }, { type: 'number', message: '数量必须为数字值' }]
			},
			// 修改图片相关
			uploadImgUrl: 'http://127.0.0.1:8888/mall/manager/upload/img',
			fileList: [],
			dialogImageUrl: '',
			dialogVisible: false
		};
	},
	created() {
		this.innitGoodsData();
	},
	methods: {
		//初始化数据
		innitGoodsData() {
			this.$get('/cate?scope=all').then(data => {
				if (!data) return;
				this.cateData = data;
			});
			this.$get('/cate/all').then(data => {
				let cateMap = {};
				data.forEach(item => {
					cateMap[item.categoryId] = item.categoryParentId;
				});
				this.cateMap = cateMap;
			});
			this.innitGoodListData();
		},
		innitGoodListData(){
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

			// 分类信息处理
			item.cateIds = this.gainCateIdsById(item.cateId);
			let files = [];
			item.goodsHeaderImg.split(',').forEach(item => {
				files.push({
					url: item
				});
			});
			this.fileList = files;
			this.originalGoodsItem = item;
			this.originalGoodsItem.goodsHeaderImgList = item.goodsHeaderImg.split(',');
			console.log(item);
		},
		deleteGoods(item) {
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
		},
		gainCateIdsById(cateId) {
			let cateIds = [];
			while (cateId != 0) {
				cateIds.push(cateId);
				cateId = this.cateMap[cateId];
			}
			cateIds.reverse();
			console.log(cateIds);
			return cateIds;
		},
		// 预览图片
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleRemove(res) {
			if (res.response) {
				this.originalGoodsItem.goodsHeaderImgList.remove(res.response.data.url);
			} else {
				this.originalGoodsItem.goodsHeaderImgList.remove(res.url);
			}
			console.log(this.originalGoodsItem);
		},
		uploadSuccess(res) {
			if (res.status == 200) {
				this.originalGoodsItem.goodsHeaderImgList.push(res.data.url);
			} else {
				this.$message.error(res.msg);
			}
		},
		uploadErr(file) {
			console.log('上传图片错误', file);
		},
		submitUpdate(){
			// 形成一个新的对象
			console.log(this.originalGoodsItem);
			this.$refs.updateGoodFormRef.validate(valid => {
				if(!valid) {
					this.$message.error(`请按要求填写商品基础信息！`);
					this.activeTab = "baseInfo"
					return
				}
				if (this.originalGoodsItem.goodsHeaderImgList.length <= 0) {
					this.$message.error(`请上传商品主图！`);
					return;
				}
				if (!this.originalGoodsItem.goodsDetail) {
					this.$message.error(`请填写商品详情！`);
					return;
				}
				var updateItem  = JSON.parse(JSON.stringify(this.originalGoodsItem))
				updateItem.goodsHeaderImg = updateItem.goodsHeaderImgList.join(",")
				updateItem.cateId = updateItem.cateIds[updateItem.cateIds.length-1]
				console.log(updateItem);
				this.$post(`/goods/update/${updateItem.goodsId}`,updateItem).then(res=>{
					if(!res) return
					this.innitGoodListData();
					this.$message.success(`修改成功`);
					this.updateGoodsDialogVisible = false;
				})
			})
			
		}
	},
	computed: {
		uploaderHeaders() {
			return { token: this.$cookie.get('token') };
		}
	}
};
</script>

<style scoped>
.el-cascader {
	width: 300px;
}
</style>
