var gulp        = require('gulp'),
    fs          = require('fs'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    del         = require('del'),
    gulpIf      = require('gulp-if'),
    imagemin    = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    jasmine     = require('gulp-jasmine'),
    browserify  = require('browserify'),
    watchify    = require('gulp-watchify'),
    uglify      = require('gulp-uglify'),
    cache       = require('gulp-cache'),
    size        = require('gulp-size'),
    sourceMaps  = require('gulp-sourcemaps'),
    defmod      = require('gulp-define-module'),
    handlebars  = require('gulp-handlebars'),
    rename      = require('gulp-rename'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer');

var config = {
  name: 'contre',
  source: {
    baseDir: 'src',
    css: 'src/css/**/*.css',
    fonts: 'src/fonts/**/*',
    hbs: 'src/js/**/*.hbs',
    html: 'src/*.html',
    js: 'src/js/**/*.js',
    main: 'src/js/main.js',
    sass: 'src/scss/**/*.scss'
  },
  staging: {
    css: 'src/css',
    js: 'src/js'
  },
  tests: {
    baseDir: 'spec',
    entry: 'spec/test.js'
  },
  destination: {
    baseDir: 'dist',
    css: 'dist/css',
    fonts: 'dist/fonts',
    images: 'dist/images',
    js: 'dist/js'
  }
};

gulp.task('hello', function () {
  console.log('Howdy');
});

gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback);
});

gulp.task('clean:dist', function () {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task('sass', function () {
  return gulp.src(config.source.sass)
  .pipe(sass()) // Using gulp-sass
  .pipe(gulp.dest(config.staging.css))
  .pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('fonts', function () {
  return gulp.src(config.source.fonts)
  .pipe(gulp.dest(config.destination.fonts));
});

gulp.task('images', function () {
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest(config.destination.images))
});

gulp.task('css', function () {
  return gulp.src(config.source.css)
  .pipe(gulp.dest(config.destination.css));
});

gulp.task('javascript', ['handlebars'], function () {
  console.log(config.destination.js);
  return browserify(config.source.main)
  .bundle()
  .pipe(source(config.name + '.js'))
  .pipe(buffer())
  /*
  .pipe(sourceMaps.init())
  .pipe(uglify())
  .pipe(sourceMaps.write())
  .pipe(size())
  */
  .pipe(gulp.dest(config.staging.js))
  .pipe(gulp.dest(config.destination.js));
});

gulp.task('handlebars', function () {
  return gulp.src(config.source.hbs)
  .pipe(handlebars())
  .pipe(defmod('node'))
  .pipe(rename({
    extname: '.hbs.js'
  }))
  .pipe(gulp.dest(config.staging.js));
});

gulp.task('html', function () {
  return gulp.src(config.source.html)
  .pipe(gulp.dest(config.destination.baseDir));
});

gulp.task('watch', ['browserSync'], function () {
  gulp.watch(config.source.sass, ['sass']);
  gulp.watch(config.source.html, browserSync.reload);
  gulp.watch(config.source.js, ['javascript'], browserSync.reload);

  // Other watchers
});

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: config.source.baseDir
    },
  });
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    'sass',
    ['css', 'images', 'fonts', 'javascript', 'html'],
    ['cache:clear'],
    callback)
});
 
gulp.task('test', function () {
  gulp.src(config.tests.baseDir + '/' + config.tests.entry)
  // gulp-jasmine works on filepaths so you can't have any plugins before it 
  .pipe(jasmine());
});



