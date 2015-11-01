///<reference path="../typings/angularjs/angular.d.ts"/>
var at;
(function (at) {
    'use strict';
    var directiveProperties = [
        'compile',
        'controller',
        'controllerAs',
        'bindToController',
        'link',
        'priority',
        'replace',
        'require',
        'restrict',
        'scope',
        'template',
        'templateUrl',
        'terminal',
        'transclude'
    ];
    function instantiate(moduleName, name, mode) {
        return function (target) {
            angular.module(moduleName)[mode](name, target);
        };
    }
    function attachInjects(target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (target.$inject || []).forEach(function (item, index) {
            target.prototype[(item.charAt(0) === '$' ? '$' : '$$') + item] = args[index];
        });
        return target;
    }
    at.attachInjects = attachInjects;
    function inject() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return function (target, key, index) {
            if (angular.isNumber(index)) {
                target.$inject = target.$inject || [];
                target.$inject[index] = args[0];
            }
            else {
                target.$inject = args;
            }
        };
    }
    at.inject = inject;
    function service(moduleName, serviceName) {
        return instantiate(moduleName, serviceName, 'service');
    }
    at.service = service;
    function controller(moduleName, ctrlName) {
        return instantiate(moduleName, ctrlName, 'controller');
    }
    at.controller = controller;
    function directive(moduleName, directiveName) {
        return function (target) {
            var config;
            var ctrlName = angular.isString(target.controller) ? target.controller.split(' ').shift() : null;
            if (ctrlName) {
                controller(moduleName, ctrlName)(target);
            }
            config = directiveProperties.reduce(function (config, property) {
                return angular.isDefined(target[property]) ? angular.extend(config, (_a = {}, _a[property] = target[property], _a)) :
                    config;
                var _a;
            }, { controller: target, scope: Boolean(target.templateUrl) });
            angular.module(moduleName).directive(directiveName, function () { return (config); });
        };
    }
    at.directive = directive;
    function classFactory(moduleName, className) {
        return function (target) {
            function factory() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return at.attachInjects.apply(at, [target].concat(args));
            }
            if (target.$inject && target.$inject.length > 0) {
                factory.$inject = target.$inject.slice(0);
            }
            angular.module(moduleName).factory(className, factory);
        };
    }
    at.classFactory = classFactory;
    var componentDefaultOptions = {
        restrict: 'E',
        controllerAs: 'ctrl',
        transclude: true,
        bindToController: true,
        controller: null
    };
    function component(options) {
        return function (target) {
            var config = angular.extend(componentDefaultOptions, options || {});
            config.controller = target;
            config.scope = target.prototype.__cAttributes || {};
            config.require = target.prototype.__cRequirements || [];
            angular.module(config.moduleName)
                .directive(config.componentName, function () { return config; });
        };
    }
    at.component = component;
    var bindings = {
        'function': '@',
        'default': '='
    };
    function attribute(options) {
        if (options === void 0) { options = {}; }
        return function (target, key) {
            var defaultOptions = {
                binding: bindings[typeof target[key]] || bindings.default,
                name: key,
                isRequired: true
            };
            options = angular.extend(defaultOptions, options);
            if (!target.__cAttributes) {
                target.__cAttributes = {};
            }
            target.__cAttributes[key] = options.binding + options.name;
            if (options.isRequired) {
                if (!target.__cRequirements) {
                    target.__cRequirements = [];
                }
                target.__cRequirements.push(options.name);
            }
        };
    }
    at.attribute = attribute;
})(at || (at = {}));
//# sourceMappingURL=at-angular.js.map