/**
 * @description Grunt file for building the package
 * @author: Alex Dumitru <alex@flanche.net>
 */

module.exports = function(grunt){
  grunt.initConfig({
    pkg   : grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';\n'
      },
      dist   : {
        src : "src/*.js",
        dest: "dist/<%= pkg.name %>.js"
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist   : {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    jshint: {
      files  : ['Gruntfile.js', 'src/**/*.js'],
      options: {
        loopfunc: false,
        unused  : true,
        undef   : true,
        nonew   : true,
        noarg   : true,
        newcap  : true,
        forin   : true,
        curly   : true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
};