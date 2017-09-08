# todolist
Angular+Express+Node+Mongodb+Bootstrap实现一个简单的todolist
### 初始化项目
```
npm init
```
### 安装依赖
```
npm install
```
### 搭建工程目录

+ todolist
    + db
        - db_tools.js
    + static  
        + css     *存放css模块*
        + files   *存放文件*
        + fonts   *存放字体*
        + img     *存放图片*
        + vender  *存放第三方包*
            - @uirouter
            - angular
            - angular-sanitize
            - angular-ui-router
            - bootstrap
            - jquery
    + views
        + js    
            - clint.js   *存放前端业务逻辑的js代码*
        - tpls  *存放html模块*
    + app.js    *编写node后台代码*
    
### 搭建Mongodb数据库

* 全局安装mongodb
```
npm install mongodb -g
```
一定要在C盘根目录下创建data文件夹，在data文件夹下创建db文件夹
在CMD中使用```mongod```命令开启mongodb

### 编写后台代码 打通前后台

*   在clint.js中写入

```javascript
 alert('ok')//一会测试用 
```
* 在index.html中写入
 
```html
hello world<!-- 一会测试用 -->
```


*   编写app.js

```javascript
//引入express对象
const express = require('express');

//创建app实例
const app = express();

//监听80端口服务即开启服务器
app.listen(80,()=>{
    console.log('服务器已启动')
})
```
在根目录下打开命令行输入```node app.js ```启动服务器
打开浏览器输入127.0.0.1看页面上是否出现Cannot get/ 有则说明服务器开启成功
但是没有页面渲染出来

* 修改app.js 如下

```javascript
'ues strict';

//引入express对象
const express = require('express');

//引入express-art-template对象
const expressArtTemplate = require('express-art-template');


//创建app实例
const app = express();
//创建后台路由实例
const router = express.Router();

//配置模板引擎
app.engine('html', expressArtTemplate);
//express查找的时候也需要后缀名,
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production',
    extname: '.html', //自动补充后缀名的字符串
});
//告知express使用该引擎
app.set('view engine', 'html');
router.get('/',(req,res,next)=>{ 
    //通过node服务器响应首页
    res.render('index'); 
})
//使用路由中间件
app.use(router);
//监听80端口服务即开启服务器
app.listen(80,()=>{
    console.log('服务器已启动')
})
```
重启服务器```node app.js ```
此时页面出现hello world 却没有弹出1,说明主页已经渲染到页面前后台已经打通但是clint.js文件并未加载

* 在index.html中引入clint.js

```html
<script src="/views/js/clint.js"></script>
```
这是控制台报错 GET http://127.0.0.1/views/js/clint.js 404 (Not Found)，并未发现clint.js

这是因为后台并没有配置返回静态资源路由
 
 继续修改后台代码

 在app.js中添加


```javascript

 //使用静态资源中间件返回静态资源
app.use('/views',express.static('./views'));
```
重新启动服务器，这时页面出现hello worl并弹出'ok'

<h4>到目前为止，前后台已经打通接下来就该打通后台与数据库</h4>

#### 封装mongodb工具

在db_tools.js中编写代码如下：

```javascript
'use strict';
//通过mongodb对象获取客户端
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/todoList';

let dbTools = {};

//挂载添加功能
dbTools.insert = function(cName, arr, callback) {
    //连接服务器
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        //获取集合对象
        let collection = db.collection(cName);
        //操作集合CRUD
        collection.insertMany(arr, function(err, result) {
            if (err) throw err;
            db.close(); //关闭连接
            callback(err, result); //调用回调函数，走下一个流程
        });

    });
}
//删除数据
dbTools.delete = function(cName, filter, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        //获取集合对象
        let collection = db.collection(cName);
        //操作集合CRUD
        collection.deleteMany(filter, function(err, result) {
            if (err) throw err;
            db.close();
            callback(err, result);
        });
    });
}
//更新
dbTools.update = function(cName, filter, modify, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        //获取集合对象
        let collection = db.collection(cName);
        //操作集合CRUD
        collection.updateMany(filter, { $set: modify }, function(err, result) {
            if (err) throw err;
            db.close();
            callback(err, result)
        })
    });
}
//查询
dbTools.find = function(cName,filter,callback){
    MongoClient.connect(url,function(err,db){
    if(err) throw err;
    
    //获取集合对象
    let collection = db.collection(cName);
    //操作集合CRUD
    collection.find(filter).toArray(function(err,docs){
        if(err) throw err;
        db.close();
        callback(err,docs);
    })

});
}
//导出工具
module.exports = dbTools;
```
<h4>在app.js中引用工具</h4>

```javascript
//引入db工具
const db = require('./db/db_tools.js');
```