// Generated on 2015-09-02 using generator-ionic 0.7.3
'use strict';

var spawn = process.platform === 'win32' ? require('win-spawn') : require('child_process').spawn;

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Copies remaining files to places other tasks can use
    copy: {
      tmpTs: {
        expand: true,
        cwd: 'src',
        dest: '.grunt-ts-tmp',
        src: [
          '**/*.ts'
        ]
      },
      js: {
        expand: true,
        cwd: '.grunt-ts-tmp',
        dest: 'dist/',
        src: '**/*.js'
      }
    },

    // ts
    // compiles typescript files to javascript files
    ts: {
      default: {
        src: [
          '.grunt-ts-tmp/**/*.ts'
        ],
        options: {
          target: 'es5',
          fast: 'never',
          failOnTypeErrors: true,
          experimentalDecorators: true
        }
      }
    }

  });

  grunt.registerTask('build', [
    'copy:tmpTs',
    'ts',
    'copy:js'
  ]);

};
