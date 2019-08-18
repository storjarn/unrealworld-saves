const gulp = require('gulp');
const zip = require('gulp-zip');

var argv = require('yargs').argv;

var savesFile = 'saves.zip';

gulp.task('compress', () => {
    console.log('compress fired');
    return gulp.src([
        'ANCESTORS/*',
        'STORJARN/*',
        'HERMES/*'
    ]).pipe(zip(savesFile))
        .pipe(gulp.dest('./'));
});

gulp.task('commit', () => {

    let cmd = ['git add -A', 'git commit -m "' + argv.message + '"', 'git push'];

    console.log(cmd);

    if (cmd.length) {
        return require('child_process').exec(cmd.join(' && '), function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    } else {
        throw new Error('cmd is empty');
    }
});

gulp.task('save', () => {
    if (!argv.message) {
        throw new Error("You need to supply a commit message!");
    }
    return gulp.series('compress', 'commit');
});

gulp.task('load', generateCMDTask(() => {
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
}));

gulp.task('default', () => {
    return gulp.series('save')();
});

function generateCMDTask(cmd, callback, args) {
    return function () {

        function finish() {
            if (typeof callback === 'function') {
                callback.args = args || [];
                callback(done);
            } else {
                done();
            }
        }

        var exec = require('child_process').exec;

        console.log(cmd);

        if (cmd.length) {
            child = exec(cmd.join(' && '), function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                finish();
            });
        } else {
            throw new Error('cmd is empty');
        }
    };
}