const gulp = require('gulp');
const zip = require('gulp-zip');

var argv = require('yargs').argv;

var savesFile = 'saves.zip';

gulp.task('compress', () => {
    return gulp.src([
        '**/ANCESTORS/**',
        '**/STORJARN/**',
        '**/HERMES/**'
    ]).pipe(zip(savesFile))
        .pipe(gulp.dest('./'));
});

/**
 * @param message - --message "initial commit"
 */
gulp.task('commit', () => {

    if (!argv.message) {
        throw new Error("You need to supply a commit message using `--message`!");
    }

    let cmd = ['git add -A', 'git commit -m "' + argv.message + '"', 'git push'];

    return runChildProcess(cmd);
});

gulp.task('save',
    gulp.series(
        'compress',
        'commit'
    )
);

gulp.task('load', () => {
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

    return runChildProcess(cmd);
});

gulp.task('default', gulp.series('save'));

function runChildProcess(cmd) {
    cmd = cmd || [];
    console.log(cmd);

    if (!Array.isArray(cmd)) {
        cmd = [cmd];
    }

    if (cmd.length) {
        return require('child_process').exec(cmd.join(' && '), function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.warn('stderr: ' + stderr);
            if (error !== null) {
                console.error('exec error: ' + error);
                throw error;
            }
        });
    } else {
        throw new Error('cmd is empty');
    }
}