module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                banner: '/*========================================================================\n' +
                    ' * zzw v<%= pkg.version %>\n'+
                    ' * <%= pkg.description %> <%= pkg.homepage %>\n' +
                    ' * Copyright 2016-<%= grunt.template.today("yyyy/mm/dd") %> <%= pkg.author %>\n' +
                    ' * Licensed under the <%= pkg.license %> license\n' +
                    ' * ========================================================================/\n'
            },
            dist: {
                src: [
                    'src/code.js',
                    'src/tips.js',
                    'src/button.js',
                    'src/search.js',
                    'src/dialog.js',
                    'src/autocomplete.js',
                    'src/datagrid.js',
                    'src/dataPage.js',
                    'src/form.js',
                    'src/loader.js',
                    'src/loadIframe.js',
                    'src/loading.js',
                    'src/myMenu.js',
                    'src/rightMenu.js',
                    'src/select.js',
                    'src/tree.js',
                    'src/upload.js',
                    'src/validate.js'
                ],
                dest: 'dist/js/zzw.js' //合并文件在dist下名为built.js的文件
            }
        },
        uglify: {
            build: {
                src: 'dist/js/zzw.js', //压缩源文件是之前合并的buildt.js文件
                dest: 'dist/js/zzw.min.js' //压缩文件为built.min.js
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat', 'uglify']);
}
