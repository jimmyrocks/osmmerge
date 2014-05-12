var koa = require('koa'),
  koaPg = require('koa-pg'),
  route = require('koa-route'),
  routes = require('./routes'),
  settings = require('./settings')
  app = koa();

app.use(koaPg('postgres://postgres:' + settings.password + '@localhost:5432/' settings.db_name + '))';

for (var currRoute in routes) {
  app.use(route.get(currRoute, routes[currRoute]));
}

app.listen(8000);
