module.exports = function (config) {
    config.set({

        basePath: '.',

        frameworks: ['mocha', 'sinon-chai', 'chai'],

        files: [
            './node_modules/angular/angular.js',
            './node_modules/angular-mocks/angular-mocks.js',
            './node_modules/angular-ui-router/release/angular-ui-router.js',
            './node_modules/reflect-metadata/Reflect.js',
            './dist/at-angular.js',
            './test/.tmp/module.js',
            './test/.tmp/ServiceB.js',
            './test/.tmp/attr2Directive.js',
            './test/.tmp/attrDirective.js',
            './test/.tmp/ViewA.js',
            './test/.tmp/Component.js',
            {pattern: './test/.tmp/**/*.js', included: true}
        ],

        browsers: ['PhantomJS'],
        // browsers: ['Chrome'],

        // coverage reporter generates the coverage
        reporters: ['progress', 'coverage'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'dist/**/*.js': ['coverage']
        },

        coverageReporter: {
            reporters:[
                {type: 'json', subdir: '.', file: 'coverage-final.json'}
            ]
        }
    });
};
