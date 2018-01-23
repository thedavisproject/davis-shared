const gulp = require('gulp');
const bump = require('gulp-bump');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const fs = require('fs');

exports.bump = function(src, type){
  return () =>
    gulp.src(src)
      .pipe(bump({type: type}))
      .pipe(gulp.dest('./'));
};

exports.lint = function(src, ci) {
  if(ci){
    return () => gulp
      .src(src)
      .pipe(eslint())
      .pipe(eslint.format('junit', fs.createWriteStream('tmp/eslint-report.xml')));
  }
  else{
    return () => gulp
      .src(src)
      .pipe(eslint())
      .pipe(eslint.format());
  }
};

exports.test = function(src, ci, options = {}) {
  const opts = Object.assign({}, {
    reporter: 'progress'
  }, options);

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
