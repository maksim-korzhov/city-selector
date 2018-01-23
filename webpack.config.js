const path = require('path');
var StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: [
        './src/app.js'
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: 'pre',
                loaders: ['eslint-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                loaders: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    plugins: [
        new StyleLintPlugin({
            configFile: 'stylelint.config.js',
            context: 'src',
            files: '**/*.less',
            failOnError: false,
            quiet: false,
            syntax: 'less'
        }),
    ],
};
