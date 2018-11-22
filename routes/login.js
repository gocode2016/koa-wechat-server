var router=require('koa-router')();
var db=require('./module/db.js');

//2.路由级中间件
router.get('/',async (ctx,next)=>{
    console.log('news come in')
    ctx.body="这是主页"
    await next();
}).post('/add',async (ctx,next)=>{
    const result=await db.insert('Users',{
        name:'林斌f',
        age:12,
        phone:13602113797
    })
    ctx.body=result
    await next();
}).put('/update',async (ctx,next)=>{
    const result=await db.update('Users',{
        name:'林斌1'
    },{
        name:'林斌f'
    })
    ctx.body=result
    await next();
}).delete('/remove',async (ctx,next)=>{
    const result=await db.remove('Users',{
        name:'林斌f'
    })
    ctx.body=result
    await next();
})
module.exports=router.routes()