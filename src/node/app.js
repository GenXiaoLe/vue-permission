const Koa = require('koa');
const app = new Koa();

const menu = require('./menu.json')

// 使用路由中间件
const Router = require('koa-router')();

Router.get('/pmn/user-auth', async (ctx, next) => {
  // 处理跨域问题
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');

  ctx.type = 'text/html;charset=utf-8';
  ctx.body = menu;
  next();
})

app.use(Router.routes())

app.listen(3000, () => { console.log('listen host: 3000') });