var gulp = require('gulp'),
    watch = require('gulp-watch'),
    fileinclude = require('gulp-file-include'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    combineMq = require('gulp-combine-mq'),
    prettify = require('gulp-html-prettify'),
    htmlhint = require('gulp-htmlhint'),
    htmlv = require('gulp-html-validator');

//paths
var html_build = 'build/_html/_templates/**/*.html',
    html_build_watch = 'build/_html/**/*.html',
    html_output = 'build/_dirty';

//File Include for HTML Build
gulp.task('fileinclude', function() {
  gulp.src([html_build])
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(html_output));
});

//Combines media queries
gulp.task('combineMq', function () {
    var postcss = require('gulp-postcss');
    var autoprefixer = require('autoprefixer');
    return gulp.src('build/_temp/screen.css')
    .pipe(combineMq({
        beautify: true
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('public/assets/css'));
});


gulp.task('watch', function(){
  gulp.watch(html_build_watch, ['fileinclude']);
});

//Cleans up crappy html output
gulp.task('templates', function() {
    gulp.src('build/_dirty/*.html')
        .pipe(prettify({
            indent_char: ' ', 
            indent_size: 4
        }))

    .pipe(gulp.dest('./public/'))
});

//Must add each page
gulp.task('hint', function () {
gulp.src(['./public/index.html'])
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter('htmlhint-stylish'))
    .pipe(htmlhint.failReporter({
        supress: true
    }))
});

gulp.task('htmlv', function(){
    gulp.src(['./public/index.html'])
    .pipe(htmlv({format:'html'}))
    .pipe(gulp.dest('./build/reports'));
});

gulp.task('default',['watch']);

 

