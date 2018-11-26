const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const htmlmin = require('gulp-htmlmin');
const gls = require('gulp-live-server');
const browserSync = require('browser-sync').create();


gulp.task('sass', function () {
    return gulp.src('assets/src/sass/**/*.scss')
        .pipe(concat('style.min.css'))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    return gulp.src('assets/src/js/**/*.js')
        .pipe(browserify())
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

gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('default', ['js'], function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('assets/src/js/**/*.js', gulp.series('js'));
});

gulp.task('serve', ['sass'], function () {
    browserSync.init({
        server: './'
    });
    gulp.watch('assets/src/sass/**/*.scss', gulp.series('sass'));
    gulp.watch('/.html').on('change', browserSync.reload);


    gulp.watch('assets/src/img/*', gulp.series('image').on('change', browserSync.reload));
    gulp.watch('/.html').on('change', browserSync.reload);

    gulp.watch('_html/**/*.html', gulp.series('htmlmin').on('change', browserSync.reload));
    gulp.watch('/.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('sass', 'js', 'htmlmin', 'image', 'watch', 'js-watch', 'serve'));
