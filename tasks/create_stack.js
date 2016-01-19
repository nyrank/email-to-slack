var AWS    = require('aws-sdk');
var util   = require('util');
var fs     = require('fs');
var config = require('config');


module.exports = function(grunt) {
  grunt.registerTask('create_stack', 'Create the CloudFormation stack', function() {
    var params = {
      StackName: config.get('stack.name'),
      Capabilities: [
        'CAPABILITY_IAM'
      ],
      TemplateBody: fs.readFileSync(config.get('stack.templateFile'), 'utf8')
    };

    var update = grunt.option('update') || false;
    var operation;

    if (update) {
      operation = 'updateStack';
    } else {
      operation = 'createStack';
      params.OnFailure = 'DELETE';
      params.TimeoutInMinutes = 15;
    }

    var done = this.async();
    var cloudformation = new AWS.CloudFormation({cloudformation: '2010-05-15'});
    cloudformation[operation](params, function(err, data) {
      if (err) {
        grunt.fail.fatal(err, err.stack);
      } else {
        grunt.log.write(util.inspect(data)).ok();
      }
      done();
    });
  });

};
