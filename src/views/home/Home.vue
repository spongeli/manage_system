<template>
	<el-container class="mall-container">
		<!-- 头部导航区 -->
		<el-header height="50px" class="mall-header">
			<!-- 头部导航组件 -->
			<home-header></home-header>
		</el-header>
		<el-container>
			<!-- 左侧菜单区 导航区 -->
			<aside-tree></aside-tree>
			<!-- 右侧主面板区 -->
			<el-main class="mall-main"><router-view></router-view></el-main>
		</el-container>
	</el-container>
</template>

<script>
import homeHeader from '../../components/header/home-header.vue';
import asideTree from '../../components/aside/aside-tree.vue';
export default {
	components: {
		homeHeader,
		asideTree
	},
	data() {
		return {};
	},
	created() {},
	methods: {}
};
</script>

<style scoped>
.mall-container {
	height: 100%;
}
.mall-header {
	background-color: #373d41;
}
</style>
