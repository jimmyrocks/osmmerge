var showHeader = function() {
  $('.header').empty();
  $('.header')[0].appendChild(htmlWrap('h3', L.osmMerge.content.project.title + ': ' + L.osmMerge.content.project.tagline, 'title'));
},
  drawButtons = function(buttonList, id) {
    var button, buttonId, buttonObj, btnWidth,
      buttonContainer = L.DomUtil.create('div', id),
      buttonClick = function(e) {
        var btn = buttonList[$(e.target)[0].getAttribute('data-arrayindex')];
        if (btn.action) {
          for (var actionName in btn.action) {
            if (L.osmMerge.actions[actionName]) {
              L.osmMerge.actions[actionName].apply(this, btn.action[actionName]);
            }
          }
        }
      };
    btnWidth = (buttonList.length > 2) ? 'center-block' : 'col-md-6';
    for (buttonId = 0; buttonId < buttonList.length; buttonId++) {
      button = buttonList[buttonId];
      buttonObj = L.DomUtil.create('button', 'btn btn-' + (button.style || 'primary') + ' ' + btnWidth);
      buttonObj.setAttribute('data-arrayIndex', buttonId);
      buttonObj.textContent = button.title;
      $(buttonObj).on('click', buttonClick);
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
    for (var i = 0; i < content.length; i++) {
      $('#sidebar')[0].appendChild(content[i]);
    }
    $('.leaflet-sidebar')[0].style.zIndex = 1040;
    L.osmMerge.controls.getByName('sidebar')[0].show();
  },
  htmlWrap = function(tag, content, id, fandlebarsObj) {
    var temp = L.DomUtil.create(tag, id);
    temp.innerHTML = L.osmMerge.utils.fandlebars(content, fandlebarsObj || L.osmMerge.content);
    return temp;
  };

module.exports = function(mapDiv, layers, defaultLayer) {
  L.osmMerge.store = {};
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

  L.Icon.Default.imagePath = 'images';

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
    fandlebars: function(text, origTree) {
      // This is my quick and dirty version of handlebars
      var re = function(name) {
        return new RegExp('{{' + name + '}}', 'g');
      },
        replaceables,
        replaceAddress,
        replaceValueId,
        treeSearch = function(addresses, tree) {
          if (tree[addresses[0]]) {
            if (addresses.length > 0 && typeof(tree[addresses[0]]) === 'object') {
              return treeSearch(addresses.slice(1), tree[addresses[0]]);
            } else if (typeof(addresses.length === 1 && tree[addresses[0]]) === 'string') {
              return tree[addresses[0]];
            } else {
              return undefined;
            }
          } else {
            return undefined;
          }
        };
      if (Object.prototype.toString.call(origTree) === '[object Object]') {
        replaceables = text.match(re('.+?'));
        if (replaceables) {
          for (replaceValueId = 0; replaceValueId < replaceables.length; replaceValueId++) {
            replaceAddress = replaceables[replaceValueId].replace(re('(.+?)'), '$1').split('.');
            text = text.replace(replaceables[replaceValueId], treeSearch(replaceAddress, origTree));
          }
        }
      }

      return text;
    },
    setAttributes: function(htmlObject, attributes) {
      var attribute;
      for (attribute in attributes) {
        htmlObject.setAttribute(attribute, attributes[attribute]);
      }
      return htmlObject;
    }
  };

  L.osmMerge.actions = {
    'message': function(msg, title, delayedDisplay, persist) {
      var messageName = 'message-' + (Math.round(Math.random() * 10000)),
        outerDiv = L.DomUtil.create('div', 'modal fad ' + messageName),
        innerDiv = L.DomUtil.create('div', 'modal-dialog'),
        contentDiv = L.DomUtil.create('div', 'modal-content'),
        headerDiv = L.DomUtil.create('div', 'modal-header'),
        bodyDiv = L.DomUtil.create('div', 'modal-body'),
        footerDiv = L.DomUtil.create('div', 'modal-footer'),
        titleDiv = L.DomUtil.create('h4', 'label-' + messageName),
        closeBox = L.DomUtil.create('button', 'close');
      closeButton = L.DomUtil.create('button', 'btn btn-default');
      L.osmMerge.utils.setAttributes(closeBox, {
        'data-dismiss': 'modal',
        'aria-hidden': 'true'
      });
      L.osmMerge.utils.setAttributes(closeButton, {
        'data-dismiss': 'modal'
      });
      closeBox.innerHTML = '&times';
      closeButton.innerHTML = 'Close';
      L.osmMerge.utils.setAttributes(outerDiv, {
        'tabindex': '-1',
        'role': 'dialog',
        'aria-labelledby': 'label-' + messageName,
        'aria-hidden': 'true'
      });
      titleDiv.innerHTML = title || L.osmMerge.content.project.title + ': Message';
      bodyDiv.innerHTML = msg;
      footerDiv.appendChild(closeButton);
      headerDiv.appendChild(closeBox);
      headerDiv.appendChild(titleDiv);
      contentDiv.appendChild(headerDiv);
      contentDiv.appendChild(bodyDiv);
      contentDiv.appendChild(footerDiv);
      innerDiv.appendChild(contentDiv);
      outerDiv.appendChild(innerDiv);
      $('body').append(outerDiv);

      if (!delayedDisplay) {
        $('.' + messageName).modal();
        if (!persist) {
          $('.' + messageName).on('hidden.bs.modal', function(e) {
            $('.' + messageName).remove();
          });
        }
      }
      return messageName;
    },
    'beginMatching': function() {
      $('.header').empty();
      $.getJSON('get/new', function(data) {
        L.osmMerge.store.matchData = data;
        var osmPoint, usgsPoint;
        if (data && data.usgs_point) {
          //L.geoJson(JSON.parse(data.usgs_point)).addTo(map);
          usgsPoint = JSON.parse(data.usgs_point);
          usgsPoint.properties = data.usgs_tags;
        }
        if (data && data.osm_point) {
          //L.geoJson(JSON.parse(data.osm_point)).addTo(map);
          osmPoint = JSON.parse(data.osm_point);
          osmPoint.properties = data.osm_tags;
        }
        var matchLayer = L.geoJson([osmPoint, usgsPoint], {
          onEachFeature: function(feature, layer) {
            layer.bindPopup(JSON.stringify(feature, null, 2));
          }
        });
        matchLayer.addTo(map);
        map.fitBounds(matchLayer.getBounds());
      });
      showPage('match');
    },
    'sendMatch': function(status) {
      $.getJSON('/set/match' + 
        '/' + status + 
        '/' + L.osmMerge.store.matchData.usgs_id +
        '/' + L.osmMerge.store.matchData.osm_id + 
        '/' + L.osmMerge.store.matchData.matchid, function(data) {
        console.log('yay', data);
      });
      if (status === 'true') {
        showPage('tags')
      }
    }
  };

  // Add the controls
  for (var i = 0; i < L.osmMerge.controls.length; i++) {
    if (!L.osmMerge.controls[i].addTo) {
      L.osmMerge.controls[i] = new L.osmMerge.controls[i]();
    }
    L.osmMerge.controls[i].addTo(map);
  }
  showHeader();
  showPage('intro');
};
