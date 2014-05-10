var showIntro = function() {
  console.log('DON\'T USE THIS FUNCTION');
  showPage('intro');
    $('.header').empty();
    $('.header')[0].appendChild(htmlWrap('h3',L.osmMerge.content.project.title + ': ' + L.osmMerge.content.project.tagline, 'title'));
},
drawButtons = function(buttonList, id) {
  var button, buttonId, buttonObj,
  buttonContainer = L.DomUtil.create('div', id);
  for (buttonId=0; buttonId < buttonList.length; buttonId++) {
    button = buttonList[buttonId];
    buttonObj = L.DomUtil.create('button', 'btn btn-' + (button.style || 'primary'));
    buttonObj.textContent = button.title;
    buttonContainer.appendChild(buttonObj);
  }
  return buttonContainer;
},
showPage = function(page) {
  var pageObj;
  // Allow page name or page object to be passed in
  if (typeof(page) === 'string') {
    pageObj = L.osmMerge.content.sidebars[page];
  } else {
    pageObj = page;
  }
  var content = [
    htmlWrap('h2', pageObj.header, 'sidebarHeader'),
    htmlWrap('h4', pageObj.subheader, 'sidebarSubheader'),
    htmlWrap('p', pageObj.content, 'sidebarContent'),
    drawButtons(pageObj.buttons, 'sidebarButtons')
  ];

$('#sidebar').empty();
for (var i=0; i<content.length; i++) {
  $('#sidebar')[0].appendChild(content[i]);
}
L.osmMerge.controls.getByName('sidebar')[0].show();
},
htmlWrap = function(tag, content, id) {
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
        var header = L.DomUtil.create('div', 'header');
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
  L.osmMerge.utils = {
    fandleBars: function(text, replaceValues) {
      // This is my quick and dirty version of handlebars
      var re = function(name) {
        return new RegExp('{{' + name + '}}', 'g');
      },
        replaceValue;
      for (replaceValue in replaceValues) {
        if (text.search(re(replaceValue)) >= 0) {
          text = text.replace(re(replaceValue), replaceValues[replaceValue]);
        }
      }
      return text;
    }
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
