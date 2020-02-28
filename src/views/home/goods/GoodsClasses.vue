<template>
	<div class="goods_classes_container">
		<!-- 面包屑导航区 -->
		<bread-crumb :breadcrumbItem="['商品管理', '商品分类']"></bread-crumb>

		<!-- 卡片视图区域 -->
		<el-card class="box-card">
			<!-- 添加按钮 -->
			<el-button type="primary" class="add_btn" @click="cateDialog.isVisible = true">添加分类</el-button>
			<!-- 树形列表 -->
			<tree-table :data="cateData" :columns="columns" empty-text="--" show-index index-text="#" stripe border
			 children-prop="children" :selection-type="false" :tree-type="true" :expand-type="false">
				<template slot="isStatus" slot-scope="scope">
					<i class="el-icon-success" v-if="scope.row.status == 0"></i>
					<i class="el-icon-error" v-else></i>
				</template>
				<template slot="operation_tree" slot-scope="scope">
					<el-button type="danger" class="edit_btn" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row)">删除</el-button>
					<el-button type="primary" class="edit_btn" icon="el-icon-edit" size="mini" @click="editCate(scope.row)">编辑</el-button>
				</template>
			</tree-table>
		</el-card>

		<!-- 添加分类弹框 -->
		<el-dialog title="添加分类" :visible.sync="cateDialog.isVisible" label-width="100px" @close="closeDialog">
			<!-- 弹框中的内容 -->
			<el-form ref="cateFormRef" :model="cateDialog.form" :rules="cateDialog.cateFormRules" label-width="80px">
				<el-form-item label="分类名称" prop="categoryName">
					<el-input v-model="cateDialog.form.categoryName"></el-input>
				</el-form-item>
				<el-form-item label="父级分类">
					<el-select v-model="cateDialog.form.categoryParentId" placeholder="请选择">
						<el-option clearable v-for="item in cateData" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="cateDialog.form.categoryParentId" label="分类头图" class="cate_image_container">
					<el-upload class="avatar-uploader" :action="$const.IMG_UPLOAD_URL" :show-file-list="false" :on-success="handleAvatarSuccess"
					 :before-upload="beforeAvatarUpload" :headers="uploadHeader">
						<img v-if="cateDialog.form.categoryImg" :src="cateDialog.form.categoryImg" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="排序级别" prop="categoryOrder">
					<el-input v-model="cateDialog.form.categoryOrder" type="number"></el-input>
				</el-form-item>
				<el-form-item label="分类描述" prop="categoryDesc">
					<el-input v-model="cateDialog.form.categoryDesc" type="textarea"></el-input>
				</el-form-item>
			</el-form>

			<!-- 弹框下面的按钮 -->
			<div slot="footer" class="dialog-footer">
				<el-button @click="cateDialog.isVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitCate">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 编辑分类框 -->
		<el-dialog title="编辑分类" :visible.sync="editCateDialog.isVisible" label-width="100px">
			<!-- 弹框中的内容 -->
			<el-form ref="editCateFormRef" :model="editCateDialog.form" :rules="editCateDialog.editCateDialogRule" label-width="80px">
				<el-form-item label="分类名称" prop="categoryName">
					<el-input v-model="editCateDialog.form.categoryName"></el-input>
				</el-form-item>
				<el-form-item label="父级分类">
					<el-select clearable v-model="editCateDialog.form.categoryParentId" placeholder="请选择">
						<el-option clearable v-for="item in cateData" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="editCateDialog.form.categoryParentId != null && editCateDialog.form.categoryParentId != ''" label="分类头图" class="cate_image_container">
					<el-upload class="avatar-uploader" :action="$const.IMG_UPLOAD_URL" :show-file-list="false" :on-success="handleUpdateSuccess"
					 :before-upload="beforeUpdateUpload" :headers="uploadHeader">
						<img v-if="editCateDialog.form.categoryImg" :src="editCateDialog.form.categoryImg" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="排序级别" prop="categoryOrder">
					<el-input v-model="editCateDialog.form.categoryOrder" type="number"></el-input>
				</el-form-item>
				<el-form-item label="分类描述" prop="categoryDesc">
					<el-input v-model="editCateDialog.form.categoryDesc" type="textarea"></el-input>
				</el-form-item>
			</el-form>

			<!-- 弹框下面的按钮 -->
			<div slot="footer" class="dialog-footer">
				<el-button @click="editCateDialog.isVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitEditCate">确 定</el-button>
			</div>
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
				editCateDialog: {
					isVisible: false,
					form: {
						categoryParentId: '',
						categoryOrder: 9,
						categoryName: "",
						categoryDesc: "",
						categoryImg: "",
					},
					editCateDialogRule: {
						categoryName: [{
							required: true,
							message: '请输入分类名称',
							trigger: 'blur'
						}],
						categoryOrder: [{
							required: true,
							message: '请输入类别排序级别',
							trigger: 'blur'
						}],
						categoryDesc: [{
							required: true,
							message: '请输入分类描述',
							trigger: 'blur'
						}]
					}
				},
				cateDialog: {
					isVisible: false,
					form: {
						categoryParentId: '',
						categoryOrder: 9,
						categoryName: "",
						categoryDesc: "",
						categoryImg: "",
					},
					cateFormRules: {
						categoryName: [{
							required: true,
							message: '请输入分类名称',
							trigger: 'blur'
						}],
						categoryOrder: [{
							required: true,
							message: '请输入类别排序级别',
							trigger: 'blur'
						}],
						categoryDesc: [{
							required: true,
							message: '请输入分类描述',
							trigger: 'blur'
						}]
					}
				},
				cateData: [],
				columns: [{
						label: '分类名称',
						prop: 'categoryName',
						width: '250'
					},
					{
						label: '是否有效',
						prop: 'status',
						width: '75px',
						align: 'center',
						type: 'template',
						template: 'isStatus'
					},
					{
						label: '描述',
						prop: 'categoryDesc'
					},
					{
						label: '排序级别',
						prop: 'categoryOrder',
						align: 'center',
						width: '75px'
					},
					{
						label: '操作',
						type: 'template',
						template: 'operation_tree'
					}
				]
			};
		},
		created() {
			this.innitCateList();
		},
		methods: {
			innitCateList() {
				this.$get('/cate?scope=all').then(data => {
					if (!data) return;
					console.log(data);
					this.cateData = data;
				});
			},
			editCate(cateItem) {
				this.editCateDialog.isVisible = true;
				this.editCateDialog.form = cateItem;
				if (cateItem.categoryParentId == 0) {
					this.editCateDialog.form.categoryParentId = null;
				}
			},
			deleteCate(cateItem) {
				this.$confirm('此操作将永久删除分类, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						this.$post(`/cate/${cateItem.categoryId}/delete`).then(data => {
							if (!data) return;
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							this.innitCateList();
						});
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
			},
			addCate() {
				this.cateData.isVisible = true;
			},
			handleChange() {},
			closeDialog() {
				this.$refs.cateFormRef.resetFields();
				this.cateDialog.isVisible = false;
			},
			closeEditDialog() {
				this.editCateDialog.isVisible = false;
			},
			submitCate() {
				this.$refs.cateFormRef.validate(valid => {
					if (!valid) return;
					this.$post(`/cate/add`, this.cateDialog.form).then(data => {
						if (!data) return;
						this.$message.success('添加成功');
						this.closeDialog();
						this.innitCateList();
					});
				});
			},
			submitEditCate() {
				this.$refs.editCateFormRef.validate(valid => {
					if (!valid) return;
					this.$post(`/cate/${this.editCateDialog.form.categoryId}/update`, this.editCateDialog.form).then(data => {
						if (!data) return;
						this.$message.success('修改成功');
						this.editCateDialog.isVisible = false;
						this.innitCateList();
					});
				});
			},
			handleAvatarSuccess(res) {
				if (res.status != 200) {
					this.$message.error("文件上传失败")
					return
				}
				this.cateDialog.form.categoryImg = res.data.url;
			},
			handleUpdateSuccess(res){
				if (res.status != 200) {
					this.$message.error("文件上传失败")
					return
				}
				this.editCateDialog.form.categoryImg = res.data.url;
			},
			beforeAvatarUpload(res, file) {
				console.log(res, file);
			},
			beforeUpdateUpload(){
				
			}
		},
		computed: {
			uploadHeader() {
				return {
					token: this.$cookie.get('token')
				};
			}
		}
	};
</script>

<style lang="scss">
	.goods_classes_container {
		.cate_image_container {
			height: 130px;

			.el-form-item__label {
				height: 130px;
				line-height: 130px;
			}
		}

		.avatar-uploader .el-upload {
			border-radius: 6px;
			cursor: pointer;
			position: relative;
			overflow: hidden;
			border: 1px dashed #d9d9d9 !important;
		}

		.avatar-uploader .el-upload:hover {
			border-color: #409EFF;
		}

		.avatar-uploader-icon {
			font-size: 28px;
			color: #8c939d;
			width: 130px;
			height: 130px;
			line-height: 130px;
			text-align: center;
		}

		.avatar {
			width: 130px;
			height: 130px;
			display: block;
		}


		.el-icon-success {
			color: #20b2aa;
		}

		.el-icon-error {
			color: red;
		}

		.add_btn {
			margin-bottom: 15px;
		}

		.el-cascader {
			width: 100%;
		}

		.edit_btn {
			margin: auto 0;
			margin-right: 15px;
		}
	}
</style>
