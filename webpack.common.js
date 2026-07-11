import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
	entry: './src/battleship.js',
	output: {
		filename: 'main.js',
		path: path.resolve(import.meta.dirname, 'dist'),
		clean: true,
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.html$/i,
				use: ['html-loader'],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
		],
	},
};
