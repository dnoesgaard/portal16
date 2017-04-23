'use strict';

var gulp = require('gulp'),
    rev = require('gulp-rev'),
    gulpif = require('gulp-if'),
    config = rootRequire('config/build');

gulp.task('assets', [], function () {
    return gulp.src(config.assets.paths)

        // .pipe(gulpif(config.isProd, gulpif('**/static/*/*.*',gulpif('!robots.txt', gulpif('!favicon.ico', rev())))))
        .pipe(gulp.dest(config.assets.dest));

        // .pipe(gulpif(config.isProd, rev.manifest({
        //     path: config.rev.manifest,
        //     cwd: config.rev.manifestDest,
        //     merge: true
        // })))
        // .pipe(gulpif(config.isProd, gulp.dest(config.rev.manifestDest)));
});

gulp.task('vendorAssets', [], function () {
    return gulp.src(config.vendorAssets.paths)
        .pipe(gulp.dest(config.vendorAssets.dest));
});