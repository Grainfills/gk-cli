# 说明
最大程度使用官方插件,简洁明了.

使用打包加速插件各种测试后,速度没有明显提升,可能有点玄学.

测试加速与不加速,打包项目耗时平均3.7s.取消加速插件,开启webpack.babel-loader缓存.

### 更新

axios 的 baseURL 放在/bin/.webpack.base..config.js中

添加 每次build前删除 dist.使用 Node rimraf 包.

修改 build 后模版名称,在prod.config---> HtmlWebpackPlugin 下的 filename

>rimraf:以包的形式包装rm -rf命令，就是用来删除文件和文件夹的，不管文件夹是否为空，都可以删除。 

### webpack2.0和4.0打包问题

样式显示不一样,查找用到的插件,单独安装后解决这个问题了.
