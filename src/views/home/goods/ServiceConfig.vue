<template>
	<div class="service-config-container">
		<!-- 面包屑导航区 -->
		<bread-crumb :breadcrumbItem="['商品管理','服务配置']"></bread-crumb>
		
		<!-- 卡片区域 -->
		<el-card>
			<el-row :gutter="15">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="serchForm.searchText" clearable class=""><el-button slot="append" icon="el-icon-search" @click="innitGoodsData"></el-button></el-input>
				</el-col>
				<el-col :span="2"><el-button type="primary" @click="addServiceConfig">添加服务配置</el-button></el-col>
			</el-row>
			
		</el-card>
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
			serchForm:{
				searchText:""
			}
		};
	},
	created() {
		
	},
	methods: {
		// 添加配置
		addServiceConfig(){
			
		}
	},
	
};
</script>

<style lang="scss">
.service-config-container {
}
</style>
