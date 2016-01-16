var util     = require('util');
var jsonfile = require('jsonfile');
var config   = require('config');
var poller   = require('../lib/cloudformation-poller.js');

module.exports = function(grunt) {
  grunt.registerTask('describe_stack', 'Describe the CloudFormation stack', function() {
    var done = this.async();

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
