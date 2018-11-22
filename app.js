var koa =require('koa')
var app =new koa()
var views=require('koa-views')
// var common=require('./module/common.js')
var bodyParser=require('koa-bodyparser')
var static =require('koa-static')
var db=require('./module/db.js');
//引入外面的路由
var admin=require('./routes/admin')

// var Router=require('koa-router')
// var router=new Router();

//配置模板引擎中间件  --第三方中间件
//app.use(views('views',{map:{html:'ejs'}})) 另一种方式 .html
app.use(views('views',{
    extension:'ejs' //应用ejs模板引擎 .ejs
}))

// 配置静态web服务的中间件
app.use(static(__dirname+'/static'))

//ejs 公共的数据放在中间件，可以在模板的任何地方都可以用到
// ctx.state={
//     session:'adfnhcc',
//     title:'app'
// }

var router=require('koa-router')();
// 路由先app.use路由，再router
//1.应用级中间件 不写第一个参数，就是匹配所有路由
app.use(async (ctx,next)=>{
    ctx.state.userinfo="林斌"//ejs公共的数据
    console.log(new Date())
    await next();/*当前路由匹配完毕以后继续向下匹配*/

    if(ctx.status==404){
        ctx.body="这是个404页面"
    }
})
app.use(bodyParser())

//配置bodyparser的中间件
router.post('/login',async (ctx,next)=>{
    ctx.body=ctx.request.body;
})
//接受post提交的数据
// router.post('/login',async (ctx,next)=>{   
    // let str="";
    // //获取表单提交的数据
    // req.on('data',(data)=>{
    //     str+=data;
    // })
    // req.on('end',(data)=>{
    //     console.log(data)
    // })
//     var data=await common.getPostData(ctx);
//     console.log(data)
//     ctx.body=data
// })

//2.路由级中间件
router.get('/news',async (ctx,next)=>{
    console.log('news come in')
    await next();
}).get('/add',async (ctx,next)=>{
    const result=await db.insert('Users',{
        name:'林斌f',
        age:12,
        phone:13602113797
    })
    ctx.body=result
    await next();
}).get('/update',async (ctx,next)=>{
    const result=await db.update('Users',{
        name:'林斌1'
    },{
        name:'林斌f'
    })
    ctx.body=result
    await next();
}).get('/remove',async (ctx,next)=>{
    const result=await db.remove('Users',{
        name:'林斌f'
    })
    ctx.body=result
    await next();
})
//3.错误处理中间件

//4.第三方中间件

//ctx 上下文context  包涵了request和response等信息

router.get('/',async (ctx,next)=>{
    // ctx.body='首页'
    let title="您好！！"
    let arr=['1','2','3']
    let content="<h3>这是html的文件</h3>"
    let num=26
    await ctx.render('index',{
        title:title,
        list:arr,
        content:content,
        num:num
    })
}).get('/getParams',async (ctx,next)=>{
    // {id:123000} 用的最多的方式，获取的是对象
    console.log(ctx.query)
    // aid=123&name=zhangsan   获取的是字符串
    console.log(ctx.querystring)
    ctx.body='新闻'
    // ctx 里面的request里面获取get 传值
    console.log(ctx.request.url)
    console.log(ctx.request.query)
    console.log(ctx.request.querystring)
}).get('/login',async (ctx,next)=>{
    await ctx.render('login',{
    })
}).get("/dymic/:id",async (ctx)=>{
    console.log(ctx.params)
    //动态路由
    ctx.body="动态路由"
})
//使用外面的路由
router.use('/admin',admin)

//配置路由  启动路由    没加响应头header，会自动加
app
    .use(router.routes())
    .use(router.allowedMethods())

app.listen('3000',()=>{
    console.log('Web start at http://localhost:3000/')
})