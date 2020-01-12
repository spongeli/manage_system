<template>
	<div>
		<!-- 面包屑导航区 -->
		<bread-crumb :breadcrumbItem="['配置管理', '首页配置']"></bread-crumb>

		<!-- 卡片区 -->
		<el-card>
			<el-tabs type="border-card">
				<el-tab-pane label="轮播图">
					<el-button type="primary" @click="addConfig">添加轮播图</el-button>
					<el-table :data="bannerList" stripe border>
						<el-table-column type="index" label="#"></el-table-column>
						<el-table-column prop="imgSrc" label="图片" width="100px">
							<template slot-scope="scope">
								<el-image style="width: 80px;height: 50px;" :src="scope.row.imgSrc" :preview-src-list="scaningBanner"></el-image>
							</template>
						</el-table-column>
						<el-table-column prop="level" label="级别" width="50px" align="center"></el-table-column>
						<el-table-column prop="goodsId" label="关联商品id"></el-table-column>
						<el-table-column prop="goodsName" label="关联商品名称"></el-table-column>
						<el-table-column prop="backGroundColor" label="背景色">
							<template slot-scope="scope">
								<div style="width: 60px;height: 30px;" :style="{ 'background-color': scope.row.backGroundColor }"></div>
							</template>
						</el-table-column>
						<el-table-column prop="status" label="状态">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.status"></el-switch>
							</template>
						</el-table-column>
						<el-table-column prop="clickStatus" label="是否关联超连接">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.clickStatus"></el-switch>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="热门推荐">热门推荐</el-tab-pane>
			</el-tabs>
		</el-card>

		<!-- 添加图片对话框 -->
		<el-dialog title="添加轮播图" :visible.sync="addDialogVisible" width="30%" :before-close="handleClose">
			<el-form :model="addbannerForm" :rules="addbannerFormRules" ref="addbannerFormRef" label-width="100px">
				<el-form-item label="轮播图">
					<el-upload class="avatar-uploader" :action="uploadImgUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :on-error="handleAvatarErr" :headers="uploadHeader">
						<img v-if="addbannerForm.imgSrc" :src="addbannerForm.imgSrc" class="avatar" />
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="背景颜色">
					<div class="v-f" style="line-height: 40px;">
						<el-input placeholder="请输入RGB颜色" style="width: 150px;" v-model="addbannerForm.backGroundColor" clearable></el-input>
						<div style="width: 30px;height: 20px;margin: auto 0;margin-left: 10px;" :style="{ 'background-color': addbannerForm.backGroundColor }"></div>
					</div>
				</el-form-item>
				<el-form-item label="跳转产品">
					<el-select
						v-model="addbannerForm.goodsId"
						@change="changSelect"
						filterable
						remote
						reserve-keyword
						placeholder="请输入关键词"
						:remote-method="queryGoods"
						:loading="loading"
					>
						<el-option v-for="item in options" :key="item.goodsId" :label="item.goodsName" :value="item.goodsId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="显示优先级"><el-input-number v-model="addbannerForm.level" :min="1" :max="10"></el-input-number></el-form-item>
				<el-form-item label="是否上线"><el-switch v-model="addbannerForm.status == 0"></el-switch></el-form-item>
				<el-form-item label="是否可跳转"><el-switch v-model="addbannerForm.clickStatus == 0"></el-switch></el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
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
			bannerList: [],
			recommendList: [],
			scaningRecommend: [],
			scaningBanner: [],

			// 弹框数据
			uploadImgUrl: 'http://127.0.0.1:8888/mall/manager/upload/img',
			addDialogVisible: false,
			addbannerForm: {
				imgSrc: '',
				level: 9,
				clickStatus:0,
				status:0
			},
			addbannerFormRules: {},
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
				res.banner.forEach(item => {
					if (item.type == 0) {
						this.scaningBanner.push(item.imgSrc);
					} else {
						this.scaningRecommend.push(item.imgSrc);
					}
				});
				this.bannerList = res.banner;
				this.recommendList = res.recommend;
			});
		},
		handleClose() {
			console.log(`弹框关闭了`);
		},
		addConfig() {
			this.addDialogVisible = true;
		},
		handleAvatarSuccess(res, file) {
			this.addbannerForm.imgSrc = URL.createObjectURL(file.raw);
			console.log(`成功了`, file, this.addbannerForm);
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
		}
	},
	computed: {
		uploadHeader() {
			return { token: this.$cookie.get('token') };
		}
	}
};
</script>

<style>
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
