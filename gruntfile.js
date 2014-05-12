module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      options: {
        banner: '/*! Browserify: <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    clean: {
      dist: {
        src: ['dist/**/*']
      }
    },
    copy: {
      dist: {
        src: 'src/index.html',
        dest: 'dist/index.html'
      },
      leaflet_images: {
        expand: true,
        flatten: true,
        src: 'node_modules/leaflet/dist/images/**',
        dest: 'dist/images/'
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      css: {
        src: ['src/**/*.css'],
        dest: 'dist/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/*.js']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      js: {
        files: ['<%= jshint.files %>'],
        tasks: ['clean', 'jshint', 'concat', 'browserify', 'copy:dist']
        //tasks: ['jshint']
      },
      html: {
        files: ['src/**/*.html', 'test/**/*.html'],
        tasks: ['clean', 'jshint', 'concat', 'browserify', 'copy:dist']
      }
    }
  });

  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  //grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-browserify');

  //grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('default', ['clean', 'jshint', 'concat', 'browserify', 'copy:dist', 'copy:leaflet_images']);

};
