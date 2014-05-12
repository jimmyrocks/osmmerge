var koa = require('koa'),
  koaPg = require('koa-pg'),
  route = require('koa-route'),
  routes = require('./routes'),
  config = require('./config'),
  app = koa();

app.use(koaPg(
  'postgres://' + 
  config.database.username + ':' +
  config.database.password + '@' +
  config.database.host + ':' +
  config.database.port + '/' +
  config.db_name));

for (var currRoute in routes) {
  app.use(route.get(currRoute, routes[currRoute]));
}

app.listen(8000);
