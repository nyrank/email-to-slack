var AWS   = require('aws-sdk');
var util  = require('util');
var fs    = require('fs');
var jsonfile = require('jsonfile');

module.exports = function(grunt) {
  grunt.registerTask('describe_stack', 'Describe the CloudFormation stack', function() {
    var done = this.async();

    var cloudformation = new AWS.CloudFormation({cloudformation: '2010-05-15'});
    var params = {
      StackName: grunt.config('create_stack').stack
    };
    cloudformation.describeStacks(params, function(err, data) {
      if (err) {
        grunt.fail.fatal(err, err.stack);
      }
      if (data.Stacks[0].StackStatus !== 'CREATE_COMPLETE' &&
          data.Stacks[0].StackStatus !== 'UPDATE_COMPLETE') {
        grunt.log.warn(util.inspect(data));
        grunt.fail.fatal('Stack is not finished creating.');
      }

      var stack = {};
      var status = data.Stacks[0].Outputs;
      for (var i in status) {
        stack[status[i].OutputKey] = status[i].OutputValue;
      }
      stack = { 'StackOutputs': stack };
      grunt.log.write(util.inspect(stack, {showHidden: false, depth: null})).ok();
      jsonfile.writeFileSync(grunt.config('create_stack').outputs, stack, {spaces: 2});
    });
  });

};
