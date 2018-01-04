var gulp = require('gulp');
var browserSync = require('browser-sync').create();

//var $ = require('gulp-load-plugins')();
var del = require('del');   //清理目标目录  
var runSequence = require('run-sequence');//顺序执行任务
var assetRev = require('gulp-asset-rev');
var fileinclude  = require('gulp-file-include'); //引用公共部分

var autoprefixer = require('gulp-autoprefixer'),
       minifycss = require('gulp-minify-css'), //压缩css
       //jshint = require('gulp-jshint'), //js代码校验
       uglify = require('gulp-uglify'), //压缩JS
       imagemin = require('gulp-imagemin'), //压缩图片
       rename = require('gulp-rename'), //重命名文件
       concat = require('gulp-concat'),//文件合并
       notify = require('gulp-notify'),//提示信息
       cache = require('gulp-cache'),
       livereload = require('gulp-livereload'),
       htmlmin = require('gulp-htmlmin'),//压缩html代码
       rev = require('gulp-rev'),//添加时间戳
       revCollector = require('gulp-rev-collector');//时间戳添加后再html 里面替换原有的文


gulp.task('fileinclude', ['revHtml'],function() { //合并公共头尾代码
    // 适配dev-html中所有文件夹下的所有html
    gulp.src(['dev-html/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('html'));
});


//定义css、js文件路径，是本地css,js文件的路径，可自行配置
var cssUrl = 'css/**/*.css',   
    jsUrl = 'js/**/*.js',
    imgUrl='images/**/*.png';
//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function(){   
  return gulp.src(cssUrl)        
 .pipe(rev())        
 .pipe(rev.manifest())        
 .pipe(gulp.dest('rev/css'));
 });
//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function(){    
  return gulp.src(jsUrl)        
 .pipe(rev())        
 .pipe(rev.manifest())        
 .pipe(gulp.dest('rev/js'));
 });
//image生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revImg', function(){    
  return gulp.src(imgUrl)        
 .pipe(rev())        
 .pipe(rev.manifest())        
 .pipe(gulp.dest('rev/images'));
 });

 //Html更换css、js文件版本

 gulp.task('revHtml', function () {    
   return gulp.src(['rev/**/*.json', 'html/**/*.html'])  /*html/是本地html文件的路径，可自行配置*/        
  .pipe(revCollector())        
  .pipe(gulp.dest('html/'));  /*Html更换css、js文件版本,html/也是和开发环境下的html文件的路径一致*/
 });

//可以监听多个变化 包括 css  js img html 
 gulp.task('watch',function(){  //每次变化的时候  没有带上静态支援的版本号  发布的时候  重新执行一次gulp就行  
    gulp.watch('css/**/*.css').on('change', browserSync.reload);
    gulp.watch('js/**/*.js',['revJs']).on('change', browserSync.reload);
    gulp.watch('images/**/*.png',['revImg']).on('change', browserSync.reload);
    gulp.watch('dev-html/**/*.html',['fileinclude']).on('change', browserSync.reload);  //dev-html 内容变化的时候 先执行fileinclude 然后再 revHtml
});

//gulp 启动本地服务器
gulp.task('serve',function(){
    //初始化项目跟目录为'./'（也可以使用代理proxy: "yourlocal.dev"）
    browserSync.init({
        server: './'  //设置根目录
    });
    //监听html文件的变化，自动重新载入
   // gulp.watch('/src/html/**/*.html').on('change', browserSync.reload);
});

//开发构建
gulp.task('dev', function (done) {   
  condition = false;   
  runSequence(   
  ['serve'],  
  ['fileinclude'],  
  ['revImg'],        
  ['revCss'],       
  ['revJs'],    
  ['revHtml'],  
  ['watch'],      
  done);});

//设置默认任务
gulp.task('default', ['dev']);