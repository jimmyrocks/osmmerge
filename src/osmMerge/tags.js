module.exports = {
  mapUsgs: function(usgsTags) {
    var newTags = {},
      tagMap = {
        'city': function(v) {
          newTags['addr:city'] = v;
        },
        'name': function(v) {
          newTags.name = v;
        },
        'fcode': function(v) {
          var fcodeMap = {
            '73002': {
              'amenity': 'school'
            },
            '74036': {
              'amenity': 'prison'
            },
            '82010': {
              'amenity': 'grave_yard'
            },
            '80012': {
              'amenity': 'hospital'
            },
            '73006': {
              'amenity': 'university'
            },
            '78006': {
              'amenity': 'post_office'
            },
            '74034': {
              'amenity': 'police'
            },
            '74026': {
              'amenity': 'fire_station'
            }
          };
          if (fcodeMap[v]) {
            for (var k in fcodeMap[v]) {
              newTags[k] = fcodeMap[v][k];
            }
          }
        },
        'state': function(v) {
          newTags['addr:state'] = v.toUpperCase();
        },
        'gaz_id': function(v) {
          newTags['gnis:feature_id'] = v;
        },
        'address': function(v) {
          newTags['addr:housenumber'] = v.split(' ')[0];
          newTags['addr:street'] = v.split(' ').slice(1).join(' ');
        },
        'zipcode': function(v) {
          newTags['addr:postcode'] = v;
        }
      };
    newTags['addr:country'] = 'USA';
    for (var key in usgsTags) {
      var lkey = key.toLowerCase();
      if (tagMap[lkey]) {
        tagMap[lkey](usgsTags[key]);
      }
    }
    return newTags;
  },
  toTable: function(tags, extras) {
    var table = L.DomUtil.create('table', 'tags');
    var td, tr;
    for (var row in tags) {
      tr = L.DomUtil.create('tr', 'tags');
      td = L.DomUtil.create('td', 'tags');
      td.textContent = row;
      tr.appendChild(td);
      td = L.DomUtil.create('td', 'tags');
      td.textContent = tags[row];
      tr.appendChild(td);
      if (extras) {
        extras = [].concat(extras);
        for (var i = 0; i < extras.length; i++) {
          td = L.DomUtil.create('td', extras[i]);
          tr.appendChild(td);
        }
      }
      table.appendChild(tr);
    }
    var container = L.DomUtil.create('div');
    container.appendChild(table);
    return container.innerHTML;
  }
};
