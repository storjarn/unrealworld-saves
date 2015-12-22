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
    grunt.loadNpmTasks("grunt-then");

    grunt.registerTask('save', function(message) {
        if (!message) {
            throw new Error("You need to supply a commit message!");
        }
        grunt.task
            .run("compress")
            .then(
                generateCMDTask(
                    ['git add -A', 'git commit -m "' + message + '"', 'git push']
                )
            );
    });

    grunt.registerTask('load', generateCMDTask((function() {
        var cmd = ['git pull'];

        switch (process.platform) {
            case 'linux':
                cmd.push('unzip -o ' + savesFile);
                break;
            case 'win32':
                break;
            case 'darwin':
                cmd.push('tar -zxvf ' + savesFile);
                break;
        }
        return cmd;
    })()));

    grunt.registerTask('default', ['save']);

    function generateCMDTask(cmd, callback) {
        return function() {
            var done = this.async();

            function finish() {
                if (typeof callback === 'function') {
                    callback(done);
                } else {
                    done();
                }
            }

            var exec = require('child_process').exec,
                child;

            console.log(cmd);

            if (cmd.length) {
                child = exec(cmd.join(' && '), function(error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                    finish();
                });
            } else {
                console.log('cmd is empty');
                finish();
            }
        };
    }
};
