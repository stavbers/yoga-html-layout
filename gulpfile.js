// 'use strict';

let { src, dest } = require('gulp');
let gulp = require('gulp');
let browsersync = require("browser-sync").create();
let fileinclude = require('gulp-file-include');
let sass = require('gulp-sass')(require('sass'));
let del = require("del");
let autoprefixer = require("gulp-autoprefixer");
let group_media = require("gulp-group-css-media-queries");
let htmlmin = require('gulp-htmlmin');
let rename = require("gulp-rename");
let cssmin = require('gulp-cssmin');
let webp = require("gulp-webp");
let webpHTML = require('gulp-webp-html');
let webpCss = require('gulp-webp-css');
const cleanCSS = require('gulp-clean-css');
const app = './app';



function browserSync() {
  browsersync.init({
      server:{
          baseDir: "./app"
      },
      port:3000,
      notify:true
      // notify:false
  })
}

function html() {
  return src("src/*.html")
      .pipe(fileinclude())
      // .pipe(webpHTML())
      .pipe(htmlmin({ 
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true
       }))
      .pipe(dest(app + "/"))
      .pipe(browsersync.stream())
};
// .pipe(dest(path.build.html))
function css() {
  // return gulp.src('src/**/*.scss')
  return src('./src/scss/**/*.scss')
    .pipe(sass.sync({outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(webpCss())
    .pipe(group_media())
    .pipe(autoprefixer({overrideBrowserslist: ["last 5 versions"],cascade: true}))
    // .pipe(cleanCSS({compatibility: 'ie8'})) // минификация
    // .pipe(cssmin()) // минификация
    .pipe(rename({extname: ".min.css"}))
    .pipe(gulp.dest(app + '/css'))
    .pipe(browsersync.stream())
};

function cssMin() {
  gulp.src('src/libs/**/*.css')
  // .pipe(cssmin())
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(rename({extname: ".min.css"}))
  .pipe(gulp.dest('app/libs'));
};


function images() {
  return gulp.src('src/**/*.{jpg,png,svg,gif,ico,webp}')
  
  .pipe(dest("./app"))
//   .pipe(
//     webp({
//         quality:70
//     })
// )
.pipe(dest("./app"))
.pipe(browsersync.stream())
};


function fonts(){
  return gulp.src('./src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
  .pipe(dest(app + "/fonts"))
}

function javaScript(){
  return gulp.src('./src/js/**/*.{js,json}')
  .pipe(dest(app + "/js"))
}

function watchFiles() {
  gulp.watch('src/**/*.html', html)
  gulp.watch('src/**/*.scss', css)
  gulp.watch('src' + '/fonts/**/*.{eot,svg,ttf,woff,woff2}', fonts)
  // gulp.watch([path.watch.js], js);
  gulp.watch('src' + '/img/**/*.{jpg,png,svg,gif,ico,webp}', images);
}
// html: source_folder + "/**/*.html",
// css: source_folder + "/scss/**/*.scss",
// js: source_folder + "/js/**/*.js",
// img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
function clean() {
  return del(['app/**']);
}
function cleanFile() {
  return del([app + '/_*.html']);
}
let build = gulp.series(clean, gulp.parallel(html, css, images, fonts, javaScript), cleanFile);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.images = images;
exports.fonts = fonts;
exports.javaScript = javaScript;
exports.clean = clean;
exports.cssMin = cssMin;
exports.cleanFile = cleanFile;
exports.build = build;
exports.watch = watch;
exports.default = watch;





