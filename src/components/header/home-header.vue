<template>
	<div class="v-f-s">
		<!-- 头部导航区 -->
		<div class="header-title">电商后台管理平台</div>
		<div class="header-right">
			<span>当前登陆用户：admin</span>
			<el-button type="primary" plain @click="outLogin">退出</el-button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		// 退出登录
		outLogin() {
			this.$post('/user/out_login').then(res => {
				if (!res) return;
				console.log(res);
				this.$cookie.remove('userinfo');
				this.$message({
					type: 'success',
					message: '退出成功'
				});
				this.$router.replace('/login');
			});
		}
	}
};
</script>

<style scoped>
.header-title {
	height: 50px;
	line-height: 50px;
	font-size: 25px;
	color: white;
}

.header-right {
	margin: auto 0;
	color: white;
}
.header-right > span {
	margin-right: 10px;
}
</style>
