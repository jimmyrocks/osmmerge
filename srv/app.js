var koa = require('koa'),
  koaPg = require('koa-pg'),
  route = require('koa-route'),
  routes = require('./routes'),
  config = require('./config')
  app = koa();

app.use(koaPg('postgres://postgres:' + config.password + '@localhost:5432/' config.db_name + '))';

for (var currRoute in routes) {
  app.use(route.get(currRoute, routes[currRoute]));
}

app.listen(8000);
