/**
 * Gulp taks for managing this project
 *
 * Runs as a CLI, utilizing zip compression and decompression
 * as well as prompting the user to run certain tasks.
 */

const gulp = require('gulp');           // runtime framework
const argv = require('yargs').argv;     // runtime util
const zip = require('gulp-zip');        // zip util
const readline = require('readline');   // prompt util

// -=-=-=-=-=-=-=-=-=-=-=-=-===-=-=-=-=-=-=-= Deterministic Constants

const savesFile = 'saves.zip';          // the zipfile savename

// -=-=-=-=-=-=-=-=-=-=-=-=-===-=-=-=-=-=-=-= Formatting Constants

const nl = '\n';
const nsDivider = " :: ";
const consoleDivider = "-=-=-=-=-=-=-=-=-=-=-=-=-===-=-=-=-=-=-=-=";
const consolePrompt = " ? ";            // the prompt for questions
const toolSig = `urw3-savegames-postdawn${nsDivider}`;

// -=-=-=-=-=-=-=-=-=-=-=-=-===-=-=-=-=-=-=-= Task Constants

const choices = {
    compress: () => {
        return gulp.src([
            '**/ANCESTORS/**',
            '**/STORJARN/**',
            '**/HERMES/**'
        ]).pipe(zip(savesFile))
            .pipe(gulp.dest('./'));
    },
    /**
     * @param message - --message "initial commit"
     */
    commit: () => {

        if (!argv.message) {
            throw new Error("You need to supply a commit message using `--message`!");
        }

        let cmd = ['git add -A', `git commit -m "${toolSig}${argv.message}"`, 'git push'];

        return runChildProcess(cmd);
    },
    load: () => {
        var cmd = ['git fetch origin', 'git pull'];

        cmd.push(unzipCmd(savesFile));

        return runChildProcess(cmd);
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-===-=-=-=-=-=-=-= Task Setup

const { compress, commit, load } = choices;

registerTask("compress", compress, "Zip up all the character and ancestor save files");

registerTask("commit", commit, "Git commit and push the zip file, i.e. gulp commit --message \"My commit message\"");

registerTask("save",
    gulp.series(
        'compress',
        'commit'
    ),
    "Compresses and uploads the latest changes.  Runs `compress` then `commit`."
);

registerTask("load", load, "Pull down the latest zip from the repo and unzip");

// gulp.task('default', gulp.series('save'));

registerTask("default", (done) => {
    promptTask(choices, done);
}, "Lists the tasks");

// -=-=-=-=-=-=-=-=-=-=-=-=-===-=-=-=-=-=-=-= Utilities

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

function promptTask(choices, done) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });


    const list = Object.keys(choices).map(taskName => {
        let desc = '';
        if (choices[taskName].description) {
            desc = ` - ${choices[taskName].description}`;
        }
        return `   * ${taskName}${desc}`;
    });

    const prompt = `
${consoleDivider}

Choose a task:

${list.join(nl)}

${consoleDivider}

${consolePrompt}`;

    rl.question(prompt, (answer) => {
        if (choices[answer]) {
            (gulp.series(answer)());
        }
        rl.close();
        done();
    });
}

function registerTask(
    taskName /* : string*/,
    fn /* : Function */,
    desc /* : string */
) {
    fn.description = desc;
    choices[taskName] = fn;
    gulp.task(taskName, fn);
}

function unzipCmd(savesFile) {
    switch (process.platform) {
        case 'linux':
            return ('unzip -o ' + savesFile);
            break;
        case 'win32':
            break;
        case 'darwin':
            return ('tar -zxvf ' + savesFile);
            break;
    }
}