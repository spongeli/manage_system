<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item,index) in breadcrumbItem" :key="index">
				{{item}}
			</el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>

<script>
	export default {
		props:{
			breadcrumbItem:Array
		},
		data(){
			return{
			}
		}
	}
</script>

<style>
</style>
