'ues strict';

//引入express对象
const express = require('express');

//引入express-art-template对象
const expressArtTemplate = require('express-art-template');

//引入db工具
const db = require('./db/db_tools.js');

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
//使用静态资源中间件返回静态资源
app.use('/views',express.static('./views'));
//监听80端口服务即开启服务器
app.listen(80,()=>{
    console.log('服务器已启动')
})