// var util     = require('util');
var jsonfile = require('jsonfile');
var config   = require('config');
// var poller   = require('../lib/cloudformation-poller.js');

module.exports = function(grunt) {
  grunt.registerTask('set_state', 'Set the ARN, etc of the created function', function() {
    var arn = jsonfile.readFileSync(config.get('stack.outputsFile'))['LambdaFunctionARN'];
    grunt.config.set('lambda_deploy.default.arn', arn);
    grunt.log.writeln('Set ARN as ' + arn);
  });
};
