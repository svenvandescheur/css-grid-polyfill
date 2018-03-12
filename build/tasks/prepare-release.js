var gulp = require('gulp');


/**
 * Prepare-release task
 * Run using "gulp prepare-release"
 * Runs clean, build, lint and test
 */
gulp.task('prepare-release', ['build', 'jsdoc', 'lint', 'test']);
