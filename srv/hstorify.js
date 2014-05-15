 module.exports = function(obj) {
  var ret='';
  for (var k in obj) {
    ret += '"' + k + '"=>"' + obj[k].toString() + '", ';
  }
  if (ret.length > 3) {
    ret = ret.substr(0, ret.length - 2);
  }
  return ret;
};
