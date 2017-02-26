var savesFile = 'saves.zip';

if (!global.RWD) {
    Object.defineProperty(global, 'RWD', {
        get: function() {
            return __dirname;
        }
    });
}

function info(label, value) {
    console.log(label);
    console.log(value);
}

function error(label, value) {
    if (value) {
        console.log(label);
        console.error(value);
    }
}

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
            Path = require('path'),
            child;

        child = exec('tar -zxvf ' + Path.join(RWD, savesFile), function(err, stdout, stderr) {
            info('stdout: ', stdout + '');
            error('stderr: ', stderr + '');
            error('exec error: ', err);
            done();
        });
    });

    grunt.registerTask('default', ['save']);
};
