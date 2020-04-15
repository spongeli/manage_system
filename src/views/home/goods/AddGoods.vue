<template>
	<div>
		<!-- 面包屑导航区 -->
		<bread-crumb :breadcrumbItem="['商品管理', '商品列表']"></bread-crumb>

		<el-card>
			<!-- 提示信息 -->
			<el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
			<!-- 步骤条 -->
			<el-steps :space="200" :active="tabIndex - 0" finish-status="success" align-center>
				<el-step title="基本信息"></el-step>
				<el-step>
					<template slot="title">
						<el-tooltip class="item" content="用于用户购买该产品时,可选择的属性" placement="top">
							<div>商品参数</div>
						</el-tooltip>
					</template>
				</el-step>
				<el-step>
					<template slot="title">
						<el-tooltip class="item" content="用于用户购买该产品时,可看到的该产品的属性" placement="top">
							<div>商品属性</div>
						</el-tooltip>
					</template>
				</el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>
			<!-- 导航栏 -->
			<el-form ref="goodsFormRef" :model="goodsForm" :rules="goodsFormRules" label-width="120px">
				<el-tabs tab-position="left" v-model="tabIndex" :before-leave="beforeLeaveTab" @tab-click="tabClick">
					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品分类" prop="cateId">
							<template slot-scope="scope">
								<el-cascader :options="cateData" v-model="goodsForm.cateId" filterable :props="{ value: 'categoryId', label: 'categoryName', expandTrigger: 'hover'}"
								 clearable @change="changCate"></el-cascader>
							</template>
						</el-form-item>
						<el-form-item label="商品名称" prop="goodsName">
							<el-input v-model="goodsForm.goodsName"></el-input>
						</el-form-item>
						<el-form-item label="商品原价格(元)">
							<el-input v-model="goodsForm.goodsOriginalPrice"></el-input>
						</el-form-item>
						<el-form-item label="商品价格(元)" prop="goodsPrice">
							<el-input v-model="goodsForm.goodsPrice"></el-input>
						</el-form-item>
						<el-form-item label="商品重量(g)" prop="goodsWeight">
							<el-input v-model.number="goodsForm.goodsWeight"></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goodsCount">
							<el-input v-model.number="goodsForm.goodsCount"></el-input>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name="1">
						<el-alert title="后台不提供配置某产品的动态属性单独删减,此处只用于展示,若想对该产品有属性上的更改,请移步[商品参数],修改该分类的动态属性" type="warning" center show-icon
						 :closable="false"></el-alert>
						<el-form-item :label="item.attrName" v-for="(item, index) in dynamicAttrList" :key="index">
							<el-tag v-for="(label, i) in item.attrList" :key="i">{{ label }}</el-tag>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品属性" name="2">
						<el-alert title="后台不提供配置某产品的静态属性单独删减,此处只用于展示,若想对该产品有属性上的更改,请移步[商品参数],修改该分类的静态属性" type="warning" center show-icon
						 :closable="false"></el-alert>
						<el-form-item :label="item.attrName" v-for="(item, index) in staticAttrList" :key="index">
							<el-tag v-for="(label, i) in item.attrList" :key="i">{{ label }}</el-tag>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品图片" name="3">
						<el-alert title="上传图片,首张为商品主图,推荐上传大于[375*375]图片" type="warning" center show-icon :closable="false"></el-alert>
						<el-upload :action="$const.IMG_UPLOAD_URL" :on-error="uploadErr" :on-success="uploadSuccess" list-type="picture-card"
						 :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :headers="uploadHeader">
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible"><img width="100%" :src="dialogImageUrl" alt="" /></el-dialog>
					</el-tab-pane>
					<el-tab-pane label="商品内容" name="4">
			<!-- 			<el-alert title="推荐图片宽度为350px" type="warning" center show-icon :closable="false"></el-alert> -->
						<quill-editor v-model="goodsForm.goodsDetail" ref="myQuillEditor" :options="editorOption"></quill-editor>
						<el-button type="primary" style="margin-top: 15px;" @click="submit">添加商品</el-button>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import {
		quillEditor,
		Quill
	} from 'vue-quill-editor'
	import {
		container,
		ImageExtend,
		QuillWatch
	} from 'quill-image-extend-module'
	Quill.register('modules/ImageExtend', ImageExtend)


	import BreadCrumb from '@/components/main/common/bread-crumb.vue';
	export default {
		components: {
			BreadCrumb,
			quillEditor
		},
		data() {
			return {
				tabIndex: '0',
				// 商品表单相关
				goodsForm: {
					goodsHeaderImg: []
				},
				goodsFormRules: {
					goodsName: [{
						required: true,
						message: '请输入商品名称',
						trigger: 'blur'
					}],
					goodsPrice: [{
						required: true,
						message: '请填写正确的金额,保留两位小数',
						pattern: /(^[\d]|^[1-9][\d]*)($|[\.][\d]{0,2}$)/
					}],
					goodsWeight: [{
						required: true,
						message: '请填写商品重量'
					}],
					cateId: [{
						required: true,
						message: '请输入商品类别'
					}],
					goodsCount: [{
						required: true,
						message: '请输入商品库存',
						trigger: 'blur'
					}, {
						type: 'number',
						message: '数量必须为数字值'
					}]
				},
				// 商品分类
				cateData: [],
				// 动态属性：
				dynamicAttrList: [],
				staticAttrList: [],

				// 商品图片相关
				dialogVisible: false,
				dialogImageUrl: '',

				// 富文本相关
				editorOption: {
					modules: {
						ImageExtend: {
							loading: true,
							name: 'file',
							action: this.$const.IMG_UPLOAD_URL,
							response: (res) => {
								console.log(res);
								return res.data.url
							},
							change: (xhr, formData) => {
								console.log(xhr, formData);
								xhr.setRequestHeader('token', this.$cookie.get('token'))
								// formData.append('type', 1)
							} // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
						},
						toolbar: {
							container: container,
							handlers: {
								'image': function() {
									QuillWatch.emit(this.quill.id)
								}
							}
						}
					}
				}
			};
		},
		created() {
			this.innitGoodCate();
		},
		methods: {
			innitGoodCate() {
				this.$get('/cate?scope=part').then(data => {
					if (!data) return;
					this.cateData = data;
				});
			},
			// tabs切换前置通知
			beforeLeaveTab(tabIndex, oldTabIndex) {
				let errMsg = '';
				// 商品基本信息填写完王第二步跳转
				if (oldTabIndex == 0) {
					let rules = ['goodsName', 'goodsPrice', 'goodsWeight', 'cateId', 'goodsCount'];
					this.$refs.goodsFormRef.validateField(rules, res => {
						errMsg = res;
					});
				}
				return errMsg ? false : true;
			},
			// tab选中触发
			tabClick() {
				if (this.tabIndex == '1') {
					this.$get(`/attr/${this.cateId}/dynamic`).then(res => {
						if (!res) return;
						res.forEach(item => {
							item.attrList = item.attrList && item.attrList.length > 0 ? item.attrList.split(',') : [];
						});
						this.dynamicAttrList = res;
					});
				} else if (this.tabIndex == '2') {
					this.$get(`/attr/${this.cateId}/statics`).then(res => {
						if (!res) return;
						console.log(res);
						res.forEach(item => {
							item.attrList = item.attrList && item.attrList.length > 0 ? item.attrList.split(',') : [];
						});
						this.staticAttrList = res;
					});
				}
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleRemove(res) {
				let fileurl = res.response.data.url;
				// 从列表中移除
				this.goodsForm.goodsHeaderImg.remove(fileurl);
				this.$message.success('图片删除成功！');
			},
			uploadErr(res) {
				this.$message.success(res.msg);
			},
			uploadSuccess(res) {
				if (res.status == 200) {
					this.$message.success('图片上传成功!');
					this.goodsForm.goodsHeaderImg.push(res.data.url);
				} else {
					this.$message.error(res.msg);
				}
			},
			// 提交商品
			submit() {
				this.$refs.goodsFormRef.validate(valid => {
					if (!valid) return;
					if (this.goodsForm.goodsHeaderImg.length <= 0) {
						this.$message.error(`请上传商品主图！`);
						return;
					}
					if (!this.goodsForm.goodsDetail) {
						this.$message.error(`请填写商品详情！`);
						return;
					}
					this.goodsForm.goodsHeaderImg = this.goodsForm.goodsHeaderImg.join(",")
					this.goodsForm.cateId = this.cateId
					this.$post("/goods/add_goods", this.goodsForm).then(res => {
						this.$message.success(`商品上传成功`)
						this.$router.push("/goods_list")
					})
				});
			},
			changCate(val) {
				if (val.length != 2) {
					this.$message.error(`商品分类必须选择二级分类`)
					this.goodsForm.cateId = []
				}
			}
		},
		computed: {
			cateId() {
				return this.goodsForm.cateId.length > 0 ? this.goodsForm.cateId[this.goodsForm.cateId.length - 1] : -1;
			},
			uploadHeader() {
				return {
					token: this.$cookie.get('token')
				};
			}
		}
	};
</script>

<style scoped>
	.el-tag {
		margin-right: 15px;
	}

	.quill-editor {
		width: 900px;
	}

	.ql-editor {
		min-height: 300px !important;
	}

	.el-alert {
		margin-bottom: 15px;
	}
</style>
