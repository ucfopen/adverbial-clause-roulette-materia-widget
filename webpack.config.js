const path = require('path')
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')
const entries = widgetWebpack.getDefaultEntries()

// use default creator
delete entries['creator.js']
delete entries['creator.css']

entries['player.js'] = [path.join(__dirname, 'src', 'player.js')]

let options = {
	entries: entries,
}

module.exports = widgetWebpack.getLegacyWidgetBuildConfig(options)

