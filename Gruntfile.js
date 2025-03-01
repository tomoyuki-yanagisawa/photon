/*!
 * Photon's Gruntfile
 * Copyright 2015 Connor Sears
 * Licensed under MIT (https://github.com/connors/photon/blob/master/LICENSE)
 */

module.exports = function(grunt) {
  'use strict';

  const Fiber = require('fibers');
  const sass = require('sass');

  require('load-grunt-tasks')(grunt);

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Metadata.
    meta: {
        distPath:       'dist/',
        docsAssetsPath: 'docs/assets/',
        docsDistPath:   'docs/dist/',
        docsPath:       'docs/',
        srcPath:        'sass/',
    },

    banner: '/*!\n' +
            ' * =====================================================\n' +
            ' * Photon v<%= pkg.version %>\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %> (https://github.com/connors/proton/blob/master/LICENSE)\n' +
            ' *\n' +
            ' * v<%= pkg.version %> designed by @connors.\n' +
            ' * =====================================================\n' +
            ' */\n',

    clean: {
      dist: ['<%= meta.distPath %>/css', '<%= meta.docsDistPath %>/css']
    },

    sass: {
      options: {
        implementation: sass,
        fiber: Fiber,
        sourceMap: false
      },
      dist: {
        files: {
          '<%= meta.distPath %>css/<%= pkg.name %>.css': 'sass/photon.scss',
          '<%= meta.docsAssetsPath %>css/docs.css': 'sass/docs.scss',
        }
      }
    },
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>'
        },
        files: {
          src: [
            '<%= meta.distPath %>css/*.css'
          ]
        }
      }
    },

    copy: {
      fonts: {
        expand: true,
        src: 'fonts/*',
        dest: '<%= meta.distPath %>'
      },
      docs: {
        expand: true,
        cwd: '<%= meta.distPath %>',
        src: [
          '**/*'
        ],
        dest: '<%= meta.docsDistPath %>'
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: '*' // keep all important comments
      },
      docs: {
        src: [
          '<%= meta.docsAssetsPath %>css/docs.css',
          '<%= meta.docsAssetsPath %>css/pygments-manni.css',
          '<%= meta.docsAssetsPath %>css/normalize.css'
        ],
        dest: '<%= meta.docsAssetsPath %>css/docs.min.css'
      }
    },

    watch: {
      options: {
        hostname: 'localhost',
        livereload: true,
        port: 8000
      },
      css: {
        files: '<%= meta.srcPath %>**/*.scss',
        tasks: ['dist-css', 'copy']
      },
      html: {
        files: '<%= meta.docsPath %>**',
        tasks: ['docs']
      }
    },
    shell: {
      eleventy: {
        command: 'npx @11ty/eleventy',
        options: {
          execOptions: {}
        }
      },
    },
    connect: {
      site: {
        options: {
          base: '_site/',
          hostname: 'localhost',
          livereload: true,
          open: true,
          port: 8000
        }
      }
    }

  });


  // Load the plugins
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  // Tasks
  grunt.registerTask('dist-css', ['sass', 'usebanner', 'cssmin']);
  grunt.registerTask('dist', ['clean', 'dist-css', 'copy']);
  grunt.registerTask('docs', ['shell:eleventy']);
  grunt.registerTask('server', ['dist', 'docs', 'connect', 'watch']);

  grunt.registerTask('default', ['dist']);
};
