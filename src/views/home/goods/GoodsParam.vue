<template>
	<div>
		<!-- 面包屑导航 -->
		<bread-crumb :breadcrumbItem="['商品管理', '分类参数']"></bread-crumb>
		<!-- 卡片区 -->
		<el-card class="box-card">
			<el-alert title="注意：只允许选择其中一级分类设置相关参数！其参数在商品分类中显示!" type="warning" show-icon :closable="false"></el-alert>
			<el-row>
				<span>选择商品分类：</span>
				<el-cascader
					:options="cateData"
					v-model="cateIds"
					@change="gainCateAttr"
					clearable
					:props="{ expandTrigger: 'hover', value: 'categoryId', label: 'categoryName', checkStrictly: true }"
				></el-cascader>
			</el-row>

			<!-- tab切换栏 -->
			<el-tabs v-model="activeName" @tab-click="gainCateAttr">
				<!-- 动态参数 -->
				<el-tab-pane label="动态参数" name="dynamic">
					<el-button type="primary" size="mini" @click="openAddAttrDialog">添加参数</el-button>
					<el-table :data="dynamicList" border stripe lazy>
						<!-- 动态标签栏(展开行) -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag :key="tag" v-for="tag in scope.row.attrListMsg" closable hit @close="handleTagClose(scope, tag)">{{ tag }}</el-tag>
								<el-input
									ref="saveTagInput"
									class="input-new-tag"
									v-if="scope.row.inputVisible"
									v-model="scope.row.inputValue"
									size="small"
									@keyup.enter.native="handleInputConfirm(scope)"
									@blur="handleInputConfirm(scope)"
								></el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ New Tag</el-button>
							</template>
						</el-table-column>

						<el-table-column type="index" label="#" align="center"></el-table-column>
						<el-table-column prop="attrName" label="参数名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="attrName" label="属性状态">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.statusMsg" @change="changAttrStatus(scope.row)"></el-switch>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" size="mini" icon="el-icon-edit" @click="updateAttrName(scope.row)">修改</el-button>
								<el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttr(scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>

				<!-- 静态参数 -->
				<el-tab-pane label="静态参数" name="statics">
					<el-button type="primary" size="mini" @click="openAddAttrDialog">添加属性</el-button>
					<el-table :data="staticList" border stripe lazy>
						<!-- 静态参数展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag :key="tag" v-for="tag in scope.row.attrListMsg" closable hit @close="handleTagClose(scope, tag)">{{ tag }}</el-tag>
								<el-input
									ref="saveTagInput"
									class="input-new-tag"
									v-if="scope.row.inputVisible"
									v-model="scope.row.inputValue"
									size="small"
									@keyup.enter.native="handleInputConfirm(scope)"
									@blur="handleInputConfirm(scope)"
								></el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ New Tag</el-button>
							</template>
						</el-table-column>

						<el-table-column type="index" label="#" align="center"></el-table-column>
						<el-table-column prop="attrName" label="参数名称"></el-table-column>
						<el-table-column prop="attrName" label="属性状态">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.statusMsg" @change="changAttrStatus(scope.row)"></el-switch>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" size="mini" icon="el-icon-edit" @click="updateAttrName(scope.row)">修改</el-button>
								<el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttr(scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>

		<!-- 增加属性弹出框 -->
		<el-dialog :title="dialogTitle" :visible.sync="addAttrDialogVisible" width="45%" @close="handleClose">
			<!-- 添加名称的表单 -->
			<el-form ref="addAttrFormRef" :model="addAttrForm" :rules="addAttrFormRules" label-width="100px">
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

		<!-- 修改属性名称弹出框 -->
		<el-dialog :title="'修改' + dialogTitle" :visible.sync="updateAttrDialogVisible" width="45%" @close="handleUpdateClose">
			<!-- 添加名称的表单 -->
			<el-form ref="updateAttrFormRef" :model="updateAttrForm" :rules="updateAttrFormRules" label-width="100px">
				<el-form-item :label="dialogTitle" prop="attrName"><el-input v-model="updateAttrForm.attrName"></el-input></el-form-item>
			</el-form>

			<!-- 底部按钮区 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="updateAttrDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitUpdateAttr">确 定</el-button>
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
			activeName: 'dynamic',

			// 级联选择器相关
			cateIds: [],
			cateData: [],

			// 表格相关
			dynamicList: [],
			staticList: [],

			// 添加属性弹框相关
			addAttrDialogVisible: false,
			addAttrForm: {},
			addAttrFormRules: {
				attrName: [
					{
						required: true,
						message: '请输入属性名称',
						trigger: 'blur'
					}
				]
			},
			// 修改属性名称弹出框相关
			updateAttrDialogVisible: false,
			updateAttrForm: {
				originalAttrName: '',
				attrName: '',
				attrId: -1
			},
			updateAttrFormRules: {
				attrName: [
					{
						required: true,
						message: '请输入属性名称',
						trigger: 'blur'
					}
				]
			}
		};
	},
	created() {
		this.innitCateData();
	},
	methods: {
		innitCateData() {
			this.$get('/cate?scope=all').then(data => {
				if (!data) return;
				this.cateData = data;
			});
		},
		openAddAttrDialog() {
			if (this.cateIds.length == 0) {
				this.$message.error('请选择分类后再编辑!');
				return;
			}
			this.addAttrDialogVisible = true;
		},
		// 关闭添加属性弹框调用
		handleClose() {
			this.$refs.addAttrFormRef.resetFields();
		},
		// 修改属性弹出框
		handleUpdateClose() {
			this.$refs.updateAttrFormRef.resetFields();
		},
		// 提交添加属性表单
		submitAttr() {
			this.$refs.addAttrFormRef.validate(valid => {
				if (!valid) return;
				this.addAttrForm.attrType = this.activeName;
				this.addAttrForm.cateId = this.cateIds[this.cateIds.length - 1];
				this.$post('/attr/add_attr', this.addAttrForm).then(res => {
					if (!res) return;
					this.$message.success('添加成功');
					this.$refs.addAttrFormRef.resetFields();
					this.addAttrDialogVisible = false;
					this.gainCateAttr();
				});
			});
		},
		// 修改属性名称提交
		submitUpdateAttr() {
			if (this.updateAttrForm.originalAttrName == this.updateAttrForm.attrName) {
				this.$message.info('未作任何修改！');
				this.updateAttrDialogVisible = false;
				return;
			}

			this.$post(`/attr/${this.updateAttrForm.attrId}/update`, { attrName: this.updateAttrForm.attrName }).then(res => {
				if (!res) return;
				this.updateAttrDialogVisible = false;
				this.$message.success('修改属性名称成功');
				this.gainCateAttr();
			});
		},
		// 获取对应分类的属性
		gainCateAttr() {
			if (this.cateIds.length <= 0) return;
			let cateid = this.cateIds[this.cateIds.length - 1];
			this.$get(`/attr/${cateid}/${this.activeName}`).then(res => {
				if (!res) return;
				res.forEach(item => {
					item.statusMsg = item.attrStatus == 0;
					(item.attrListMsg = item.attrList ? item.attrList.split(',') : []), (item.inputVisible = false);
					item.inputValue = '';
				});
				if (this.activeName == 'dynamic') {
					this.dynamicList = res;
				} else {
					this.staticList = res;
				}
			});
		},
		// 修改属性状态
		changAttrStatus(attr) {
			let param = { attrStatus: attr.attrStatus == 0 ? 1 : 0 };
			this.$post(`/attr/${attr.attrId}/update`, param).then(data => {
				if (!data) return;
				attr.attrStatus = param.attrStatus;
				this.$message.success(`修改状态成功`);
			});
		},
		// 删除动态标签
		handleTagClose(scope, tag) {
			scope.row.attrListMsg.remove(tag);
			this.submitTagList(scope.row);
		},
		// 添加动态标签
		handleInputConfirm(scope) {
			let inputValue = scope.row.inputValue;
			if (inputValue) {
				scope.row.attrListMsg.push(inputValue);
			}
			scope.row.inputVisible = false;
			scope.row.inputValue = '';
			this.submitTagList(scope.row);
		},
		// 点击增加按钮，显示input框，并且获取焦点
		showInput(scope) {
			scope.row.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		// 提交修改标签
		submitTagList(attr) {
			let param = attr.attrListMsg ? attr.attrListMsg.join(',') : '';
			this.$post(`/attr/${attr.attrId}/save_param/${param}`).then(res => {
				this.$message.success('修改属性成功！');
			});
		},
		// 打开修改属性对话框
		updateAttrName(item) {
			this.updateAttrDialogVisible = true;
			this.updateAttrForm.attrName = item.attrName;
			this.updateAttrForm.originalAttrName = item.attrName;
			this.updateAttrForm.attrId = item.attrId;
		},
		// 删除属性
		deleteAttr(attr) {
			this.$confirm('此操作将永久删除该属性嘛, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$post(`/attr/${attr.attrId}/delete`).then(res => {
						if (!res) return;
						this.$message.success('删除成功!');
						this.gainCateAttr();
					});
				})
				.catch(() => {
					this.$message('已取消删除');
				});
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

.el-tag {
	margin-right: 10px;
}

.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}

.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
</style>
