const path = require('path')

let srcPath = path.join(process.cwd(), 'src')
let outputPath = path.join(process.cwd(), 'build')

// load the reusable legacy webpack config from materia-widget-dev
let webpackConfig = require('materia-widget-development-kit/webpack-widget').getLegacyWidgetBuildConfig({
	preCopy: [
		{
			from: srcPath+'/player.js',
			to: outputPath
		}
	]
})

delete webpackConfig.entry['player.js']
webpackConfig.entry['player.css'] = [
	path.join(__dirname, 'src', 'player.html'),
	path.join(__dirname, 'src', 'player.css')
]

module.exports = webpackConfig
