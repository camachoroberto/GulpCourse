const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();


gulp.task('sass', function () {
    return gulp.src('assets/src/sass/**/*.scss')
        .pipe(concat('style.min.css'))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.stream())
});

gulp.task('js', function () {
    return gulp.src('assets/src/js/**/*.js')
        .pipe(concat('script.min.js'))
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'));
});

gulp.task('js-watch', ['assets/js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('image', function () {
    return gulp.src('assets/src/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('assets/img'));
});

gulp.task('htmlmin', function () {
    return gulp.src('_html/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('.'))
});

gulp.task('serve', gulp.parallel ('sass', 'js', 'htmlmin', 'image',function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch("assets/src/sass/**/*.scss", gulp.parallel('sass'));
    gulp.watch('assets/src/img/*', gulp.parallel('image')).on('change', browserSync.reload);
    gulp.watch('_html/**/*.html',gulp.parallel('htmlmin')).on('change', browserSync.reload);

}));

gulp.task('default', gulp.parallel ('sass', 'js', 'htmlmin', 'image'));