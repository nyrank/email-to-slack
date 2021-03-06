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
  grunt.loadNpmTasks('grunt-aws-lambda');
  grunt.loadTasks('tasks');
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('provision', ['create_stack', 'describe_stack']);
  grunt.registerTask('deploy', ['set_state', 'lambda_package', 'lambda_deploy']);
};
