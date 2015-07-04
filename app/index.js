/**
 * Module dependencies
 */

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var LocalMachinepacks = require('machinepack-localmachinepacks');
var Path = require('path');




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
    LocalMachinepacks.promptAboutNewMachinepack().exec({
      error: function(err) {
        console.error('An error occurred: ',err);
        done(err);
      },
      cancelled: function() {
        done(new Error('Cancelled by user.'));
      },
      success: function(metadata) {

        // Save metadata
        _.extend(self, metadata);

        self.prompt([{
          name: 'wantsExampleMachine',
          message: 'Want me to create an example machine (`say-hello.js`) to help you get started?',
          type: 'confirm',
          default: false
        }], function (answers) {

          // Save answer
          self.wantsExampleMachine = answers.wantsExampleMachine;

          // TODO: finish this:
          //*****************************************************************************
          // self.log(yosay('OK, almost done. Just a few more questions.'));

          // promptAboutNewRepo(self.prompt, function (){
          //    ...
          // });
          //*****************************************************************************

          // Build `newFolderPath` in case user indicated a new folder should be generated.
          var newFolderPath = Path.resolve(process.cwd(), metadata.moduleName);

          self.prompt([
            {
              type: 'list',
              name: 'generateWhere',
              message: 'Where should this new machinepack be generated?',
              choices: [
                {
                  name: 'In a new folder '+chalk.gray('('+newFolderPath+')'),
                  value: newFolderPath
                },
                {
                  name: 'Within the current directory '+chalk.gray('('+process.cwd()+')'),
                  value: process.cwd()
                },
                // {
                //   name: 'Somewhere else...',
                //   value: undefined
                // }
              ]
            }
          ], function (answers){

            // Setup the output path.
            var outputPath = answers.generateWhere;

            var inCurrentDirectory;
            if (outputPath === process.cwd()) {
              inCurrentDirectory = true;
            }

            // Change the destination to `outputPath`
            if (outputPath !== self.destinationRoot()) {
              self.destinationRoot(outputPath);
            }


            // If machinepack is to be generated within the current directory, ask user to confirm that
            // she really wants to generate the machinepack files in the current dir.
            if (!inCurrentDirectory) {
              return done();
            }
            self.prompt([
              {
                type: 'confirm',
                name: 'doubleCheck',
                message: 'The new machinepack\'s files will be created within the current directory ('+process.cwd()+').\nIs that OK?',
                default: true
              }
            ], function (answers){
              if (answers.doubleCheck) {
                return done();
              }

              return done(new Error('Cencelled'));
            });

          });
        });
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

      if (!this.wantsExampleMachine) {
        this.fs.copy(
          this.templatePath('machines/_gitkeep'),
          this.destinationPath('machines/.gitkeep')
        );
      }
      else {
        this.fs.copy(
          this.templatePath('machines/say-hello.js'),
          this.destinationPath('machines/say-hello.js')
        );
        this.fs.copy(
          this.templatePath('DELETE_THIS_FILE.md'),
          this.destinationPath('DELETE_THIS_FILE.md')
        );
      }
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
