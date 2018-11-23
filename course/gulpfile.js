const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const htmlmin = require('gulp-htmlmin');
const gls = require('gulp-live-server');


gulp.task('sass', function () {
    return gulp.src('assets/src/sass/**/*.scss')
        .pipe(concat('style.min.css'))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('assets/css'));
});

gulp.task('js', function () {
    return gulp.src('assets/src/js/**/*.js')
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'));
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

gulp.task('watch', function () {
    gulp.watch('assets/src/sass/**/*.scss', gulp.series('sass'));
    gulp.watch('assets/src/js/**/*.js', gulp.series('js'));
    gulp.watch('assets/src/img/*', gulp.series('image'));
    gulp.watch('_html/**/*.html', gulp.series('htmlmin'));
});

gulp.task('serve', function () {
    const server = gls.static('./', 8000);
    server.start();
    gulp.watch('assets/css/**/*.css', function (file) {
        gls.notify.apply(server, [file]);
    });
    gulp.watch('assets/js/**/*.js', function (file) {
        gls.notify.apply(server, [file]);
    });
    gulp.watch('assets/img/*', function (file) {
        gls.notify.apply(server, [file]);
    });
    gulp.watch('./*.html', function (file) {
        gls.notify.apply(server, [file]);
    });

});

gulp.task('default', gulp.parallel ('sass', 'js', 'htmlmin', 'image', 'watch', 'serve'));
