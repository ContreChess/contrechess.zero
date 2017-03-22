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
    minify      = require('gulp-minify'),
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
    js: 'src/js',
    tests: 'spec'
  },
  tests: {
    config: 'spec/support/jasmine.json',
    main: 'spec/mainSpec.js',
    entry: 'spec/entry.js',
    specs: 'spec/**/*.js'
  },
  destination: {
    baseDir: 'dist',
    css: 'dist/css',
    fonts: 'dist/fonts',
    images: 'dist/images',
    js: 'dist/js'
  }
},
    bundledJSFile = config.staging.js + '/' + config.name + '.js',
    bundledMiniJSFile = config.staging.js + '/' + config.name + '-min.js';

gulp.task('hello', function () {
  console.log('Howdy');
});

gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback);
});

gulp.task('clean:dist', function () {
  return del.sync([bundledJSFile, bundledMiniJSFile, 'src/js/**/*.chbs.js', 'dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task('clean:tests', function () {
  return del.sync(config.tests.entry);
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

gulp.task('bundle:javascript', ['handlebars'], function () {
  return browserify(config.source.main)
  .bundle()
  .pipe(source(config.name + '.js'))
  .pipe(buffer())
  .pipe(minify())
  .pipe(size())
  .pipe(gulp.dest(config.staging.js))
  .pipe(gulp.dest(config.destination.js));
});

gulp.task('bundle:tests', function () {
  console.log('bundling: "' + config.tests.main +'"');
  return browserify(config.tests.main)
        .bundle()
        .pipe(source('entry.js'))
        .pipe(buffer())
        .pipe(gulp.dest(config.staging.tests));
});

gulp.task('handlebars', function () {
  return gulp.src(config.source.hbs)
  .pipe(handlebars())
  .pipe(defmod('node'))
  .pipe(rename({
    extname: '.chbs.js'
  }))
  .pipe(gulp.dest(config.staging.js));
});

gulp.task('html', function () {
  return gulp.src(config.source.html)
  .pipe(gulp.dest(config.destination.baseDir));
});

gulp.task('watch', ['browserSync'], function () {

  console.log('watching: ' + bundledJSFile);
  gulp.watch(config.source.sass, ['sass']);
  gulp.watch(config.source.html, browserSync.reload);
  // only watch the bundled js file
  gulp.watch(bundledJSFile, browserSync.reload);

  // Other watchers
  gulp.watch([config.source.js, '!*.chbs.js', '!' + bundledJSFile, '!'+bundledMiniJSFile], ['bundle:javascript']);
  gulp.watch(config.source.hbs, ['bundle:javascript']);
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
    ['css', 'images', 'fonts', 'bundle:javascript', 'html'],
    ['cache:clear'],
    callback)
});
 
gulp.task('test', function () {
  return runSequence('clean:tests',
    'bundle:tests',
    function () {
        console.log('testing: "' + config.tests.entry +'"');
        gulp.src(config.tests.entry)
          .pipe(jasmine({
            verbose: true,
            includeStackTrace: true
        }));
    });
});
