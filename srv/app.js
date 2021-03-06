var koa = require('koa'),
  koaPg = require('koa-pg'),
  route = require('koa-route'),
  routes = require('./routes'),
  config = require('./config'),
  gzip = require('koa-gzip'),
  app = koa();

app.use(gzip());

app.use(koaPg(
  'postgres://' +
  config.database.username + ':' +
  config.database.password + '@' +
  config.database.host + ':' +
  config.database.port + '/' +
  config.database.db_name));

for (var currRoute in routes) {
  app.use(route.get(currRoute, routes[currRoute]));
}

app.listen(8000);
