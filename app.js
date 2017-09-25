'ues strict';

//引入express对象
const express = require('express');

//引入express-art-template对象
const expressArtTemplate = require('express-art-template');

//引入处理请求体数据的中间件
const bodyParser = require('body-parser');

//引入session中间件
const session = require('express-session');

//引入验证码对象
const captchapng = require('captchapng2');

//引入db工具
const db = require('./db/db_tools.js');

//创建app实例
const app = express();
//创建后台路由实例
const router = express.Router();
//创建业务路由
const apiRouter = express.Router();
//配置模板引擎
app.engine('html', expressArtTemplate);
//express查找的时候也需要后缀名,
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production',
    extname: '.html', //自动补充后缀名的字符串
});
//告知express使用该引擎
app.set('view engine', 'html');
router.get('/', (req, res, next) => {
    //通过node服务器响应首页
    res.render('index');

})

//配置业务路由规则
apiRouter.post('/check-username', (req, res, next) => {
        let user = req.body;
        db.find('users', { username: user.username }, (err, db_username) => {
            if (err) next(err);
            if (db_username.length > 0) {
                return res.json({
                    code: '002',
                    msg: '用户名已存在'
                })
            }
            res.json({
                code: '001',
                msg: '用户名可以使用'
            })
        })
    })
    .get('/get-yzm', (req, res, next) => {
        let rand = parseInt(Math.random() * 9000 + 1000);
        let png = new captchapng(80, 30, rand); // width,height, numeric captcha 
        //将答案挂载到session上
        req.session.vcode = rand;

        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(png.getBuffer());
    })
    .post('/check-yzm', (req, res, next) => {
        if (req.session.vcode != req.body.yzm) {
            return res.json({
                code: '003',
                msg: '验证码不正确'
            });
        }
        res.json({
            code:'001',
            msg: 'bingo'
        })
    })
    .post('/do-register', (req, res, next) => {
        let user = req.body;
        db.insert('users', [user], (err, result) => {
            if (err) next(err);
            if (result.insertedCount === 1) {
                return res.json({
                    code: '001',
                    msg: '注册成功'
                })
            }else{
                return res.json({
                    code:'002',
                    msg:'注册失败'
                })
            }
        })

    })

//使用session中间件
app.use(session({
    secret: 'todoList', //标识
    resave: false,
    //是否强制保存，储物柜内的数据没有发生改变，也整体全局往自己的存储区保存一次
    //否，没有改变，就不存，建议使用其
    saveUninitialized: true, // 没有操作数据，也分配session空间
}));
//解析post键值对formdata
app.use(bodyParser.urlencoded({ extended: false }));
//使用解析请求为json格式中间件
app.use(bodyParser.json());
//使用路由中间件
app.use(router);
//使用业务路由中间件
app.use('/api', apiRouter);


//使用静态资源中间件返回静态资源
app.use('/views', express.static('./views'));
//使用静态资源中间件返回静态资源中间件
app.use('/static', express.static('./static'));
//监听80端口服务即开启服务器
app.listen(80, () => {
    console.log('服务器已启动')
})