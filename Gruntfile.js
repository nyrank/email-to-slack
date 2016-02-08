var config = require('config');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'index.js', 'tasks/*.js'],
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      }
    },
    watch: {
      files: ['.jshintrc', '<%= jshint.files %>'],
      tasks: ['jshint']
    },
    create_stack: {
      default: {
        stack_name: config.get('stack.stackName'),
        stack_body_file: config.get('stack.stackBodyFile')
      }
    },
    describe_stack: {
      default: {
        stack_name: config.get('stack.stackName'),
        outputs_file: config.get('stack.outputsFile')
      }
    },
    lambda_invoke: {
      default: {
      }
    },
    lambda_package: {
      default: {
      }
    },
    lambda_deploy: {
      default: {
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['jshint']);

  grunt.loadNpmTasks('grunt-aws-lambda');
  grunt.loadNpmTasks('grunt-aws-cloudformation');
  grunt.registerTask('provision_stack', ['create_stack', 'describe_stack']);

  grunt.registerTask('deploy_function', 'Packages and deploys the lambda function', function() {
    var arn = grunt.file.readJSON(grunt.config.get('describe_stack.default.outputs_file')).LambdaFunctionARN;
    grunt.config.set('lambda_deploy.default.arn', arn);
    grunt.log.writeln('Set ARN as ' + arn);
    var tasks = ['lambda_package', 'lambda_deploy'];
    grunt.task.run(tasks);
  });

};
