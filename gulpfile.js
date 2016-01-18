/**
 *   Rather than manage one giant configuration file responsible
 *   for creating multiple tasks, each task has been broken out into
 *   its own file in gulp/tasks. Any files in that directory get
 *   automatically required below.
 *   To add a new task, simply add a new task file in the tasks directory.
 */
'use strict';

var gulp = require('gulp'),
    path = require('path'),
    config = require('./config/build'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    requireDir = require('require-dir');

global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
};

/**
 *  Require all tasks in gulp/tasks, including subfolders
 */
requireDir('./gulp/tasks', {
    recurse: true
});

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
// gulp.task('default', ['clean'], function () {
//     gulp.start('build');
// });

gulp.task('production', function(callback) {
    runSequence(
        ['clean-all'], ['stylus', 'vendor-styles', 'scripts', 'vendor-scripts', 'assets'], ['ieStyle'],
        callback);
});

gulp.task('test-drive-development', [], function(callback){
    runSequence(
        ['test-server'],
        ['test-client-continuously'],
        callback);
});//TODO add development task

gulp.task('test', ['test-client', 'test-server']);

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch([
        path.join(config.paths.src, '/**/*.styl'),
        path.join(config.paths.src, '/**/*.css')
    ], ['styles-reload']);

    // gulp.watch([config.js.server.paths], ['server-lint']); //should not be necessary. the files are linted at start up
    gulp.watch([config.js.client.paths], ['scripts-reload', 'client-lint']);

    browserSync.watch('app/views/**/*.nunjucks').on('change', browserSync.reload);
});

gulp.task('development', [], function(callback) {
    runSequence(
        ['clean-all'], ['stylus-reload', 'vendor-styles', 'scripts-reload', 'vendor-scripts', 'assets'],
        ['ieStyle'],
        ['watch'],
        callback);
});

gulp.task('default', [config.buildType]);