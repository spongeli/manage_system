<template>
	<div>
		<!-- 面包屑导航 -->
		<bread-crumb :breadcrumbItem="['商品管理', '分类参数']"></bread-crumb>
		<!-- 卡片区 -->
		<el-card class="box-card">
			<el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
			<el-row>
				<span>选择商品分类：</span>
				<el-cascader :options="cateData" v-model="cateIds" clearable :props="{ expandTrigger: 'hover', value: 'categoryId', label: 'categoryName', checkStrictly: true  }"></el-cascader>
			</el-row>

			<!-- tab切换栏 -->
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="动态参数" name="dynamic">
					<el-button type="primary" size="mini" @click="openAddAttrDialog">添加参数</el-button>
				</el-tab-pane>
				<el-tab-pane label="静态参数" name="statics">
					<el-button type="primary" size="mini" @click="openAddAttrDialog">添加属性</el-button>
				</el-tab-pane>
			</el-tabs>
		</el-card>


		<!-- 弹出框 -->
		<el-dialog :title="dialogTitle" :visible.sync="addAttrDialogVisible" width="45%" @close="handleClose">
			<!-- 添加名称的表单 -->
			<el-form ref="addAttrFormRef"  :model="addAttrForm" :rules="addAttrFormRules" label-width="100px">
			  <el-form-item :label="dialogTitle" prop="attrName">
			    <el-input v-model="addAttrForm.attrName"></el-input>
			  </el-form-item>
			</el-form>
			
			<!-- 底部按钮区 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addAttrDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitAttr">确 定</el-button>
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
			cateIds:[],
			activeName: 'dynamic',
			cateData: [],
			addAttrDialogVisible:false,
			addAttrForm:{},
			addAttrFormRules:{
				attrName:[{ required: true, message: '请输入属性名称', trigger: 'blur' }]
			}
		};
	},
	created() {
		this.innitCateData();
	},
	methods: {
		innitCateData() {
			this.$get('/cate').then(data => {
				if (!data) return;
				this.cateData = data;
			});
		},
		openAddAttrDialog(){
			if(this.cateIds.length == 0){
				this.$message.error("请选择分类后再编辑!")
				return;
			}
			this.addAttrDialogVisible = true;
		},
		// 点击navTab调用
		handleClick() {
			console.log(this.activeName);
		},
		// 关闭添加属性弹框调用
		handleClose(){
			this.$refs.addAttrFormRef.resetFields();
		},
		// 提交添加属性表单
		submitAttr(){
			this.$refs.addAttrFormRef.validate(valid =>{
				if(!valid) return 
				this.addAttrForm.attrType = this.activeName
				this.addAttrForm.cateId = this.cateIds[this.cateIds.length-1]
				this.$post("/attr/add_attr",this.addAttrForm).then(res => {
					if(!res) return
					this.$message.success("添加成功");
					this.$refs.addAttrFormRef.resetFields();
					this.addAttrDialogVisible = false
				})
			})
		}
	},
	computed: {
		dialogTitle() {
			return this.activeName == 'dynamic' ? '动态参数' : '静态属性';
		}
	}
};
</script>

<style scoped>
.el-alert {
	margin-bottom: 10px;
}
</style>
