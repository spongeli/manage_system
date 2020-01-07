<template>
	<div>
		<!-- 面包屑导航区 -->
		<bread-crumb :breadcrumbItem="['商品管理', '商品分类']"></bread-crumb>

		<!-- 卡片视图区域 -->
		<el-card class="box-card">
			<!-- 添加按钮 -->
			<el-button type="primary" class="add_btn" @click="cateDialog.isVisible = true">添加按钮</el-button>
			<!-- 树形列表 -->
			<tree-table :data="cateData" :columns="columns" empty-text="--" show-index index-text="#" stripe border
			 children-prop="children" :selection-type="false" :tree-type="true" :expand-type="false">
				<template slot="isStatus" scope="scope">
					<i class="el-icon-success" v-if="scope.row.status == 0"></i>
					<i class="el-icon-error" v-else></i>
				</template>
				<template slot="operation_tree" scope="scope">
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
					<el-cascader v-model="cateDialog.form.categoryParentId" :options="cateData" :props="{ expandTrigger: 'hover', value: 'categoryId', label: 'categoryName',checkStrictly:true }"
					 @change="handleChange" clearable></el-cascader>
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
				<el-cascader v-model="editCateDialog.form.categoryParentId" :options="cateData" :props="{ expandTrigger: 'hover', value: 'categoryId', label: 'categoryName',checkStrictly:true }"
				 @change="handleChange" clearable></el-cascader>
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
				editCateDialog:{
					isVisible:false,
					form:{
						categoryName:""
					},
					editCateDialogRule:{
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
						categoryDesc:[{
								required: true,
								message: '请输入分类描述',
								trigger: 'blur'
						}]
					}
				},
				cateDialog: {
					isVisible: false,
					form: {
						categoryParentId: [],
						categoryOrder: 9
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
						categoryDesc:[{
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
						width:"250"
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
				this.$get('/cate').then(data => {
					if(!data) return
					this.cateData = data;
				})
			},
			editCate(cateItem) {
				this.editCateDialog.isVisible = true
				if(typeof cateItem.categoryParentId == 'number'){
					if(cateItem.categoryParentId == 0){
						cateItem.categoryParentId = [cateItem.categoryId]
					}else{
						cateItem.categoryParentId = [cateItem.categoryParentId,cateItem.categoryId]
					}
				}
				this.editCateDialog.form = cateItem
			},
			deleteCate(cateItem) {
				console.log(cateItem)
				this.$confirm('此操作将永久删除分类, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$post(`/cate/${cateItem.categoryId}/delete`).then( data =>{
						if(!data) return;
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.innitCateList()
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})
			},
			addCate() {
				this.cateData.isVisible = true;
			},
			handleChange() {},
			closeDialog() {
				this.$refs.cateFormRef.resetFields()
				this.cateDialog.form.categoryParentId = []
				this.cateDialog.isVisible = false
			},
			closeEditDialog(){
				this.editCateDialog.isVisible = false
			},
			submitCate() {
				this.$refs.cateFormRef.validate(valid => {
					if (!valid) return
					let parentId = this.cateDialog.form.categoryParentId[this.cateDialog.form.categoryParentId.length - 1];
					this.cateDialog.form.categoryParentId = parentId ? parentId : 0;
					this.$post(`/cate/add`, this.cateDialog.form).then(data => {
						if (!data) return
						this.$message.success("添加成功");
						this.closeDialog();
						this.innitCateList()
					})
				})
			},
			submitEditCate(){
				this.$refs.editCateFormRef.validate(valid => {
					if (!valid) return
					let parentId = this.editCateDialog.form.categoryParentId[this.editCateDialog.form.categoryParentId.length - 1];
					this.editCateDialog.form.categoryParentId = parentId ? parentId : 0;
					this.$post(`/cate/${this.editCateDialog.form.categoryId}/update`, this.editCateDialog.form).then(data => {
						if (!data) return
						this.$message.success("修改成功")
						this.editCateDialog.isVisible = false
						this.innitCateList()
					})
				})
			}
		},
		computed: {}
	};
</script>

<style scoped>
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
	.edit_btn{
		margin: auto 0;
		margin-right: 15px;
	}
</style>
