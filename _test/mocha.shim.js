const jsdom = require('jsdom');
const fs = require('fs');

const document = jsdom.jsdom('<!doctype html><html><head><title>Mocha Testing Page</title></head><body></body></html>');

const window = document.defaultView;

global.document = document;
global.HTMLElement = window.HTMLElement;
global.XMLHttpRequest = window.XMLHttpRequest;
global.Node = window.Node;

/*
 if (typeof process !== 'undefined' && !process.browser) {
 window.indexedDB = global.indexedDB = require('fake-indexeddb');
 }
 */


require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

require.extensions['.scss'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

global.window = window;
window.mocha = {};
window.beforeEach = global.beforeEach;
window.afterEach = global.afterEach;
require('angular/angular');
require('angular-mocks');

global.angular = window.angular;
global.inject = global.angular.mock.inject;
global.ngModule = global.angular.mock.module;

