const VueLoaderPlugin = require('vue-loader/lib/plugin')
let path = require('path');
let config = require('./config');
let webpack = require('webpack');


function resolve(relPath) {
    return  path.resolve(__dirname, relPath);
}

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'js/[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'GK': resolve('../src/common/js/gk.api.js'),
            '$http': resolve('../src/api/http.js')
        }
    },
    module: {
        rules: [{
                test: /\.vue$/,
                use: ["vue-loader"]
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        name: 'images/[name].[hash:7].[ext]' // 将图片都放入 images 文件夹下，[hash:7]防缓存
                    }
                }]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash:7].[ext]' // 将字体放入 fonts 文件夹下
                    }
                }]
            }
        ]
    },
    
    plugins: [
        new VueLoaderPlugin(),
        new webpack.ProvidePlugin({
            GK: 'GK',
            http: '$http'
        }),
         new webpack.DefinePlugin({
            'process.env': config.prod.env
        }),
    ]
}