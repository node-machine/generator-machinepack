/**
 * Module dependencies
 */

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var Machinepacks = require('machinepack-machinepacks');





module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    var self = this;

    // Have Yeoman greet the user.
    self.log(yosay('Welcome to the ' + chalk.blue('Machinepack') + ' generator!'));

    // Get machinepack metadata from user
    Machinepacks.promptAboutNewMachinepack().exec({
      error: function() {
        done(new Error('Unexpected error occurred.'));
      },
      cancelled: function() {
        done(new Error('Cancelled by user.'));
      },
      then: function(metadata) {
        // Change the destination to `outputPath`
        if (metadata.outputPath !== self.destinationRoot()) {
          self.destinationRoot(metadata.outputPath);
        }
        delete metadata.outputPath;

        // Save metadata
        _.extend(self, metadata);

        done();


        // TODO: finish this:
        //*****************************************************************************
        // self.log(yosay('OK, almost done. Just a few more questions.'));

        // promptAboutNewRepo(self.prompt, function (){
        //   done();
        // });
        //*****************************************************************************

      }
    });
  },

  writing: {
    app: function () {

      // Mix in metadata and apply defaults
      _.defaults(this, {
        description: undefined,
        author: undefined,
        createdAt: new Date()
      });

      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        this
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('npmignore'),
        this.destinationPath('.npmignore')
      );
      this.fs.copy(
        this.templatePath('index.js'),
        this.destinationPath('index.js')
      );
      this.fs.copy(
        this.templatePath('DELETE_THIS_FILE.md'),
        this.destinationPath('DELETE_THIS_FILE.md')
      );
      this.fs.copy(
        this.templatePath('machines/say-hello.js'),
        this.destinationPath('machines/say-hello.js')
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});






//*****************************************************************************
// * TODO: finish this
//*****************************************************************************
function promptAboutNewRepo (inquirer, done){

  inquirer.prompt([{
    name: 'createGithubRepo',
    message: 'Want me to create a Github repo for you?',
    type: 'confirm'
  }], function (answers) {
    if (!answers.createGithubRepo) {
      return done();
    }

    inquirer.prompt([{
      name: 'username',
      type: 'input',
      message: 'What\'s your GitHub username?'
    }, {
      name: 'password',
      type: 'password',
      message: 'What\'s your GitHub password?'
    }], function (answers){

      // TODO: create repo

      done();
    });
  });
}
//*****************************************************************************
