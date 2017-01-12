import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
let _$ = loadPlugins(); //直接从package.json中自动加载插件

import browser_sync from 'browser-sync';
let browserSync = browser_sync.create();
import SSI from 'browsersync-ssi';

import jsconfig from './config/js.json';
import cssconfig from './config/css.json';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import proxy from 'http-proxy-middleware';

gulp.task('lib', cb => {
    concatConfig(jsconfig, 'js');
    concatConfig(cssconfig, 'css');

    function concatConfig(config, type) {
        let {list, libs} = config;
        for (let i = 0, i_len = libs.length; i < i_len; i++) {
            let lib = libs[i];
            let files = [];
            for (let j = 0, j_len = lib.length; j < j_len; j++) {
                files.push(list[lib[j]]);
            }
            gulp
                .src(files)
                .pipe(_$.concat(`${type}lib${i}.${type}`))
                .pipe(gulp.dest('./dist/lib'));
        }
    }
    cb();
});

gulp.task('cp', cb => {
    gulp
        .src('./src/assert/dicom/**')
        .pipe(gulp.dest('./dist/assert/dicom'));
});

gulp.task('link', cb => {
    let files = {};
    files.js = linkconfig(jsconfig, 'js');
    files.css = linkconfig(cssconfig, 'css');
    files
        .js
        .push('./js/main.js');
    files
        .css
        .push('./assert/css/main.css');
    gulp
        .src('./src/layout/index.html')
        .pipe(_$.htmlReplace({js: files.js, css: files.css}))
        .pipe(gulp.dest('./dist'))
        .on('finish', browserSync.reload);
    cb();

    function linkconfig(config, type) {
        let len = config.libs.length;
        let addresses = [];
        for (var i = 0; i < len; i++) {
            addresses.push(`lib/${type}lib${i}.${type}`);
        }
        return addresses;
    }

});

gulp.task('js', cb => {
    gulp
        .src('./src/*.json')
        .pipe(gulp.dest('./dist'));

    gulp
        .src(['./src/**/*.js', './src/**/*.json'])
        .pipe(_$.sourcemaps.init())
        .pipe(_$.rollup({
            allowRealFiles: true, format: 'iife', //cjs iife umd es
            entry: './src/js/main.js',
            moduleName: 'MACL_CATEYES',
            // plugins:[json()],
            plugins: [
                json(),
                babel({
                    presets: [
                        "es2015-rollup", "stage-0"
                    ],
                    babelrc: false
                })
            ],
            globals: {
                jQuery: 'jQuery',
                PIXI: 'PIXI',
                fetch: 'fetch',
                Emitter: 'Emitter',
                window: 'window'
            }
        }))
        .on('error', function (err) {
            console.dir(err);
        })
        .pipe(_$.sourcemaps.write())
        // .pipe(_$.uglify())
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
    gulp
        .src('./src/**/*.ts')
        .pipe(_$.typescript({
            // "out": "output.js"
        }))
        // .pipe(_$.uglify())
        .pipe(gulp.dest('./dist'))
    // .pipe(browserSync.stream());
    cb()
});

gulp.task('html', cb => {
    gulp
        .src('./src/layout/*.html')
        .pipe(gulp.dest('./dist'))
    // .on("finish",browserSync.reload);

    cb();
});

gulp.task('css', cb => {
    gulp
        .src('./src/assert/css/main.styl')
        .pipe(_$.sourcemaps.init())
        .pipe(_$.stylus())
        .pipe(_$.sourcemaps.write())
        .pipe(gulp.dest('./dist/assert/css'))

    cb()
});

gulp.task('clean', cb => {
    gulp
        .src('./dist')
        .pipe(_$.clean());
});

gulp.task('serve', cb => {
    browserSync.init({
        open: false,
        server: {
            baseDir: "./dist",

            middleware: [
                SSI({baseDir: './dist', ext: '.html'}),
                proxy('/service/', {
                    // target: "http://192.168.0.148:10003/",
                    target: "http://www.peaimage.com/",
                    changeOrigin: true
                }),
                proxy('/upload/', {
                    // target: "http://192.168.0.148:10003/",
                    target: "http://www.peaimage.com/",
                    changeOrigin: true
                })
            ]
        }
    });
    gulp.watch("src/assert/css/**/*.styl", ['css']);
    gulp.watch("src/**/*.js", ['js']);
    gulp.watch("src/**/*.json", ['js']);
    gulp.watch("src/**/*.ts", ['js']);
    gulp.watch("src/layout/**/*.html", ['html', 'link', browserSync.reload]);
});

gulp.task('liblink', ['css', 'js', 'html', 'link']);
gulp.task('default', ['css', 'js', 'html', 'link', 'serve']);