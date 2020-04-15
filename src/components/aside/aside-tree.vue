<template>
	<div :width="isCollapse ? '64px' : '200px'" style="background-color: #333744;">
		<el-aside :width="isCollapse ? '64px' : '200px'" class="mall-aside">
			<div class="menus-tree-option" @click="menusTreeOption">|||</div>
			<el-menu
				:default-active="activePath"
				background-color="#333744"
				:router="true"
				text-color="#fff"
				active-text-color="#409EFF"
				:unique-opened="true"
				:collapse="isCollapse"
				:collapse-transition="false"
			>
				<!-- 一级菜单 -->
				<el-submenu v-for="item in menusTreeList" :key="item.id" :index="'/' + item.path">
					<!-- 一级菜单内容 -->
					<template slot="title">
						<i class="icon iconfont" :class="item.iconPath"></i>
						<span>{{ item.name }}</span>
					</template>
					<!-- 二级菜单 -->
					<el-menu-item v-for="item2 in item.childrenList" :key="item2.id" :index="'/' + item2.path">
						<i class="icon iconfont" :class="item2.iconPath"></i>
						<span>{{ item2.name }}</span>
					</el-menu-item>
				</el-submenu>
			</el-menu>
		</el-aside>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isCollapse: false,
			menusTreeList: []
		};
	},
	created() {
		this.innitMenusTree();
	},
	methods: {
		innitMenusTree() {
			this.$get('/menus').then(data => {
				if (!data) return;
				this.menusTreeList = data;
				// console.log(this.menusTreeList)
			});
		},
		menusTreeOption() {
			this.isCollapse = !this.isCollapse;
		}
	},
	computed: {
		activePath() {
			console.log(this.$route.path);
			let path = this.$route.path;
			if(path == '/add_goods'){
				path = '/goods_list'
			}
			return path;
		}
	}
};
</script>

<style>
.mall-aside {
	overflow: hidden;
}
.menus-tree-option {
	text-align: center;
	background-color: #4a5064;
	color: #e1e2e5;
	letter-spacing: 2px;
	height: 20px;
	line-height: 20px;
	cursor: pointer;
}
.iconfont {
	margin-right: 10px;
}
.el-submenu__title{
	width: 200px;
}
</style>
