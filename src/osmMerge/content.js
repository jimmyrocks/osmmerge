// Contains content for all of the overlays

module.exports = {
  'project': {
    'title': 'osmMerge',
    'tagline': 'Merging USGS data into OpenStreetMap',
    'description': 'Merge data from <a href="http://navigator.er.usgs.gov">the USGS National Map Corps Project</a> into <a href="http://osm.org">OpenStreetMap</a>. Through crowdsourcing!',
    'authors': {
      'jim': {
        'name': 'James McAndrew',
        'email': 'jim@loc8.us',
        'image': 'https://avatars0.githubusercontent.com/u/98192?s=460',
        'description': 'Jim is a student at the <a href="http://du.edu">University of Denver</a> ' +
          'studying <a href="http://www.du.edu/nsm/departments/geography/degreeprograms/graudateprograms/mastersgisc/index.html"> ' +
          'Geographic Information Science</a>. He is also a web map developer with the ' +
          '<a href="http://nps.giv/npmap/team/jim-mcandrew">NPMap team</a> of the ' +
          '<a href="http://nps.gov">National Park Service</a>.',
      },
      'github': {
        'showBanner': false,
        'link': 'http://github.com/jimmyrocks/osmMerge'
      }
    }
  },
  'sidebars': {
    'intro': {
      'header': '{{project.title}}',
      'subheader': '{{project.description}}',
      'content': 'Welcome to osmMerge, where we are using crowdsourcing ' +
        'to merge point data from the USGS National Map Corps project ' +
        'into OpenStreetMap.<br/>Click the buttons below to continue',
      'buttons': [{
        'title': 'Demo',
        'action': {
          'message': ['Demo not implemented yet.', 'No Demo']
        }
      }, {
        'title': 'Begin',
        'action': {
          'beginMatching': null
        }
      }]
    },
    'match': {
      'header': 'Verify Match',
      'subheader': 'Are these two points the same?',
      'content': 'Please verify that these two points refer to the same ' +
        'place in both the USGS and OpenStreetMap projects by clicking ' +
        'on the buttons below. <br><br>' +
        'You can click on the placemarkers to read the information about ' +
        'point on the map. ',
      'buttons': [{
        'title': 'Yes, they match',
        'style': 'success',
        'action': {
          'sendMatch': ['true'],
          'showTagPage': ['usgs']
        }
      }, {
        'title': 'No, these are different',
        'style': 'danger',
        'action': {
          'message': ['Since these don\'t match, let\'s try a different one!'],
          'sendMatch': ['false'],
          'beginMatching': null
        }
      }, {
        'title': 'Pass / I Don\'t know',
        'action': {
          'beginMatching': null
        }
      }]
    },
    'usgsTags': {
      'header': 'Which USGS Tags Are Correct?',
      'subheader': 'Select the tags from the USGS point that you want to keep',
      'content': '{{store.matchData.usgsTable}}',
      'buttons': [{
        'title': 'View OpenStreetMap Tags',
        'style': 'warning',
        'action': {
          'showTagPage': ['osm']
        }
      }]
    },
    'osmTags': {
      'header': 'Which OSM Tags Are Correct?',
      'subheader': 'Select the tags from OpenStreetMap point that you want to keep',
      'content': '{{store.matchData.osmTable}}',
      'buttons': [{
        'title': 'View USGS Tags',
        'style': 'warning',
        'action': {
          'showTagPage': ['usgs']
        }
      }, {
        'title': 'Save Tags',
        'style': 'success',
        'action': {
          'acceptTags': ['osm']
        }
      }, {
        'title': 'Cancel, next points',
        'style': 'danger',
        'action': {
          'message': ['Ok, starting over!'],
          'beginMatching': null
        }
      }]
    },
    'matchTags': {
      'header': 'Which Tags Are Correct?',
      'subheader': 'Select the tags that belong in OpenStreetMap',
      'content': '{{store.matchData.matchDiv}}',
      'buttons': [{
        'title': 'All Matched',
        'style': 'success',
        'action': {
          'message': ['Beep beep boop']
        }
      }, {
        'title': 'Cancel, next points',
        'style': 'danger',
        'action': {
          'message': ['Ok, starting over!'],
          'beginMatching': null
        }
      }]
    },
    'placePoint': {
      'header': 'Place the Point',
      'subheader': 'Place the point on the map where you believe it should be located',
      'content': '',
      'buttons': [{
        'title': 'Accept new Point',
        'style': 'success',
        'action': {
          'message': ['You are the third person to place to point, it is ready to be added to OpenStreetMap'],
          'osmLogin': null
        }
      }, {
        'title': 'Cancel, next points',
        'style': 'danger',
        'action': {
          'message': ['Ok, starting over!'],
          'beginMatching': null
        }
      }]
    },
    'osmLogin': {
      'header': 'Submit Point to OpenStreetMap',
      'subheader': 'You are the third person to verify this point, you can add this to OpenStreetMap if you would like.',
      'content': '',
      'buttons': [{
        'title': 'Log in to OpenStreetMap',
        'style': 'success',
        'action': {
          'message': ['You have successfully submitted this point to OpenStreetMap'],
        }
      }, {
        'title': 'Cancel, let someone else add it',
        'style': 'danger',
        'action': {
          'beginMatching': null
        }
      }]
    }
  }
};
