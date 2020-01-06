<template>
	<div>
		<!-- 面包屑导航区 -->
		<bread-crumb :breadcrumbItem="['商品管理', '商品分类']"></bread-crumb>

		<!-- 卡片视图区域 -->
		<el-card class="box-card">
			<!-- 添加按钮 -->
			<el-button type="primary" @click="cateDialog.isVisible = true">添加按钮</el-button>
			<!-- 树形列表 -->
			<tree-table
				:data="cateData"
				:columns="columns"
				empty-text="--"
				show-index
				index-text="#"
				stripe
				border
				children-prop="children"
				:selection-type="false"
				:tree-type="true"
				:expand-type="false"
			>
				<template slot="isStatus" scope="scope">
					<i class="el-icon-success" v-if="scope.row.status == 0"></i>
					<i class="el-icon-error" v-else></i>
				</template>
				<template slot="operation_tree" scope="scope">
					<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope)">删除</el-button>
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope)">编辑</el-button>
				</template>
			</tree-table>
		</el-card>

		<!-- 添加分类弹框 -->
		<el-dialog title="添加分类" :visible.sync="cateDialog.isVisible" label-width="100px" @close="closeDialog">
			<!-- 弹框中的内容 -->
			<el-form ref="cateFormRef" :model="cateDialog.form" :rules="cateDialog.cateFormRules" label-width="80px">
				<el-form-item label="分类名称" prop="categoryName"><el-input v-model="cateDialog.form.categoryName"></el-input></el-form-item>
				<el-form-item label="父级分类">
					<el-cascader
						v-model="cateDialog.form.categoryParentId"
						:options="cateData"
						:props="{ expandTrigger: 'hover', value: 'categoryId', label: 'categoryName',checkStrictly:true }"
						@change="handleChange"
						clearable
					></el-cascader>
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
			cateDialog: {
				isVisible: false,
				form: {
					categoryParentId: [],
					categoryOrder:9
				},
				cateFormRules: {
					categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
					categoryOrder:[{ required: true, message: '请输入类别排序级别', trigger: 'blur' }]
				}
			},
			cateData: [],
			columns: [
				{
					label: '分类名称',
					prop: 'categoryName',
					width: '150'
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
		async innitCateList() {
			const { data: data } = await this.$get('/cate');
			this.cateData = data;
		},
		editCate() {
			console.log(`编辑分类`);
		},
		deleteCate() {
			console.log(`删除分类`);
		},
		addCate() {
			this.cateData.isVisible = true;
		},
		handleChange() {
		},
		closeDialog(){
			this.$refs.cateFormRef.resetFields()
			this.cateDialog.form.categoryParentId=[]
		},
		submitCate(){
			this.$refs.cateFormRef.validate(valid => {
				if(!valid) return
				let parentId = this.cateDialog.form.categoryParentId[this.cateDialog.form.categoryParentId.length-1];
				this.cateDialog.form.categoryParentId = parentId?parentId:0;
				console.log(this.cateDialog.form)
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
.el-button {
	margin-bottom: 15px;
}
.el-cascader {
	width: 100%;
}
</style>
