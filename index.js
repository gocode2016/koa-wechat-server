const koa =require('koa')
const app =new koa()

const static =require('koa-static')
const bodyParser=require('koa-bodyparser')
const router=require('koa-router')();
const cors=require('koa-cors')
const jwtKoa  = require('koa-jwt');      // 用于路由权限控制
const errorHandle=require('utils/errorHandle.js')
//引入外面的路由
const login=require('./routes/login')

// 配置静态web服务的中间件
app.use(static(__dirname+'/static'))
// 配置bodyparser的中间件
app.use(bodyParser())
/* 路由权限控制 */
app.use(jwtKoa({ secret: secret }).unless({
    // 设置login、register接口，可以不需要认证访问
    path: [
        /^\/account\/login/,
        /^\/account\/register/,
        /^((?!\/account).)*$/   // 设置除了私有接口外的其它资源，可以不需要认证访问
    ]
}));
app.use(async (ctx,next)=>{
    ctx.body="koa 后台主页"
    await next();/*当前路由匹配完毕以后继续向下匹配*/

    if(ctx.status==404){
        ctx.body="这是个404页面"
    }
})
app
  .use(errorHandle) //会直接将 koa-jwt 暴露的错误信息直接返回给用户。
//使用外面的路由
router.use('/account',login)

//跨域
app.use(cors())
//配置路由  启动路由    没加响应头header，会自动加
app
    .use(router.routes())
    .use(router.allowedMethods())

app.listen('8888',()=>{
    console.log('server start at http://localhost:8888/')
})