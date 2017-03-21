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

    var nconf = require('nconf');
    nconf.argv().env();

    //# Override flex sdk location
    if ( nconf.get('FLEX') ) {
        nconf.overrides({'config' : {'flex_sdk' : nconf.get('FLEX')}});
    }


    //# Load grunt task configs
    var taskConfigs = grunt.file.expand('tasks/enabled/**/*.config.js');

    var config, configModule;
    grunt.util._.each(taskConfigs,function( configPath ) {

        configModule = require('./'+configPath);

        config = configModule(grunt);

        grunt.util._.extend(gruntConfig, config);
    });

    //# Set config defaults
    nconf.defaults({ "config" : gruntConfig });

    //# Set config on grunt
    grunt.initConfig(nconf.get('config'));

    //# Load grunt tasks
    var tasks = grunt.file.expand(['tasks/enabled/**/*.js','!tasks/enabled/**/*.config.js']);

    var taskModule;
    grunt.util._.each(tasks,function( taskPath ) {

        console.log(taskPath);
        taskModule = require('./'+taskPath);
        taskModule(grunt);

    });

    grunt.registerTask('update_deps', 'Add all enabled task dependencies to main package.json', function() {

        var _ = grunt.util._;

        var mainPackageJSON = grunt.file.readJSON("package.json");

        grunt.log.debug(mainPackageJSON);

        var taskPackages = grunt.file.expand(["tasks/enabled/**/package.json"]);

        var depsJSON = taskPackages.map(function( packagePath ){
            return grunt.file.readJSON( packagePath );
        });

        var depsCombined = depsJSON.reduce(function( deps, packDep ) {

            if( packDep.hasOwnProperty('dependencies') ) {
                _.defaults(deps.dependencies, packDep.dependencies)
            }

            if( packDep.hasOwnProperty('devDependencies') ) {
                _.defaults(deps.devDependencies, packDep.devDependencies)
            }

            return deps;
        },{
            "dependencies": _.clone(mainPackageJSON.dependencies),
            "devDependencies": _.clone(mainPackageJSON.devDependencies)
        });

        grunt.log.debug(taskPackages);

        _.extend(mainPackageJSON,depsCombined);

        grunt.file.write("package.json",JSON.stringify(mainPackageJSON, null, "\t"));
    });

  // Default task.
  grunt.registerTask('imagesqueeze', ['optimize-img-local']);

};