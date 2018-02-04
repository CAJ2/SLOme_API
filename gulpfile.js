var gulp = require('gulp');
var ts = require('gulp-typescript');
var nodemon = require('gulp-nodemon');
var tsProject = ts.createProject('tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('default', (done) => {
    runSequence('clean', 'typescript');
});

gulp.task('clean', (done) => {
    return del(['dist'], done);
})

gulp.task('typescript', () => {
    return tsProject.src().pipe(sourcemaps.init()).pipe(tsProject())
        .js.pipe(sourcemaps.write('dist')).pipe(gulp.dest('dist'));
});