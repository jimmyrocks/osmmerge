var send = require('koa-send'),
  fandlebars = require('./fandlebars'),
queries = require('./sql.json'),
distDir = '/' + __dirname.split('/').slice(1, -1).join('/') + '/dist';
module.exports = {
  '/': function * root() {
    yield send(this, distDir + '/index.html');
  },
  '/:file.:suffix': function * getFile(file, suffix) {
    yield send(this, distDir + '/' + file + '.' + suffix);
  },
  '/images/:file.png': function * getFile(file) {
    yield send(this, distDir + '/images/' + file + '.png');
  },
  '/get/new': function * getNewPoint(format) {
    var result = yield this.pg.db.client.query_(queries.select.randomPoint.join(''));
    this.body = JSON.stringify(result.rows[0], null, 2);
  },
  '/get/test': function * getTestPoint(format) {
    var result = yield this.pg.db.client.query_(queries.select.test.join(''));
    this.body = JSON.stringify(result.rows[0], null, 2);
  },
  '/set/match/:usgsId/:osmId': function * matchPoints(usgsId, osmId) {
    var result = yield this.pg.db.client.query_(
      fandlebars(queries.insert.match.join(''), {
        'usgsId': usgsId,
        'osmId': osmId
      })
    );
    this.body = JSON.stringify(result.rows[0], null, 2);
  },
  '/get/test2/:textValue': function * getTest2(textValue) {
    var result = yield wait(1000, textValue);
    this.body = result;
  }
};

function wait(time, textValue) {
  return function(callback) {
    setTimeout(function() {
      callback(null, textValue);
    }, time);
  };
}
