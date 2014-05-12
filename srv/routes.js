var send = require('koa-send'),
  queries = require('./sql.json');
module.exports = {
  '/': function * root() {
    yield send(this, '/home/jim/dev/osmmerge/dist/index.html');
  },
  '/:file.:suffix': function * getFile(file, suffix) {
    yield send(this, '/home/jim/dev/osmmerge/dist/' + file + '.' + suffix);
  },
  '/images/:file.png': function * getFile(file) {
    yield send(this, '/home/jim/dev/osmmerge/dist/images/' + file + '.png');
  },
  '/get/new': function * getNewPoint(format) {
    var result = yield this.pg.db.client.query_(queries.select.randomPoint.join(''));
    this.body = JSON.stringify(result.rows[0], null, 2);
  }
};
