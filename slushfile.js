var gulp = require('gulp')
var install = require('gulp-install')
var conflict = require('gulp-conflict')
var template = require('gulp-template')
var rename = require('gulp-rename')
var inquirer = require('inquirer')
var licenses = require('osi-licenses')

gulp.task('default', function (done) {
  inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'what is your app called? (no spaces allowed)',
    default: gulp.args.join(' ')
  }, {
    type: 'input',
    name: 'description',
    message: 'now describe it:',
    default: "i love templit"
  }, {
    type: 'input',
    name: 'author',
    message: 'what is your github username?',
    default: 'author'
  }, {
    type: 'list',
    name: 'license',
    message: 'choose a license:',
    choices: Object.keys(licenses),
    default: 'ISC'
  }, {
    type: 'confirm',
    name: 'moveon',
    message: 'done?'
  }])
    .then(function (answers) {
      // replaces whitespace in name with dashes
      answers.name.replace(/\s+/g, '-')
      if (!answers.moveon) {
        return done()
      }
      // Note use of __dirname to be relative to generator
      gulp.src(__dirname + '/template/**', {
        // Include dotfiles
        dot: true
      })
        // Lodash template support
        .pipe(template(answers, {interpolate : /<%=([\s\S]+?)%>/g }))
        // Rename dotfiles
        .pipe(rename(function (file) {
          if (file.basename[0] === '_') {
            file.basename = '.' + file.basename.slice(1)
          }
        }))
        // Confirms overwrites on file conflicts
        .pipe(conflict('./'))
        // Without __dirname here = relative to cwd
        .pipe(gulp.dest('./'))
        // Run `bower install` and/or `npm install` if necessary
        .pipe(install())
        .on('finish', function () {
          done() // Finished!
        })
    })
})
