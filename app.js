//加载express模块
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//创建app应用
var app = express();


app.use(bodyParser.urlencoded({
    extended: true
}));

// mongodb服务默认启动端口为27017 
// 连接到数据库 MyWeibo ,如果没有 MyWeibo 数据库，则会自动创建
mongoose.connect('mongodb://localhost:27017/MyWeibo', function (err) {
    if (err) {
        console.log("数据库连接失败");
    } else {
        console.log("数据库连接成功");
        //监听
        app.listen(8080);
    }
})

//路由规则
app.use('/', require('./routers/main'));

//设置静态文件托管
//当用户请求的路径以'/'开头时，直接返回__dirname + '/public'目录下文件
//第一个参数默认'/'，以下语句相当于 app.use('/',express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));