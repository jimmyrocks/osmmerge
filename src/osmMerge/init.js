var showIntro = function() {
  $('#sidebar')
    .empty();

  $('#sidebar')[0].appendChild(htmlWrap(L.osmMerge.content.sidebars.intro.header, 'h2'));
  $('#sidebar')[0].appendChild(htmlWrap(L.osmMerge.content.sidebars.intro.subheader, 'p'));
  $('#sidebar')[0].appendChild(L.osmMerge.content.sidebars.intro.content);

  L.osmMerge.controls.getByName('sidebar')[0].show();
},
htmlWrap = function(content, tag, id) {
  var temp = L.DomUtil.create(tag, id);
  temp.innerHTML = content;
  return temp;
};

module.exports = function(mapDiv, layers, defaultLayer) {
  L.osmMerge.tileLayers = layers || {
    'Bing (For OSM Digitizing)': new L.BingLayer('Arzdiw4nlOJzRwOz__qailc8NiR31Tt51dN2D7cm57NrnceZnCpgOkmJhNpGoppU', // OSM Bing Key
      {
        attribution: ['Bing Imagery',
          '<a href="http://www.usgs.gov" target="_blank">U.S. Geological Survey</a>',
          'OpenStreetMap'
        ].join(' | ')
      }),
    'NAIP (public domain)': new L.tileLayer('http://navigator.er.usgs.gov/tiles/tilecache.cgi/1.0.0/naip/{z}/{x}/{y}', {
      attribution: ['USGS National Agriculture Imagery Program',
        '<a href="http://www.doi.gov" target="_blank">U.S. Department of the Interior</a>',
        '<a href="http://www.usgs.gov" target="_blank">U.S. Geological Survey</a>',
        '<a href="http://www.usgs.gov/laws/policies_notices.html" target="_blank">Policies</a>'
      ].join(' | ')
    }),
    'MapQuest Open': new L.OSM.MapQuestOpen()
  };
  defaultLayer = defaultLayer || 'Bing (For OSM Digitizing)';

  map = new L.Map(mapDiv, {
    layers: [L.osmMerge.tileLayers[defaultLayer]],
    center: new L.LatLng(39.739094, -104.984898), //CO State Capitol
    zoom: 16,
    zoomControl: false
  });

  // Controls
  L.osmMerge.controls = [
    L.Control.extend({
      options: {
        position: 'topright',
        name: 'title'
      },
      onAdd: function(map) {
        var header = L.DomUtil.create('div', 'header'),
          title = L.DomUtil.create('h3', 'title');
        title.textContent = 'OsmMerge: Merge USGS Data into OpenStreetMap!';
        header.appendChild(title);
        return header;
      }
    }),
    L.control.layers(L.osmMerge.tileLayers, null, {
      position: 'bottomright',
      name: 'selector'
    }),
    L.control.zoom({
      position: 'topleft'
    }),
    L.control.sidebar('sidebar', {
      closeButton: false,
      position: 'left',
      name: 'sidebar'
    })
  ];
  L.osmMerge.controls.getByName = function(name) {
    return L.osmMerge.controls.filter(function(a) {
      return a && a.options && a.options.name === name;
    });
  };

  // Add the controls
  for (var i = 0; i < L.osmMerge.controls.length; i++) {
    if (!L.osmMerge.controls[i].addTo) {
      L.osmMerge.controls[i] = new L.osmMerge.controls[i]();
    }
    L.osmMerge.controls[i].addTo(map);
  }
  L.osmMerge.content.init();
  showIntro();
};
