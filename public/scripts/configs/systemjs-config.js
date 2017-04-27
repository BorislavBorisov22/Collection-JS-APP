SystemJS.config({
    transpiler: 'plugin-babel',
    map: {
        'plugin-babel': './scripts/node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': './scripts/node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',
        'main': './scripts/main.js',
        'router': './scripts/router.js',
        'requester': './scripts/requester.js',
        'user-controller': './scripts/controllers/user-controller.js',
        'players-controller': '/scripts/controllers/players-controller.js',
        'template-loader': './scripts/template-loader.js',
        'user-data': './scripts/data-service/user-data.js',
        'players-data': './scripts/data-service/players-data.js',
        'validator': './scripts/validator.js',
        'utils': './scripts/utils.js',
        'local-storer': './scripts/local-storer.js'
    }
});