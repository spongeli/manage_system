<template>
	<el-container class="mall-container">
		<el-header height="50px" class="mall-header"><el-button type="primary" plain @click="outLogin">退出</el-button></el-header>
		<el-container>
			<el-aside width="200px" class="mall-aside"></el-aside>
			<el-main class="mall-main"></el-main>
		</el-container>
	</el-container>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		outLogin() {
			this.$cookie.remove('userinfo');
			this.$message({
				type: 'success',
				message: '退出成功'
			});
			this.$router.replace('/');
		}
	}
};
</script>

<style scoped>
	.mall-container{
		height: 100%;
	}
.mall-header {
	background-color: #373d41;
}
.mall-aside {
	height: 100%;
	background-color: #333744;
}
.mall-main {
	background-color: #eaedf1;
	height: 100%;
	display: block;
	flex: 1;
}
</style>
