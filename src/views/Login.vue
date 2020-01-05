<template>
	<div class="login_body">
		<div class="login_content">
			<div class="login_login"><img src="../assets/logo.png" /></div>
			<div class="form_body">
				<el-form ref="form" :rules="rules" :model="form">
					<!-- 用户名 -->
					<el-form-item prop="username">
						<el-input prefix-icon="icon iconfont icon-yonghu"  v-model="form.username" placeholder="请输入用户名"></el-input>
					</el-form-item>
					<!-- 密码 -->
					<el-form-item prop="password" >
						<el-input prefix-icon="icon iconfont icon-suo" v-model="form.password" placeholder="请输入密码" show-password></el-input>
					</el-form-item>
					<el-form-item class="form_btns">
						<el-button type="primary" @click="loginEvent">登陆</el-button>
						<el-button type="info" @click="reset">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import { requestPost } from '../network/request.js';
export default {
	name: 'Login',
	data() {
		return {
			form: {
				username: 'admin',
				password: '123456'
			},
			rules:{
				username:[
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				],
				password:[
					{ required: true, message: '请输入密码', trigger: 'blur' }
				]
			}
		};
	},
	methods: {
		loginEvent() {
			// 表单验证
			this.$refs['form'].validate(valid => {
				if(!valid) return false;
				this.$post('/user/login', this.form).then(data => {
					if (!data) return; //兼容错误的时候，data没有数据
					// 登陆成功
					// 保存登陆信息 expires 7 day
					this.$cookie.set('userinfo', JSON.stringify(data.data), { expires: 7, path: '/' });
					this.$cookie.set('token', data.data.token, { expires: 7, path: '/' });
					this.$message({
						message: '登陆成功',
						type: 'success'
					});
					// 跳转页面
					this.$router.replace('/home');
				});
			})
			
		},
		reset() {
			this.$refs['form'].resetFields();
		}
	}
};
</script>
<style scoped>
.login_body {
	width: 100%;
	height: 100%;
	margin: auto auto;
	background-color: #2b4b6b;
	display: flex;
	justify-content: center;
	align-items: center;
}

.login_content {
	width: 450px;
	height: 300px;
	background-color: #ffffff;
	position: relative;
}

.login_login {
	position: absolute;
	width: 130px;
	height: 130px;
	padding: 8px;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	border-radius: 50%;
	background-color: #ffffff;
	box-shadow: 0 0 10px #eee;
}

.login_login > img {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background-color: #eeeeee;
}
.form_btns {
	display: flex;
	justify-content: flex-end;
}
.form_body {
	margin-top: 100px;
	padding: 0 20px;
}
</style>
