var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');//减少重复压缩
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});



gulp.task('browserSync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		}
	})
});

gulp.task('useref', function(){
	return gulp.src('app/*.html')
		.pipe(gulpIf('*.css', minifyCSS()))
		.pipe(gulpIf('*.js', uglify()))
		.pipe(useref())
		.pipe(gulp.dest('dist'));
});

gulp.task('images', function(){
	return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
		// Caching images that ran through imagemin
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
});

gulp.task('clean:dist', function(callback){
	del('dist');
	del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback)
});

gulp.task('clean', function(callback){
	del('dist');
	return cache.clearAll(callback);
});

gulp.task('watch', ['browserSync', 'sass'], function(){
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', function(callback){
	runSequence('clean:dist', 
		['sass', 'useref', 'images'],
		callback
	)
});

gulp.task('default', function(callback){
	runSequence(['sass', 'browserSync', 'watch'],
		callback
	)
})






