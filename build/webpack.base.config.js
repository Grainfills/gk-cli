const VueLoaderPlugin = require('vue-loader/lib/plugin');
let webpack = require('webpack');
let path = require('path')
let baseURL = "https://store.gorkor.com/";

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/style.js',
        publicPath: "/"
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
    },
    module: {
        rules: [{
            test: /\.vue$/,
            use: ["vue-loader"]
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader?cacheDirectory=true',
            include: path.resolve(__dirname, 'src')
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: 'images/[name].[hash:7].[ext]' // 将图片都放入 images 文件夹下，[hash:7]防缓存
                }
            }]
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]' // 将字体放入 fonts 文件夹下
                }
            }]
        }]
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'SERVICE_URL': JSON.stringify(baseURL)
        })
    ]
};