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


# Contre
======

1. Every user is listed in the main window
  a. Except for the current user
  b. The list is grouped by rating
  c. The list includes the player's rating
2. A user makes a game request to another user (potential loop)
  a. called a "solicitation"
  b. encrypted with the receiver's pgp key
    i.  and my key
  c. specifying how much the game should cost
  d. specifying my current public key
  e. specifying the solicitors public key
3. The receiver accepts
  a. adding the receivers address
  b. the game begins
4. The receiver rejects
5. The receiver counters the cost (potential loop)
6. The solicitor accepts
7. The solicitor rejects
8. The game begins
  a. the game gets an identifier
  b. random user to color assignment
  c. game has chat direcory/files for participants/moderator/admin
  d. the acceptor's key is added
  d. the acceptor (either receiver or solicitor) creates the funding address (beginning with "3"). (potential loop)
  e. the redeem script is saved to the game
9. moves are made
  a. appended to game file
10. winning position is determined
  a. game result is appended to file
11. statistics are updated
12. transaction is created to winning address/moderator/admin
  a. no disputes
    i. minimum required participants sign a raw transaction and broadcast
  b. a dispute or draw
    i. dispute
    ii. draw
13. 

Directories
- site (main)
  - data/
  |- users/
  |  |- <address>
  |  |  |- content.json
  |  |  |- user.json
- site (games) 10GB
  - data/
  |- games
  |  |- <multi-sig address>
  |  |  |- content.json [multi-signers or my instgance writes to these files?]
  |  |  |- payment.json
  |  |  |- moves.json (chess.js)
  |  |  |- chat/
  |  |  |  | - epochTime.address.json/

- site (solicitations) 200MB need a policy to delete these periodically
  - data/
  |  |- <guid> (acceptance deletes offer, creates game, counter deletes offer, creates new offer)
  |  |  |- offer.json
            currency
            amount
            solicitor
            solicitee
