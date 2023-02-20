module.exports = function( grunt ) {
    grunt.initConfig({
        uglify: {
            dist: {
                files: {
                    'https://yuzzfeng.github.io/demos/building_timeline/dist/leaflet.SliderControl.min.js': 'https://yuzzfeng.github.io/demos/building_timeline/dist/leaflet.SliderControl.min.js'
                }
            }
        },
        concat: {
            dist: {
                src: [
                    'https://yuzzfeng.github.io/demos/building_timeline/SliderControl.js'
                ],
                dest: 'https://yuzzfeng.github.io/demos/building_timeline/dist/leaflet.SliderControl.min.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat', 'uglify']);
};