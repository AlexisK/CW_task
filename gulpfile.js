
var gulp   = require('gulp');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var csso   = require('gulp-csso');
var less   = require('gulp-less');
var uglify = require('gulp-uglify');



gulp.task('build_css', function(done) {
    
    gulp.src('./resources/css/**/*')
    .pipe(less())
    .pipe(concat('app.css'))
    .pipe(csso())
    .pipe(gulp.dest('./build'));
    
    done();
});


gulp.task('build_js', function(done) {
    
    gulp.src('./resources/math.min.js')
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./build'));
    
    gulp.src('./resources/js/**/*')
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build'));
    
    done();
});


gulp.task('build_html', function(done) {
    
    gulp.src('./resources/index.html').pipe(gulp.dest('./build'));
    
    done();

});



gulp.task('build', function() {
    
    runSequence('build_css','build_js','build_html');
    
});

gulp.task('observe', function() {
    
    gulp.watch('./resources/**/*',['build']);

});


