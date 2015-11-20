var savesFile = 'saves.zip';

module.exports = function(grunt) {
    grunt.initConfig({
        compress: {
            main: {
                options: {
                    archive: savesFile
                },
                files: [{
                    expand: true,
                    src: [
                        'ANCESTORS/*',
                        'BEORN/*',
                        'STORJARN/*'
                    ],
                    dest: './'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('save', ['compress']);

    grunt.registerTask('unzip', function() {
        var done = this.async();

        var exec = require('child_process').exec,
            child;

        child = exec('tar -zxvf ' + savesFile, function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            done();
        });
    });

    grunt.registerTask('default', ['save']);
};
