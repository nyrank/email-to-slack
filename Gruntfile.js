module.exports = function(grunt) {
  var aws = grunt.file.readJSON('aws.json');

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
    lambda_deploy: aws.lambda_deploy,
    create_stack: aws.create_stack
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-aws-lambda');
  grunt.loadTasks('tasks');
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy']);

};
