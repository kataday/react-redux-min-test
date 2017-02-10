var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: [
		'./src/app.js'
	],
	
	output: {
		// path: path.join(__dirname, 'dist/'),
		path: 'www/',
		filename: 'bundle.js',
		publicPath: '/'
	},
	
	resolve: {
		extensions: ['', '.scss', '.css', '.js', '.json', 'jsx'],
		modulesDirectories: [
			'node_modules',
			path.resolve(__dirname, './node_modules')
		]
	},
	
	cache: true,
	
	module: {
		loaders: [
			{
				test: /(\.js|\.jsx)$/,
				exclude: /node_modules/,
				loader: 'babel'
			}
		]
	},
	
	plugins: [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('development')
			}
		}),
		new webpack.NoErrorsPlugin()
	]
}