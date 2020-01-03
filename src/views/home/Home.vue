<template>
	<el-container class="mall-container">
		<!-- 头部导航区 -->
		<el-header height="50px" class="mall-header v-f-s">
			<div class="header-title">电商后台管理平台</div>
			<el-button type="primary" plain @click="outLogin">退出</el-button>
		</el-header>
		<el-container>
			<!-- 左侧菜单区 导航区 -->
			<el-aside width="200px" class="mall-aside">
				<el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" :unique-opened="true">
					<!-- 一级菜单 -->
					<el-submenu index="1">
						<!-- 一级菜单内容 -->
						<template slot="title">
							<i class="el-icon-location"></i>
							<span>导航一</span>
						</template>
						<!-- 二级菜单 -->
						<el-menu-item>
							<i class="el-icon-location"></i>
							<span>导航一</span>
						</el-menu-item>
					</el-submenu>
					<el-submenu index="2">
						<template slot="title">
							<i class="el-icon-location"></i>
							<span>导航一</span>
						</template>
						<el-menu-item>
							<i class="el-icon-location"></i>
							<span>导航一</span>
						</el-menu-item>
					</el-submenu>
				</el-menu>


			</el-aside>
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
				
				this.$post("/user/out_login").then(res => {
					
					console.log(res)
					// this.$cookie.remove('userinfo');
					// this.$message({
					// 	type: 'success',
					// 	message: '退出成功'
					// });
					// this.$router.replace('/');
					
				});
			}
		}
	};
</script>

<style scoped>
	.mall-container {
		height: 100%;
	}

	.mall-header {
		background-color: #373d41;
	}

	.header-title {
		height: 50px;
		line-height: 50px;
		font-size: 25px;
		color: white;
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
