module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-env');

  grunt.initConfig({
    nodemon: {
      dev: { script: "server.js" }
    },
    env: {
      dev: { src: ".env" },
    }
  });

  grunt.registerTask('default', ['env:dev', 'nodemon']);
};
