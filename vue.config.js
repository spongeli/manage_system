module.exports = {
	// 关闭eslint校验
	lintOnSave: false,
	// 配置别名
	configureWebpack: {
		resolve: {
			alias: {}
		}
	},
	devServer: {
		proxy: {
			'/mall': {
				target: 'http://127.0.0.1:8888',
				changeOrigin: true
			}
		}
	}
}
