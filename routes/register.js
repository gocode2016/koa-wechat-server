const bcrypt=require('bcrypt')//用于加密密码
var router=require('koa-router')();
var db=require('../module/db.js');

//2.路由级中间件
router.post('/register',async (ctx,next)=>{
    const { body } = ctx.request;
    try {
      if (!body.username || !body.password) {
        ctx.status = 400;
        ctx.body = {
          error: `expected an object with username, password but got: ${body}`,
        }
        return;
      }
      body.password = await bcrypt.hash(body.password, 5)
      let user = await User.findOne({ username: body.username });
      if (!user.length) {
        // 添加
        await db.insert('Users',{ username: body.username,password:body.password})
        ctx.status = 200;
        ctx.body = {
          message: '注册成功',
          user,
        }
      } else {
        ctx.status = 406;
        ctx.body = {
          message: '用户名已经存在',
        }
      }
    } catch (error) {
      ctx.throw(500)
    }
})
module.exports=router.routes()