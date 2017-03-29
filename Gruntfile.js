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

    var opt = require('imagemin-optipng'),
        multer = require('multer'),
        serveStatic = require('serve-static');;

    grunt.initConfig({
        clean: ['output/*'],
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
        },
        guetzli: {
            files: {
                expand: true,
                src: 'input/**/*.jpg',
                dest: 'output/'
            },
            options: {
                quality: 84,
                verbose: true
            }
        },
        compress: {
          main: {
            options: {
              archive: 'output.zip',
              pretty: true
            },
            files: [
              // {src: ['output/*'], dest: 'internal_folder/', filter: 'isFile'}, // includes files in path
              // {src: ['output/**'], dest: 'archive/'}, // includes files in path and its subdirs
              {expand: true, cwd: 'output/', src: ['**'], dest: 'output/'}, // makes all src relative to cwd
              // {flatten: true, src: ['path/**'], dest: 'internal_folder4/', filter: 'isFile'} // flattens results to a single level
            ]
          }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    protocol: 'http',
                    hostname: 'localhost',
                    open: true,
                    keepalive: true,
                    debug: true,
                    middleware: function(connect) {
                        console.log('foo');
                        return [
                            multer({dest: './www/input/'}),
                            serveStatic('./www/')
                        ]
                    }
                }
            }
        },
        watch: {
            files: ['www/input/**'],
            tasks: ['test']
        }
    });


  // Default task.
  grunt.registerTask('i', ['clean','imagemin']);
  grunt.registerTask('g',['clean','guetzli']);
  grunt.registerTask('serve',[
    'connect',
    'watch'
  ]);
  grunt.registerTask('test',function() {
    console.log('test');
  });

};