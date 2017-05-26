const { FuseBox, TypeScriptHelpers, UglifyJSPlugin } = require("fuse-box");

const fuse = FuseBox.init({
    // Should match your NPM package name!
    // IMPORTANT
    package: "ng-typescript",
    // You can expose more than one package to window
    // Make sure that the key is matching your package name. 
    // E.g in this case it is not a "default" package
    // Bacause we renamed it!
    globals: {
        "ng-typescript": "ngTypeScript"
    },
    sourceMaps: true,
    homeDir: "src",
    plugins: [
        TypeScriptHelpers(),
        // Make sure you have it uglified for production!
        // Also make sure your code in es5 (UglifyJS does not like fancy code)
        // UglifyJSPlugin()
    ],
    shim: {
        'reflect-metadata': {
            exports: "Reflect",
        },
        'angular': {
            exports: "angular",
        },
    },
    outFile: "index.js"
});

fuse.bundle(">ng-typescript.ts -reflect-metadata -angular");