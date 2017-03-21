module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-imagemin');

	grunt.registerTask('optimize-img-local', 'Optimize all the images in /input', function() {

		var pngquant = require('imagemin-optipng');

		grunt.config.set('imagemin.optimize.options.use',[pngquant({ quality: '65-80', speed: 4 })]);
		grunt.task.run(['imagemin:optimize']);
	});

    return {
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 5

                },
                files: [
                    {
                        src: ["<%= buildinfo.input %>/**/*.png", "<%= buildinfo.input %>/**/*.jpg"],
                        expand: true,
                        filter: 'isFile'
                    }
                ]
            },
            dev: {
                options: {
                    optimizationLevel: 5

                },
                files: [
                    {
                        src: ["<%= buildinfo.output %>/**/*.png", "<%= buildinfo.output %>/**/*.jpg"],
                        expand: true,
                        filter: 'isFile'
                    }
                ]
            },
            optimize: {
                options: {
                    optimizationLevel: 5,
                    use: []

                },
                files: [
                    {
                        src: ["<%= buildinfo.input %>/**/*.png", "<%= buildinfo.input %>/**/*.jpg"],
                        expand: true,
                        filter: 'isFile',
                        dest: "./output"
                    }
                ]



            }
        }
    }

};