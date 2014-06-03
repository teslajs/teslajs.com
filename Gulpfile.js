var app = {};

require('./config/_settings')(app);
require('./config/environment/development')(app);

var gulp = require('gulp'),
    exit = require('gulp-exit'),
    livereload = require('gulp-livereload'),
    mocha = require('gulp-mocha'),
    nodemon = require('gulp-nodemon'),
    path = require('path'),
    server = livereload(app.config.liveReload.port),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    paths = {
      app: 'server.js',
      build : app.config.buildDir,
      css: app.config.publicDir + 'css/**/*',
      views: './app/views/**/*',
      img: app.config.publicDir + 'img/**/*',
      lib: app.config.publicDir + 'lib/**/*',
      js: [app.config.publicDir + 'js/**/*', 'app/**/*.js'],
    };


// DEFAULT TASK
gulp.task('default', ['nodemon', 'css', 'watch']);

// HEROKU TASK
gulp.task('heroku', ['nodemon', 'css']);


// RUN TESTS
gulp.task('test', function() {

  gulp.src('test/**/*.js')
      .pipe(mocha({reporter: 'nyan'}))
      .pipe(exit());

});

// RENDER SASS FILES
gulp.task('css', function () {

  console.log('Compiling Sass');
  gulp.src('./public/css/*.scss')
      .pipe(sass({errLogToConsole: true}))
      .pipe(gulp.dest( app.config.publicDir + 'css'));

}); // END: CSS TASK


// WATCH FILES FOR CHANGES
gulp.task('watch', function() {

  console.log('Running gulp task "WATCH"');

  // LIVE RELOAD
  if ( app.config.liveReload.use === true ) {

    // CSS
    gulp.watch(paths.css).on('change', function(file) {
      server.changed(file.path);
    });

    // IMG
    gulp.watch(paths.img).on('change', function(file) {
      server.changed(file.path);
    });

    // JS
    gulp.watch(paths.js).on('change', function(file) {
      server.changed(file.path);
    });


    // JADE
    if ( app.config.engines.html === 'jade' ) {
      gulp.watch(paths.views + '.jade').on('change', function(file) { server.changed(file.path); });
    }

    // EJS
    if ( app.config.engines.html === 'ejs' ) {
      gulp.watch(paths.views + '.ejs').on('change', function(file) { server.changed(file.path); });
    }

    // HANDLEBARS
    if ( app.config.engines.html === 'hbs' ) {
      gulp.watch(paths.views + '.hbs').on('change', function(file) { server.changed(file.path); });
    }

    // HOGAN
    if ( app.config.engines.html === 'hogan' || app.config.engines.html === 'mustache' ) {
      gulp.watch(paths.views + '.mustache').on('change', function(file) { server.changed(file.path); });
    }

  }

}); // END: WATCH


// MONITOR SERVER FOR CHANGES & RESTART
gulp.task('nodemon', function() {

  console.log('Running gulp task "NODEMON"');

  nodemon({
    script: paths.app,
    ext: 'js, ejs, hbs, jade, html, mustache, styl, less, scss',
    ignore: ['README.md', 'node_modules/**', '.DS_Store']
  })
  .on('change', ['css'])
  .on('restart', ['reload']);

}); // END: NODEMON TASK


// RELOAD BROWSER ON CHANGE
gulp.task('reload', function () {

  if ( app.config.liveReload.use === true ) {
    livereload();
  }

}); //END: RELOAD TASK
