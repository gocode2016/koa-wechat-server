var koa =require('koa')
var app =new koa()
var static =require('koa-static')
var bodyParser=require('koa-bodyparser')
var router=require('koa-router')();
//引入外面的路由
var login=require('./routes/login')

// 配置静态web服务的中间件
app.use(static(__dirname+'/static'))
// 配置bodyparser的中间件
app.use(bodyParser())


//使用外面的路由
router.use('/login',login)


//配置路由  启动路由    没加响应头header，会自动加
app
    .use(router.routes())
    .use(router.allowedMethods())

app.listen('8888',()=>{
    console.log('server start at http://localhost:8888/')
})