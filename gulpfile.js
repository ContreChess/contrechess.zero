var gulp        = require('gulp'),
    fs          = require('fs'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    del         = require('del'),
    gulpIf      = require('gulp-if'),
    imagemin    = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    jasmine     = require('gulp-jasmine');

var config = {
  baseUrl: 'src/js',
  name: 'main',
  out: 'dist/js/zeropress.js'
};

gulp.task('hello', function () {
  console.log('Howdy');
});

gulp.task('deps:npm', function () {
  var packageConfig = JSON.parse(fs.readFileSync('./package.json')),
      packageDependencies = Object.keys(packageConfig.dependencies),
      packageDependencyGlobs = [];

  packageDependencies.forEach(function (item, index, collection) {
    packageDependencyGlobs.push('node_modules/' + item + '/**/*.js');
  });

  return gulp.src(packageDependencyGlobs)
    .pipe(gulp.dest('src/js/npm'));
});

gulp.task('sass', function () {
  return gulp.src('src/scss/**/*.scss')
  .pipe(sass()) // Using gulp-sass
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('watch', ['browserSync'], function () {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);

  // Other watchers
});

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })
});

gulp.task('optimize', function () {
  requirejs.optimize(config, function (buildResponse) {
  //buildResponse is just a text output of the modules
  //included. Load the built file for the contents
  //Use config.out to get the optimezed file contents.
  var contents = fs.readFileSync(config.out, 'utf8');
  }, function (err) {
  //optimization err callback
  })
});

gulp.task('fonts', function () {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function () {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task('images', function () {
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback)
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    'sass',
    ['images', 'fonts'],
    callback)
});
 
gulp.task('test', function () {
  gulp.src('spec/test.js')
  // gulp-jasmine works on filepaths so you can't have any plugins before it 
  .pipe(jasmine())
});

