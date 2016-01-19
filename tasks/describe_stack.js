var config   = require('config');
var fs       = require('fs');
var jsonfile = require('jsonfile');
var util     = require('util');

var poller   = require('../lib/cloudformation-poller.js');

module.exports = function(grunt) {
  grunt.registerTask('describe_stack', 'Describe the CloudFormation stack', function() {
    var done = this.async();

    // Delete the outputsFile if it already exists. We'll recreate it.
    try {
      fs.accessSync(config.get('stack.outputsFile'));
      fs.unlink(config.get('stack.outputsFile'));
    } catch(e) {}

    var stackID = config.get('stack.name');
    var cfPoller = poller(stackID);

    cfPoller.then(function(outputs) {
      grunt.log.write(util.inspect(outputs, {showHidden: false, depth: null})).ok();
      jsonfile.writeFileSync(config.get('stack.outputsFile'), outputs, {spaces: 2});
    }, function(error) {
      grunt.fail.fatal(error, error.stack);
    }).finally(function() {
      done();
    });

  });
};
