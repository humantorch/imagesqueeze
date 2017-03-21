/*global module:false*/
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    var gruntConfig = {

        buildinfo : {
            input		  : 'input',
            output		  : 'output',
            debug         : true ,
            temp          : 'temp' ,
            env           : 'local' ,
            version_major : "1.0" ,
            version_minor : ".0" ,
        }

    };

    var opt = require('imagemin-optipng');

grunt.initConfig({
    imagemin: {
        dynamic: {
            options: {
                optimizationLevel: 3,
                svgoPlugins: [{ removeViewBox: false }],
                use: [opt()]
            },
            files: [{
                expand: true,
                cwd: 'input/',
                src: ['**/*.{png,jpg,gif}'],
                dest: 'output/'
            }]
        }
    }
});


  // Default task.
  grunt.registerTask('imagesqueeze', ['imagemin']);

};