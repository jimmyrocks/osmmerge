var send = require('koa-send'),
  queries = require('./sql.json');
  distDir = '/' + __dirname.split('/').slice(1,-1).join('/') + '/dist',
module.exports = {
  '/': function * root() {
    console.log(distDir);
    yield send(this, distDir + '/index.html');
  },
  '/:file.:suffix': function * getFile(file, suffix) {
    yield send(this, distDir + '/' + file + '.' + suffix);
  },
  '/images/:file.png': function * getFile(file) {
    yield send(this, distDir + '/' + file + '.png');
  },
  '/get/new': function * getNewPoint(format) {
    var result = yield this.pg.db.client.query_(queries.select.randomPoint.join(''));
    this.body = JSON.stringify(result.rows[0], null, 2);
  }
};
