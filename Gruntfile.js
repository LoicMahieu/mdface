"use strict";

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    watch: {
      lint: {
        files: '<%- jshint.src.files %>',
        tasks: ['jshint']
      }
    },

    jshint: {
      options: {
        node: true
      },
      src: {
        options: {},
        files: {
          src: ['Gruntfile.js', 'mdface.js', 'lib/*', 'routes/*', 'bin/*']
        }
      }
    }
  });

  grunt.registerTask('default', [
    'jshint'
  ]);
};
