/**
 * gulp一共五中方法：
 * gulp.task()——新建任务
 * gulp.src()——获取文件源地址
 * gulp.dest()——文件输出地址
 * gulp.run()——运行任务
 * gulp.watch()——监听文件修改
 */

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minhtml = require('gulp-htmlmin'),
    minifycss = require('gulp-minify-css'),
    less = require('gulp-less'),
    imgmin = require('gulp-imagemin'),
    gutil = require('gulp-util'),
    watchPath = require('gulp-watch-path'),
    connect = require('gulp-connect'),
    combiner = require('stream-combiner2');

var handleError = function (err) {
    console.log('\n');
    gutil.log('fileName: ' + gutil.colors.red(err.fileName));
    gutil.log('lineNumber: ' + gutil.colors.red(err.lineNumber));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + gutil.colors.yellow(err.plugin));
};
// 实现热更新
gulp.task('server',function(){
    connect.server({
      root:'dist',
      livereload:true
    });
  });

gulp.task("copy-index",function() {
    return gulp.src("src/html/index.html")
    .pipe(minhtml())
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload());
});

gulp.task('script', function () { //script时自定义的
    //将文件的源路径和发布路径赋值给相应变量
    var srcJsPath = 'src/js/*.js';
    var destJsPath = 'dist/js/';
    var combined = combiner.obj([
        gulp.src(srcJsPath), //获取文件源地址
        uglify(), //执行压缩
        gulp.dest(destJsPath) //将压缩的文件发布到新路径
    ]);
    combined.on('error', handleError); //打印错误日志
});
gulp.task('watchjs', function () {
    gulp.watch('src/js/*.js', function (event) {
        var paths = watchPath(event, 'src/js/', 'dist/js/');
        //打印修改类型和路径
        gutil.log(gutil.colors.yellow(event.type) + ' ' + paths.srcPath);
        gutil.log(gutil.colors.green('Dist: ') + paths.distPath);
        //获取错误信息，继续执行代码
        var combined = combiner.obj([
            gulp.src(paths.srcPath).pipe(connect.reload()),
            uglify(),
            gulp.dest(paths.distDir)
        ]);
        combined.on('error', handleError);
    });
});

// gulp.task("js",function(){
//     return gulp.src("src/js/*.js")
//     .pipe(uglify())
//     .pipe(gulp.dest("dist/js"))
//     .pipe(connect.reload());
// })

gulp.task('images', function () {
    //return gulp.src('images/*.jpg').pipe(gulp.dest('dist/images'));
    //return gulp.src('images/*.{jpg,png}').pipe(gulp.dest('dist/images'));
    //return gulp.src('images/**/*').pipe(gulp.dest('dist/images'));

    //再加了imgmin以后操作
    return gulp.src('src/images/**/*')
        .pipe(imgmin())
        .pipe(gulp.dest('dist/images')).pipe(connect.reload());
});

gulp.task("css", function () {
    return gulp.src("src/css/*.css").
    pipe(minifycss())
        .pipe(gulp.dest("dist/css")).pipe(connect.reload());
})

gulp.task("less",function(){
    return gulp.src("src/less/*.less").pipe(less())
    .pipe(minifycss())
    .pipe(gulp.dest("dist/css")).pipe(connect.reload())
});

gulp.task("watchfile",function() {
    // gulp.run('copy-index','css','images', 'js');
    gulp.run('copy-index','css','images', 'watchjs');
    // gulp.watch('src/js/*.js', ['js']);
    // 复制index.html到dist目录中去
    gulp.watch('src/html/index.html', ['copy-index']);
    //监控css
    gulp.watch('src/css/*.css', ['css']);
    // gulp.watch("src/less/*.less", ['less']);
    //监控img
    gulp.watch('src/images/*.*', ['images']);
})

gulp.task('default', ['server', 'watchfile']);