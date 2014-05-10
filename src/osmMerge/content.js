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
  'header': {},
  'navigation': {},
  'sidebars': {},
  'init': function() {
    // Creates the things that require functions
    var me = L.osmMerge.content;

    me.sidebars.intro = {
      'header': L.osmMerge.content.project.title,
      'subheader': L.osmMerge.content.project.description,
      'content': pages.intro('introSidebar');
    };

    var pages = {
      intro: function(className) {
        var container = L.DomUtil.create('div', className),
          components = {
            description = L.DomUtil.create('div', 'description');
            description.innerHTML = 'Welcome to osmMerge, where we are using ' +
              'crowdsourcing to merge point data from the USGS National Map Corps ' +
              'project into OpenStreetMap.<br/>Click the buttons below to continue';
            var introButtons = L.DomUtil.create('div', 'introButtons');
            var demoButton = L.DomUtil.create('button', 'demoButton');
            demoButton.setAttribute('class', 'btn btn-primary');
            demoButton.textContent = 'Demo';
            var startButton = L.DomUtil.create('button', 'startButton');
            startButton.setAttribute('class', 'btn btn-primary');
            startButton.textContent = 'Start';
            introButtons.appendChild(demoButton);
            introButtons.appendChild(startButton);
            me.sidebars.intro.content.appendChild(description);
            me.sidebars.intro.content.appendChild(introButtons);
          }
      }
    };
