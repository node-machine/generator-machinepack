/**
 * Module dependencies
 */

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var Path = require('path');






module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    var self = this;

    // Have Yeoman greet the user.
    self.log('Welcome to the ' + chalk.blue('Machinepack') + ' generator!');

    self.prompt([
      {
        name: 'friendlyName',
        type: 'input',
        message: ''+
        'What would you like to use as the "friendly name" for your machinepack?\n'+
        chalk.gray('(e.g. "Passwords" or "Twitter")')+'\n'+
        '',
        validate: function (friendlyName){
          if (!_.isString(friendlyName) || !friendlyName) return;
          return true;
        }
      }
    ], function (answers) {

      // Save answers
      _.extend(self, answers);

      // Build a version of the friendlyName in sentence case.
      var sentenceCaseFriendlyName = self.friendlyName.replace(/(^[A-Z]|\s[A-Z])/g, function (match){
        return match.toLowerCase();
      });

      // Build identity by ecmascript-izing the friendly name
      var ecmascriptizedFriendlyName = self.friendlyName.replace(/[^0-9a-zA-Z]*/g,'');
      self.identity = ecmascriptizedFriendlyName.toLowerCase();

      // Then build the moduleName based on that
      self.moduleName = self.moduleName || 'machinepack-'+self.identity;

      self.log('');
      self.log('The module will be named `%s`.', self.moduleName);
      self.log('');

      // Build default description
      var defaultDesc = 'Work with '+sentenceCaseFriendlyName+'.';

      self.prompt([{
        name: 'description',
        type: 'input',
        message: 'Describe this machinepack in 80 characters or less.\n'+
        chalk.gray('(e.g. "Communicate with the Github API to get repos, commits, etc.")')+'\n',
        default: defaultDesc,
        validate: function (description){
          return !!description;
        }
      }], function (answers) {

        // Save answers
        _.extend(self, answers);

        self.log('');

        // Build `newFolderPath` in case user indicated a new folder should be generated.
        var newFolderPath = Path.resolve(process.cwd(), self.moduleName);

        self.prompt([
          {
            type: 'list',
            name: 'generateWhere',
            message: ''+
            'Where should this new machinepack be generated?',
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

          // Ask user to confirm that they really want to generate the machinepack in the current dir.
          if (answers.generateWhere === process.cwd()) {
            return this.prompt([
              {
                type: 'confirm',
                name: 'doubleCheck',
                message: 'The new machinepack\'s files will be created within the current directory ('+process.cwd()+').\nIs that OK?',
                default: true
              }
            ], function (answers){
              if (answers.doubleCheck) return done();
              return done(new Error('Canceled generation of new machinepack.'));
            });
          }

          // If selected to do so, change the destination to be a new folder in the
          // current working directory.
          self.destinationRoot(self.moduleName);

          done();
        });
      });
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
