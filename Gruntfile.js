module.exports = function(grunt) {
    grunt.initConfig({
        compress: {
            main: {
                options: {
                    archive: 'saves.zip'
                },
                files: [
                    {
                        expand: true,
                        src: [
                            'ANCESTORS/*',
                            'BEORN/*',
                            'STORJARN/*'
                        ],
                        dest: './'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('save', ['compress']);

    grunt.registerTask('default', ['save']);
};
