'use strict';
var gulp = require('gulp');
var paths = require('../paths');


/**
 * Watch task
 * Run using "gulp watch"
 * Runs "build" task instantly and when any file in paths.jsSrc changes
 */
gulp.task('watch', ['build'], function() {
    gulp.watch([paths.source], ['build']);
});
