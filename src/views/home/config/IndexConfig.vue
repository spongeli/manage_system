<template>
	<div>
		<!-- 面包屑导航区 -->
		<bread-crumb :breadcrumbItem="['配置管理', '首页配置']"></bread-crumb>

		<!-- 卡片区 -->
		<el-card>

			<el-button type="primary" @click="addConfigBanner">添加配置</el-button>
			<el-table :data="configList" stripe border empty-text="--">
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column label="类型" width="100px" align="center">
					<template slot-scope="scope">
						{{scope.row.type == 0 ?'轮播图':scope.row.type == 1?"精品推荐":"活动专区"}}
					</template>
				</el-table-column>
				<el-table-column prop="imgSrc" label="图片" width="100px">
					<template slot-scope="scope">
						<el-image style="width: 80px;height: 50px;" :src="scope.row.imgSrc" :preview-src-list="[scope.row.imgSrc]"></el-image>
					</template>
				</el-table-column>
				<el-table-column prop="backGroundColor" label="背景色" >
					<template slot-scope="scope">
						<div style="width: 60px;height: 30px;" :style="{ 'background-color': scope.row.backGroundColor }"></div>
					</template>
				</el-table-column>
				<el-table-column prop="level" label="级别" width="50px" align="center"></el-table-column>
				<el-table-column prop="goodsId" label="关联商品id"></el-table-column>
				<el-table-column prop="goodsName" label="关联商品名称"></el-table-column>
				<el-table-column prop="activityName" label="活动名称"></el-table-column>
				<el-table-column prop="activityPath" label="活动路由地址"></el-table-column>
				<el-table-column prop="status" label="是否有效">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.status" @change="changStatus(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column prop="clickStatus" label="是否关联超连接">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.clickStatus" @change="changStatus(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteConfig(scope.row)"></el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 添加图片对话框 -->
		<el-dialog title="添加配置" :visible.sync="addDialogVisible" width="30%" :before-close="handleClose">
			<el-form :model="addbannerForm" :rules="addbannerFormRules" ref="addbannerFormRef" label-width="100px">
				<el-form-item label="配置类型">
					<el-select v-model="addbannerForm.type">
						<el-option label="轮播图" value="0"></el-option>
						<el-option label="精品推荐" value="1"></el-option>
						<el-option label="活动专区" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="配置图片" prop="imgSrc" class="item-upload-container">
					<el-upload class="avatar-uploader" :action="uploadImgUrl" :show-file-list="false" :on-success="handleAvatarSuccess"
					 :on-error="handleAvatarErr" :headers="uploadHeader">
						<img v-if="addbannerForm.imgSrc" :src="addbannerForm.imgSrc" class="avatar" />
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="背景颜色" v-if="addbannerForm.type == 0" prop="backGroundColor">
					<div class="v-f" style="line-height: 40px;">
						<el-input placeholder="请输入RGB颜色" style="width: 150px;" v-model="addbannerForm.backGroundColor" clearable></el-input>
						<div style="width: 30px;height: 20px;margin: auto 0;margin-left: 10px;" :style="{ 'background-color': addbannerForm.backGroundColor }"></div>
					</div>
				</el-form-item>
				<el-form-item v-if="addbannerForm.type != 2" label="跳转产品">
					<el-select v-model="addbannerForm.goodsId" @change="changSelect" filterable remote reserve-keyword placeholder="请输入关键词"
					 :remote-method="queryGoods" :loading="loading">
						<el-option v-for="item in options" :key="item.goodsId" :label="item.goodsName" :value="item.goodsId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="活动名称" v-if="addbannerForm.type == 2">
					 <el-input v-model="addbannerForm.activityName"></el-input>
				</el-form-item>
				<el-form-item label="跳转路由" v-if="addbannerForm.type == 2">
					 <el-input v-model="addbannerForm.activityPath"></el-input>
				</el-form-item>
				<el-form-item label="显示优先级">
					<el-input-number v-model="addbannerForm.level" :min="1" :max="10"></el-input-number>
				</el-form-item>
				<el-form-item label="是否上线">
					<el-switch v-model="addbannerForm.status" @change="statusChange"></el-switch>
				</el-form-item>
				<el-form-item label="是否可跳转">
					<el-switch v-model="addbannerForm.clickStatus" @change="clickStatusChange"></el-switch>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitAdd">确 定</el-button>
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
				// 列表数据
				configList: [],

				// 弹框数据
				uploadImgUrl: 'http://127.0.0.1:8888/mall/manager/upload/img',
				addDialogVisible: false,
				addbannerForm: {
					type: '0',
					imgSrc: '',
					level: 9,
					clickStatus: true,
					status: true,
					backGroundColor: ""
				},
				addbannerFormRules: {
					imgSrc: [{
						required: true,
						message: '请上传轮播图',
						trigger: 'change'
					}],
					backGroundColor: [{
						required: true,
						message: '请输入轮播图背景色',
						trigger: 'blur	'
					}],
				},
				options: [],
				loading: false
			};
		},
		created() {
			this.innitIndexConfig();
		},
		methods: {
			innitIndexConfig() {
				this.$get('/index?scope=all').then(res => {
					if (!res) return;
					res.forEach(item => {
						item.status = item.status == 0
						item.clickStatus = item.clickStatus == 0
					});
					this.configList = res
				});
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			addConfigBanner() {
				// this.addbannerForm.type = 0
				this.addDialogVisible = true;
			},
			handleAvatarSuccess(res, file) {
				if (res.status != 200) {
					this.$message.error("文件上传失败")
					return
				}
				this.addbannerForm.imgSrc = res.data.url;
			},
			handleAvatarErr(file) {
				console.log(`失败了`, file);
			},
			//
			queryGoods(value) {
				if (!value) return;
				this.$get(`/goods/${value}/query`).then(res => {
					this.options = res;
					console.log(this.options);
				});
			},
			changSelect(value) {
				this.addbannerForm.goodsName = this.options.filter(item => item.goodsId == value)[0].goodsName;
				console.log(this.addbannerForm);
			},
			statusChange(value) {
				console.log(value)
				this.addbannerForm.status = value
			},

			clickStatusChange(value) {
				this.addbannerForm.clickStatus = value
			},
			// 提交
			submitAdd() {
				console.log(this.addbannerForm);
				let data = JSON.parse(JSON.stringify(this.addbannerForm))
				data.status = data.status ? 0 : 1
				data.clickStatus = data.clickStatus ? 0 : 1
				data.type = Number(data.type)
				this.$post("/index", data).then(res => {
					if (!res) return
					this.$message.success("上传成功")
					this.addDialogVisible = false
					this.innitIndexConfig()
					this.$refs.addbannerFormRef.resetFields();
				})
			},
			deleteConfig(config) {
				this.$confirm('此操作将永久删除该配置, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$post(`/index/${config.id}/delete`).then(res => {
						if (!res) return
						this.$message.success('删除成功!');
						this.innitIndexConfig()
					})
				}).catch(() => {
					this.$message.success('已取消删除!');
				});
			},
			changStatus(row) {
				let inparam = {
					status: row.status ? 0 : 1,
					clickStatus: row.clickStatus ? 0 : 1
				}

				this.$post(`/index/${row.id}/update`, inparam).then(res => {
					if (res) {
						this.$message.success("修改成功")
					} else {
						this.$message.error("修改成功")
					}
				})
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

<style>
	.item-upload-container .el-form-item__label {
		line-height: 120px;
	}

	.item-upload-container .avatar-uploader {
		height: 120px;
	}

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409eff;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 120px;
		height: 120px;
		line-height: 120px;
		text-align: center;
	}

	.avatar {
		width: 120px;
		height: 120px;
		display: block;
	}
</style>
