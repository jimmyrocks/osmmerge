window.L = require('leaflet/dist/leaflet-src');
require('../src/plugins/Bing.js');
require('leaflet-osm');
require('leaflet-sidebar');
window.L.osmMerge = {
  init: require('../src/osmMerge/init.js'),
  content: require('../src/osmMerge/content.js')
};
