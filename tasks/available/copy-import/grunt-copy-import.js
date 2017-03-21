module.exports = function (grunt) {

    grunt.registerTask('copy-import','Import copy deck from google and export locale json files.',
        ['copy-import-google','copy-import-convert']);

    var localeHeaderMatch = /^[a-z]{2}_[A-Z]{2}$/;
    var async = require('async');
    var parse = require('csv-parse');
    var _ = require("underscore");
    var Spreadsheet = require('edit-google-spreadsheet');
    var stringify = require('csv-stringify');


    function convertStringToJSON(str) {
        var json = JSON.stringify(eval("(" + str + ")"));
        return JSON.parse(json);
    }

    /**
     * Convert google spreadsheet csv file to JSON
     */
    grunt.registerMultiTask('copy-import-convert','Convert exported locale csv files to json',function () {

        var done = this.async();

        async.each(this.files,function (file,next) {

            localeHeaderMatch = file.match || localeHeaderMatch;

            var csvData = grunt.file.read(file.src[0]);

            console.log("read file : " + file.src[0]);

            parse(csvData,{},function (err,rows) {

                if (err) next(err);

                //# Find header row
                var headers;
                do {
                    headers = _.values(rows.shift());
                    // console.log(headers);
                } while (headers[0] !== 'ID' || rows.length === 0);

                //# Build locale containers
                var locales = {};
                _.each(headers,function (header,col) {

                    if (header.match(localeHeaderMatch)) {
                        locales[header] = {col:col,values:{locale:header}};
                    }
                });

                //# Fill locale containers with cell data
                _.each(rows,function (row,i) {

                    //# Check to see if this is a valid content row
                    if (row[0] && row[1]) {
                        try {

                            var key = row[0];
                            var description = row[1];

                            _.each(locales,function (locale) {
                                if (description.indexOf('color') !== -1) {
                                    //convert colors to json
                                    locale.values[key] = convertStringToJSON(row[locale.col]);
                                } else {
                                    locale.values[key] = row[locale.col];
                                }
                            });

                        } catch (e) {
                            console.error("parse error : " + e + " / " + row);
                            throw e;
                        }
                    }
                });

                //# Export JSON files
                _.each(locales,function (locale,i) {

                    console.log("\nwrite file : " + file.dest);

                    var fileName = file.dest.indexOf(".json") != -1 ? file.dest : file.dest + i + '.json';
                    grunt.file.write(fileName,JSON.stringify(locale.values,null," "));
                    grunt.log.writeln(fileName + " locale JSON file created");
                });

                next(err);
            });

        },function (err) {
            done(err);
        });
    });

    /**
     * Export google spreadsheet to csv file
     */
    grunt.registerMultiTask('copy-import-google','Import the locale based copy from the localization deck',function () {

        var done = this.async();
        //# Config options for edit-google-spreadsheet
        var sheetsConfig = this.options()['edit-google-spreadsheet'];
        _.defaults(sheetsConfig,{
            debug            :true,
            useCellTextValues:true
        });

        //# List of worksheets to process
        async.eachLimit(this.files,4,function (sheet,next) {

            var config = _.defaults({worksheetName:sheet.orig.src[0]},sheetsConfig);

            Spreadsheet.load(config,function sheetReady(err,spreadsheet) {

                if (err) {
                    throw err;
                    next(err);
                }

                spreadsheet.receive({getValues:true},function (err,rows,info) {

                    if (err) {
                        throw err;
                        next(err);
                    }

                    grunt.log.writeln("Spreadsheet received");

                    grunt.verbose.writeln(info);

                    //# Convert objects into arrays
                    var rowArray = _.map(rows,function (row) {
                        var rowArray = [];
                        _.each(row,function (value,i) {
                            rowArray[parseInt(i,10) - 1] = value;
                        });
                        return rowArray;
                    });

                    stringify(rowArray,function (err,csv) {
                        if (err) console.log(err);
                        grunt.log.writeln("Converted to CSV");

                        grunt.file.write(sheet.dest,csv);
                        next(err);
                    });
                });
            });
        },function (err) {
            done(err);
        });

    });
};