var dotenv = require('dotenv');
dotenv.load();

module.exports = function(grunt) {
  var aws = {
    'lambda_invoke': {
      'default': {}
    },
    'lambda_package': {
      'default': {}
    },
    'lambda_deploy': {
      'default': {
        'arn': process.env.EMAIL_TO_SLACK_LAMBDA_ARN,
        'options': {
          'profile': process.env.EMAIL_TO_SLACK_AWS_PROFILE
        }
      }
    }
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'index.js'],
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      }
    },
    watch: {
      files: ['.jshintrc', '<%= jshint.files %>'],
      tasks: ['jshint']
    },
    lambda_invoke: aws.lambda_invoke,
    lambda_package: aws.lambda_package,
    lambda_deploy: aws.lambda_deploy
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-aws-lambda');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy']);

};
