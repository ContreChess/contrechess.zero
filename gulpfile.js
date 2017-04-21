var gulp            = require('gulp'),
    fs              = require('fs'),
    browserSync     = require('browser-sync').create(),
    del             = require('del'),
    gulpIf          = require('gulp-if'),
    imagemin        = require('gulp-imagemin'),
    runSequence     = require('run-sequence'),
    jasmine         = require('gulp-jasmine'),
    jasmineBrowser  = require('gulp-jasmine-browser'),
    browserify      = require('browserify'),
    watchify        = require('gulp-watchify'),
    uglify          = require('gulp-uglify'),
    minify          = require('gulp-minify'),
    cache           = require('gulp-cache'),
    size            = require('gulp-size'),
    sourceMaps      = require('gulp-sourcemaps'),
    defmod          = require('gulp-define-module'),
    handlebars      = require('gulp-handlebars'),
    rename          = require('gulp-rename'),
    source          = require('vinyl-source-stream'),
    buffer          = require('vinyl-buffer');

var config = {
  name: 'contre',
  source: {
    baseDir: 'src',
    css: 'src/css/**/*.css',
    fonts: 'src/fonts/**/*',
    hbs: 'src/js/**/*.hbs',
    html: 'src/*.html',
    js: 'src/js/**/*.js',
    less: 'src/css/**/*.less',
    main: 'src/js/main.js',
    zeronet: {
      settings: 'src/**/content.json'
    },
    handlebars: {
      compiled: 'src/js/**/*.chbs.js'
    }
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
  distribution: {
    all: 'dist/**',
    baseDir: 'dist',
    css: 'dist/css',
    fonts: 'dist/fonts',
    images: 'dist/images',
    js: 'dist/js'
  },
  development: {
    source: 'dist/**',
    baseDir: 'data/1Gyhw9AfTojuc42h6nHmV9QCgroTXG9WRt'
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
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task('clean:tests', function () {
  return del.sync(config.tests.entry);
});

gulp.task('clean:handlebars', function () {
  return del.sync(config.source.handlebars.compiled);
});

gulp.task('fonts', function () {
  // requires semantic to run first
  return gulp.src(config.source.fonts)
  .pipe(gulp.dest(config.distribution.fonts));
});

gulp.task('images', function () {
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest(config.distribution.images))
});

gulp.task('css', function () {
  return gulp.src(config.source.css)
  .pipe(gulp.dest(config.distribution.css));
});

gulp.task('zeronet', function () {
  return gulp.src(config.source.zeronet.settings)
  .pipe(gulp.dest(config.distribution.baseDir));
});

gulp.task('semantic', function () {
  gulp.src('semantic/dist/semantic.css')
  .pipe(gulp.dest(config.staging.css))
  .pipe(gulp.dest(config.distribution.css));

  gulp.src('semantic/dist/themes/default/**')
  .pipe(gulp.dest(config.staging.css + '/themes/default'))
  .pipe(gulp.dest(config.distribution.css + '/themes/default'));

  gulp.src('semantic/dist/semantic.js')
  .pipe(gulp.dest(config.staging.js))
  .pipe(gulp.dest(config.distribution.js));
});

gulp.task('bundle:javascript', ['handlebars'], function () {
  return browserify(config.source.main)
  .bundle()
  .pipe(source(config.name + '.js'))
  .pipe(buffer())
  .pipe(minify())
  .pipe(size())
  .pipe(gulp.dest(config.staging.js))
  .pipe(gulp.dest(config.distribution.js));
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
  .pipe(gulp.dest(config.distribution.baseDir));
});

gulp.task('less', function () {});

gulp.task('watch', ['browserSync'], function () {

  console.log('watching: ' + bundledJSFile);
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
    'less',
    ['css', 'semantic', 'images', 'fonts', 'bundle:javascript', 'html', 'zeronet'],
    ['cache:clear'],
    callback)
});
 
gulp.task('test', function () {
  return runSequence('clean:tests',
    'bundle:tests',
    function () {
        console.log('testing: "' + config.tests.entry + '"');
        gulp.src(config.tests.entry)
          .pipe(jasmine({
            verbose: true,
            includeStackTrace: true
        }));
    });
});

gulp.task('test:headless', function () {
  return runSequence('clean:tests',
    'bundle:tests',
    function () {
      console.log('testing: "' + config.tests.entry + '"');
      gulp.src(config.tests.entry)
      .pipe(jasmineBrowser.specRunner({ console: true }))
      .pipe(jasmineBrowser.headless());
    });
});

gulp.task('test:browser', function () {
  return runSequence('clean:tests',
    'bundle:tests',
    function () {
      console.log('testing: "' + config.tests.entry + '"');
      gulp.src(config.tests.entry)
      .pipe(jasmineBrowser.specRunner())
      .pipe(jasmineBrowser.server());
    });
});

gulp.task('deploy:development', function () {
  return gulp.src(config.development.source)
  .pipe(gulp.dest(config.development.baseDir));
});

