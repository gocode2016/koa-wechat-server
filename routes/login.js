var router=require('koa-router')();
var db=require('../module/db.js');

//2.路由级中间件
router.post('/login',async (ctx,next)=>{
    const userinfo=ctx.request.body;
    const mes={
        flag:false,
        result:null
    }
    if(JSON.stringify(userinfo) == "{}"){
        ctx.body=mes
        await next();
    }else{
        const result=await db.findOne('Users',userinfo)
        if(result!==null&&result!==''){
            mes.flag=true;
            mes.result=result
            mes.token=jsonwebtoken.sign({
              data: result,
              // 设置 token 过期时间
              exp: Math.floor(Date.now() / 1000) + (60 * 60), // 60 seconds * 60 minutes = 1 hour
            }, secret)
        }
        ctx.body=mes
        await next();
    }
    
})
module.exports=router.routes()