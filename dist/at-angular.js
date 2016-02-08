///<reference path="../typings/tsd.d.ts"/>
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
    function AttachInjects(target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (target.$inject || []).forEach(function (item, index) {
            target.prototype[(item.charAt(0) === '$' ? '$' : '$$') + item] = args[index];
        });
        return target;
    }
    at.AttachInjects = AttachInjects;
    function Inject() {
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
    at.Inject = Inject;
    function Service(moduleName, serviceName) {
        return instantiate(moduleName, serviceName, 'service');
    }
    at.Service = Service;
    function Provider(moduleName, serviceName) {
        return instantiate(moduleName, serviceName, 'provider');
    }
    at.Provider = Provider;
    function Factory(moduleName, serviceName) {
        return instantiate(moduleName, serviceName, 'factory');
    }
    at.Factory = Factory;
    function Controller(moduleName, ctrlName) {
        return instantiate(moduleName, ctrlName, 'controller');
    }
    at.Controller = Controller;
    function Directive(moduleName, directiveName) {
        return function (target) {
            var config;
            var ctrlName = angular.isString(target.controller) ? target.controller.split(' ').shift() : null;
            /* istanbul ignore else */
            if (ctrlName) {
                Controller(moduleName, ctrlName)(target);
            }
            config = directiveProperties.reduce(function (config, property) {
                return angular.isDefined(target[property]) ? angular.extend(config, (_a = {}, _a[property] = target[property], _a)) :
                    config; /* istanbul ignore next */
                var _a;
            }, { controller: target, scope: Boolean(target.templateUrl) });
            angular.module(moduleName).directive(directiveName, function () { return (config); });
        };
    }
    at.Directive = Directive;
    function ClassFactory(moduleName, className) {
        return function (target) {
            function factory() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return at.AttachInjects.apply(at, [target].concat(args));
            }
            /* istanbul ignore else */
            if (target.$inject && target.$inject.length > 0) {
                factory.$inject = target.$inject.slice(0);
            }
            angular.module(moduleName).factory(className, factory);
        };
    }
    at.ClassFactory = ClassFactory;
    var componentDefaultOptions = {
        restrict: 'E',
        controllerAs: 'ctrl',
        transclude: true,
        bindToController: true,
        controller: null
    };
    function Component(options) {
        return function (target) {
            var config = angular.extend({}, componentDefaultOptions, options || {});
            config.controller = target;
            // attributes and there requirements are defined in
            // the "attribute" annotation
            config.scope = target.prototype.__componentAttributes || {};
            if (target.prototype.onPreLink || target.prototype.onPostLink) {
                var link = {};
                if (target.prototype.onPreLink) {
                    link.pre = function (scope, element, attrs, ctrl) {
                        if (ctrl.onPreLink)
                            ctrl.onPreLink(element);
                    };
                }
                if (target.prototype.onPostLink) {
                    link.post = function (scope, element, attrs, ctrl) {
                        if (ctrl.onPostLink)
                            ctrl.onPostLink(element);
                    };
                }
                config.compile = function () { return link; };
            }
            angular.module(config.moduleName)
                .directive(config.componentName, function () { return config; });
        };
    }
    at.Component = Component;
    var bindings = {
        'function': '@',
        'default': '='
    };
    function Attribute(options) {
        if (options === void 0) { options = {}; }
        return function (target, key) {
            var defaultOptions = {
                binding: bindings[typeof target[key]] || bindings.default,
                name: key
            };
            options = angular.extend({}, defaultOptions, options);
            // will be used in "component" annotation
            if (!target.__componentAttributes) {
                target.__componentAttributes = {};
            }
            target.__componentAttributes[key] = options.binding + options.name;
        };
    }
    at.Attribute = Attribute;
    'use strict';
    /* istanbul ignore next */
    function combineResource(instance, model) {
        angular.extend(instance, instance.$_Resource(model));
    }
    /* istanbul ignore next */
    var ResourceClass = (function () {
        function ResourceClass(model) {
            combineResource(this, model);
        }
        return ResourceClass;
    })();
    at.ResourceClass = ResourceClass;
    function Resource(moduleName, className, url, options) {
        return function (target) {
            function resourceClassFactory($resource, $injector) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                if (target.prototype.__resourceActions)
                    prepareActionDataMapping(target.prototype.__resourceActions, $injector);
                var newResource = $resource(url, target.prototype.__defaultResourceParams, target.prototype.__resourceActions, options);
                // TODO: Quick fix INHERITANCE PROBLEM
                // NOTICE: Without 'extendWithPrototype' this overrides
                // prototype chain of target constructor function
                return AttachInjects.apply(void 0, [angular.extend(newResource, angular.extend(target, newResource, {
                    prototype: angular.extend(newResource.prototype, 
                    // TODO: quick fix, "extendWithPrototype()" is used here
                    extendWithPrototype({}, angular.extend(target.prototype, {
                        /* tslint:disable:variable-name */
                        $_Resource: newResource
                    })))
                }))].concat(args));
            }
            resourceClassFactory.$inject = (['$resource', '$injector']).concat(target.$inject /* istanbul ignore next */ || []);
            angular.module(moduleName).factory(className, resourceClassFactory);
        };
    }
    at.Resource = Resource;
    // TODO: For fixing INHERITANCE PROBLEM
    // This copies all parameters from src to dist, including prototype members
    function extendWithPrototype(dist, src) {
        for (var key in src) {
            if (!dist[key]) {
                dist[key] = src[key];
            }
        }
        return dist;
    }
    var REMOVE_STARTING_$_REGEX = /^\$/;
    function Action(options) {
        return function (target, key) {
            if (!target.__resourceActions) {
                target.__resourceActions = {};
            }
            key = key.replace(REMOVE_STARTING_$_REGEX, '');
            target.__resourceActions[key] = options;
        };
    }
    at.Action = Action;
    function prepareActionDataMapping(actions, $injector) {
        var keys = Object.keys(actions);
        keys.forEach(function (key) {
            var action = actions[key];
            if (action.mapper) {
                if (action.transformResponse) {
                    throw new Error('Both "mapper" and "transformResponse" are not working on an action');
                }
                var dependencies = [];
                if (action.mapperDependencies) {
                    action.mapperDependencies.forEach(function (key) {
                        dependencies.push($injector.get(key));
                    });
                }
                action.transformResponse = function (data) {
                    return JSON.parse(data).map(function (entry) {
                        return action.mapper.apply(null, [entry].concat(dependencies));
                    });
                };
            }
        });
    }
    function UseAsDefault(urlParamKey) {
        return function (target, key) {
            if (!target.__defaultResourceParams) {
                target.__defaultResourceParams = {};
            }
            target.__defaultResourceParams[urlParamKey || key] = '@' + key;
        };
    }
    at.UseAsDefault = UseAsDefault;
})(at || (at = {}));
//# sourceMappingURL=at-angular.js.map