var gulp = require('gulp');
var gulputil = require('gulp-util');
var postcss = require('gulp-postcss');
var watch = require('gulp-watch');
var ts = require('gulp-typescript');
var minifycss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var prompt = require('gulp-prompt');
var imagemin = require('gulp-imagemin');

var autoprefix = require('autoprefixer');
var simplevars = require('postcss-simple-vars');
var nesting = require('postcss-nested');
var lost = require('lost');
var browsersync = require('browser-sync').create();
var fs = require('fs-extra');


/* SETTINGS START - DO NOT CHANGE - IF YOU HAVE TO CHANGE THESE DO IT IN THE SETTINGS.JSON AND FTP.JSON */
var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var version = pkg.version;

try{
    var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
    
    var design = settings.design;
    var assets = design + '/' + settings.assets + '/';
    var master = design + '/' + settings.master;
}
catch(error){
    gulputil.log('settings.json is missing');   
}

/* SETTINGS END - DO NOT CHANGE - IF YOU HAVE TO CHANGE THESE DO IT IN THE SETTINGS.JSON AND FTP.JSON */

/* FILE MASKS START */
var watchSync = [
    design + '/**/*.html',
    design + '/**/*.cshtml',
    design + '/**/*.xslt',
    design + '/**/*.min.css',
    design + '/**/*.min.js'
];

var watchCss = [
    design + '/**/css/*.css',
];

var watchTs = [
    design + '/**/ts/*.ts'
];

var library = {
	css: [
		'packages/materialize.0.96.1/content/content/materialize/css/materialize.css'
    ],
    js: [
        'packages/knockoutjs.3.4.0/Content/Scripts/knockout-3.4.0.js',
		'packages/materialize.0.96.1/content/scripts/materialize/materialize.js'
    ]
};

var imgTypes = [
    design + '/assets/img/*.png',
    design + '/assets/img/*.jpg',
    design + '/assets/img/*.svg',
    design + '/assets/img/*.gif'
];
/* FILE MASKS END */

gulp.task('default', ['browsersync', 'watchSync', 'watchCss', 'watchTs']);

gulp.task('library', ['libraryCss', 'libraryJs']);
//C:/Users/nicolai-desktop/GIT/league-SPA/league
gulp.task('browsersync', function(){
    browsersync.init({
        server: {
            baseDir: "C:/Users/Nicolai/GIT/Github/league-SPA/league"
        }
    });
});

gulp.task('watchSync', function(){
    gulp.watch(watchSync).on('change', function(file) {
        return gulp.src(file.path, {base: design + '/', buffer: false})
            .pipe(browsersync.stream())
    });
});

gulp.task('watchCss', function(){
    gulp.watch(watchCss, ['postcss']);
});

gulp.task('watchTs', function(){
    gulp.watch(watchTs, ['ts']);
});

gulp.task('postcss', function(){
    return gulp.src(assets + 'css/*.css')
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.css'))
        .pipe(postcss([lost(), autoprefix(), simplevars(), nesting()]))
        .pipe(minifycss())
        .pipe(sourcemaps.write('map/'))
        .pipe(gulp.dest(assets + 'min/'))
});

gulp.task('ts', function(){
    return gulp.src(assets + 'ts/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts({sortOutput:true}))
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('map/'))
        .pipe(gulp.dest(assets + 'min/'))
});

gulp.task('libraryJs', function(){
    return gulp.src(library.js)
        .pipe(sourcemaps.init())
        .pipe(concat('library.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('map/'))
        .pipe(gulp.dest(assets + 'min/'))
});

gulp.task('libraryCss', function(){
    return gulp.src(library.css)
        .pipe(sourcemaps.init())
        .pipe(concat('library.min.css'))
        .pipe(minifycss())
        .pipe(sourcemaps.write('map/'))
        .pipe(gulp.dest(assets + 'min/'))
});

gulp.task('imagemin', function(){
    return gulp.src(imgTypes)
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest(design + '/assets/img/'))
});

gulp.task('setup', function(){
    return gulp.src('')
        .pipe(prompt.prompt([{
            type: 'input',
            name: 'design',
            message: 'Please enter the path to your design folder (example: Templates/Designs/Website)'
        },
        {
            type: 'input',
            name: 'assets',
            message: 'Please enter your assets folder name (example: assets)'
        },
        {
            type: 'input',
            name: 'master',
            message: 'Please enter your master file name with extension (example: master.cshtml)'
        }], function(res){
                var jsonRes = JSON.stringify(res);
                fs.writeFile('settings.json', jsonRes, function(err){
            });
        }))
});