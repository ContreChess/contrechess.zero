# ZeroPress

I might be interested in using `gulp-uglify` for minification.

If so:
```bash
$ npm install gulp-uglify --save dev
```
then in `gulpfile.js`
```js
// Other requires
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');

gulp.task('useref', function () {
  return gulp.src('src/*.html')
  .pipe(useref())
  // minify only if it's a JavaScript file
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulp.dest('dist'))
});
```

I might also want to use `gulp-cssnano` to do the same thing for css
