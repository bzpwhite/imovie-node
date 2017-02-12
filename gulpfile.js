var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jslint = require('gulp-jslint');

gulp.task('lint',function () {
    gulp.src('./**/*.js')
        .pipe(jslint())
})

gulp.task('start',function () {
   var stream =  nodemon({
        script:'app.js',
        ext:'js jade',
        tasks:['lint']
    })
    stream.on('restart',function () {
        console.log('restarted!')
    }).on('crash',function () {
        console.error('Application has crashed!')
        /*10s后重启服务*/
        stream.emit('restart',10);
    })
})
