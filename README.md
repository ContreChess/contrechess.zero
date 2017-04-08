# ContreChess

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
- site (main) 10MB
  - data/
    - users/
      - <address>
        - content.json
        - user.json
        - avatar.png

- site (games) 10MB
  - data/
    - games
      - <multi-sig-address>
        - content.json [multi-signers or my instgance writes to these files?]
        - payment.json
        - moves.json (chess.js)
      - chat/
        - epochTime.address.json/

- site (solicitations) 10MB need a policy to delete these periodically
  - data/
    - <guid> (acceptance deletes offer, creates game, counter deletes offer, creates new offer)
      - offer.json
      currency
      amount
      solicitor
      solicitee

# Development

This project uses [Gulp](http://gulpjs.com/). Some tasks assume a symbolic link exists between ZeroNet's `data` directory and this project's root directory:

```
drwxr-xr-x    4 <user>  <group>    136 Apr  4 09:54 ..
-rw-r--r--    1 <user>  <group>   1973 Apr  3 11:54 .development.asc
drwxr-xr-x   16 <user>  <group>    544 Apr  7 10:23 .git
-rw-r--r--    1 <user>  <group>     79 Mar  7 06:42 .gitattributes
-rw-r--r--    1 <user>  <group>    737 Apr  3 11:54 .gitignore
-rw-r--r--    1 <user>  <group>     16 Mar  7 06:42 .npmrc
-rw-r--r--    1 <user>  <group>   1332 Mar 26 00:25 Dockerfile
-rw-r--r--    1 <user>  <group>  18046 Mar  7 06:42 LICENSE
-rw-r--r--    1 <user>  <group>   2564 Mar 27 05:02 README.md
lrwxr-xr-x    1 <user>  <group>     27 Apr  7 10:24 data -> ../../zeronet/ZeroNet/data/
drwxr-xr-x    7 <user>  <group>    238 Apr  3 15:17 dist
-rw-r--r--    1 <user>  <group>   6175 Apr  3 11:54 gulpfile.js
drwxr-xr-x  917 <user>  <group>  31178 Apr  3 11:55 node_modules
-rw-r--r--    1 <user>  <group>   1938 Apr  3 11:54 package.json
-rw-r--r--    1 <user>  <group>    469 Mar 15 09:51 semantic.json
drwxr-xr-x   10 <user>  <group>    340 Mar 23 14:34 spec
drwxr-xr-x    7 <user>  <group>    238 Apr  3 14:48 src
```


