SystemJS.config({
    transpiler: 'plugin-babel',
    map: {
        'plugin-babel': './scripts/node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': './scripts/node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',
        'main': './scripts/main.js',
        'router': './scripts/router.js',
        'requester': './scripts/requester.js',
        'login-controller': './scripts/controllers/login-controller.js',
        'template-loader': './scripts/template-loader.js',
        'data': './scripts/data-service/data.js'
    }
});

System.import('main');