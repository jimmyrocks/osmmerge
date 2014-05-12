var koa = require('koa'),
  koaPg = require('koa-pg'),
  route = require('koa-route'),
  routes = require('./routes'),
  app = koa();

app.use(koaPg('postgres://postgres:password@localhost:5432/usgs'));

for (var currRoute in routes) {
  app.use(route.get(currRoute, routes[currRoute]));
}

app.listen(8000);
