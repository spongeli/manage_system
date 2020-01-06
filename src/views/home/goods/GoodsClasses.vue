<template>
	<div>
		<!-- 面包屑导航区 -->
		<bread-crumb :breadcrumbItem="['商品管理', '商品分类']"></bread-crumb>

		<!-- 卡片视图区域 -->
		<el-card class="box-card">
			<tree-table ref="treeTable" sum-text="sum" index-text="#" :data="data" :columns="columns" :stripe="props.stripe"
			 :border="props.border" :show-header="props.showHeader" :show-summary="props.showSummary" :show-row-hover="props.showRowHover"
			 :show-index="props.showIndex" :tree-type="props.treeType" :is-fold="props.isFold" :expand-type="props.expandType"
			 :selection-type="props.selectionType">
				<template slot="$expand" scope="scope">
					{{ `My name is ${scope.row.name},
			           this rowIndex is ${scope.rowIndex}.`
			         }}
				</template>
				<template slot="likes" scope="scope">
					{{ scope.row.likes.join(',') }}
				</template>
			</tree-table>
		</el-card>
	</div>
</template>

<script>
	import BreadCrumb from "@/components/main/common/bread-crumb.vue"
	export default {
		components: {
			BreadCrumb
		},
		data() {
			return {
				props: {
					stripe: false,
					border: false,
					showHeader: true,
					showSummary: false,
					showRowHover: true,
					showIndex: false,
					treeType: true,
					isFold: true,
					expandType: false,
					selectionType: false,
				},
				data: [{
						name: 'Jack',
						sex: 'male',
						likes: ['football', 'basketball'],
						score: 10,
						children: [{
								name: 'Ashley',
								sex: 'female',
								likes: ['football', 'basketball'],
								score: 20,
								children: [{
										name: 'Ashley',
										sex: 'female',
										likes: ['football', 'basketball'],
										score: 20,
									},
									{
										name: 'Taki',
										sex: 'male',
										likes: ['football', 'basketball'],
										score: 10,
										children: [{
												name: 'Ashley',
												sex: 'female',
												likes: ['football', 'basketball'],
												score: 20,
											},
											{
												name: 'Taki',
												sex: 'male',
												likes: ['football', 'basketball'],
												score: 10,
												children: [{
														name: 'Ashley',
														sex: 'female',
														likes: ['football', 'basketball'],
														score: 20,
													},
													{
														name: 'Taki',
														sex: 'male',
														likes: ['football', 'basketball'],
														score: 10,
													},
												],
											},
										],
									},
								],
							},
							{
								name: 'Taki',
								sex: 'male',
								likes: ['football', 'basketball'],
								score: 10,
							},
						],
					},
					{
						name: 'Tom',
						sex: 'male',
						likes: ['football', 'basketball'],
						score: 20,
						children: [{
								name: 'Ashley',
								sex: 'female',
								likes: ['football', 'basketball'],
								score: 20,
								children: [{
										name: 'Ashley',
										sex: 'female',
										likes: ['football', 'basketball'],
										score: 20,
									},
									{
										name: 'Taki',
										sex: 'male',
										likes: ['football', 'basketball'],
										score: 10,
									},
								],
							},
							{
								name: 'Taki',
								sex: 'male',
								likes: ['football', 'basketball'],
								score: 10,
								children: [{
										name: 'Ashley',
										sex: 'female',
										likes: ['football', 'basketball'],
										score: 20,
									},
									{
										name: 'Taki',
										sex: 'male',
										likes: ['football', 'basketball'],
										score: 10,
									},
								],
							},
						],
					},
					{
						name: 'Tom',
						sex: 'male',
						likes: ['football', 'basketball'],
						score: 20,
					},
					{
						name: 'Tom',
						sex: 'male',
						likes: ['football', 'basketball'],
						score: 20,
						children: [{
								name: 'Ashley',
								sex: 'female',
								likes: ['football', 'basketball'],
								score: 20,
							},
							{
								name: 'Taki',
								sex: 'male',
								likes: ['football', 'basketball'],
								score: 10,
							},
						],
					},
				],
				columns: [{
						label: 'name',
						prop: 'name',
						width: '400px',
					},
					{
						label: 'sex',
						prop: 'sex',
						minWidth: '50px',
					},
					{
						label: 'score',
						prop: 'score',
					},
					{
						label: 'likes',
						prop: 'likes',
						minWidth: '200px',
						type: 'template',
						template: 'likes',
					},
				],
			}
		},
		computed: {
			propList() {
				return Object.keys(this.props).map(item => ({
					name: item,
				}));
			},
		}
	}
</script>

<style>
</style>
