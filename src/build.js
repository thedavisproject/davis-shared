const gulp = require('gulp');
const bump = require('gulp-bump');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

exports.bump = function(src, type){
  return () =>
    gulp.src(src)
      .pipe(bump({type: type}))
      .pipe(gulp.dest('./'));
};

exports.lint = function(src) {
  return () => gulp
    .src(src)
    .pipe(eslint())
    .pipe(eslint.format());
};

exports.test = function(src, ci) {
  const opts = {
    reporter: 'nyan'
  };

  if(ci){
    opts.reporter = 'mocha-junit-reporter';
    opts.reporterOptions = {
      mochaFile: './tmp/test-results.xml'
    };
  }

  return () =>
    gulp.src(src)
    .pipe(mocha(opts));
};
