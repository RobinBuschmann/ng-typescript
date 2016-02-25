///<reference path="../typings/tsd.d.ts"/>
var at;
(function (at) {
    'use strict';
    function instantiate(moduleName, name, mode) {
        return function (target) {
            angular.module(moduleName)[mode](name, target);
        };
    }
    at.instantiate = instantiate;
})(at || (at = {}));
var at;
(function (at) {
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
})(at || (at = {}));
var at;
(function (at) {
    var defaultAttributeOptions = {
        binding: '=',
        name: '',
        isOptional: false
    };
    function Attribute(options) {
        if (options === void 0) { options = {}; }
        return function (target, key) {
            // will be used in "component" annotation
            if (!target.__componentAttributes) {
                target.__componentAttributes = [];
            }
            options = angular.extend({}, defaultAttributeOptions, options);
            // Add attribute meta data to the component meta data;
            target.__componentAttributes.push({
                key: key,
                scopeHash: options.binding + (options.isOptional ? '?' : '') + (options.name),
                isOptional: options.isOptional,
                attrName: (options.name || key),
                binding: options.binding
            });
        };
    }
    at.Attribute = Attribute;
})(at || (at = {}));
var at;
(function (at) {
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
})(at || (at = {}));
var at;
(function (at) {
    var componentDefaultOptions = {
        restrict: 'E',
        controllerAs: 'vm',
        transclude: true,
        bindToController: true,
        controller: null
    };
    function Component(options) {
        return function (target) {
            var config = angular.extend({}, componentDefaultOptions, options || {});
            target['__componentSelector'] = options.selector;
            var attributeMeta = target.prototype.__componentAttributes || [];
            config.controller = target;
            config.scope = {};
            // set scope hashes for controller scope
            angular.forEach(attributeMeta, function (meta) {
                config.scope[meta.key] = meta.scopeHash;
            });
            var factory;
            var delegateService;
            if (options.delegate) {
                if (!options.delegate.prototype.__delegateServiceName) {
                    throw new Error("Delegate must have DelegateService annotation");
                }
                setDelegateHandleAttribute(config.scope);
                // if delegate is defined, inject the specified delegate by its service name
                factory = [options.delegate.prototype.__delegateServiceName, function (__delegateService) {
                        delegateService = __delegateService;
                        return config;
                    }];
            }
            else {
                factory = function () { return config; };
            }
            // If onPreLink or onPostLink is implemented by targets
            // prototype, prepare these events:
            if (target.prototype.onPreLink || target.prototype.onPostLink || options.delegate) {
                var link_1 = {};
                if (target.prototype.onPreLink || options.delegate) {
                    link_1.pre = function (scope, element, attrs, componentInstance) {
                        if (componentInstance.onPreLink)
                            componentInstance.onPreLink(element);
                        if (delegateService)
                            delegateService.createDelegate(componentInstance, componentInstance.delegateHandle);
                        if (delegateService)
                            scope.$on('$destroy', function () { return delegateService.removeDelegate(componentInstance.delegateHandle); });
                    };
                }
                if (target.prototype.onPostLink) {
                    link_1.post = function (scope, element, attrs, componentInstance) {
                        if (componentInstance.onPostLink)
                            componentInstance.onPostLink(element);
                    };
                }
                config.compile = function () { return link_1; };
            }
            if (!config.moduleName && !config.module) {
                throw new Error('Either "moduleName" or "module" has to be defined');
            }
            angular.module(config.moduleName || config.module.name)
                .directive(config.selector, factory);
        };
    }
    at.Component = Component;
    /**
     * @ngdoc directive
     * @name delegateHandle
     * @type string
     * @restrict A
     * @description Delegate handle key, which allows a consumer of a component,
     *              to interact via a delegate with a component
     */
    function setDelegateHandleAttribute(scope) {
        scope.delegateHandle = '=?';
    }
})(at || (at = {}));
var at;
(function (at) {
    function Controller(moduleName, ctrlName) {
        return at.instantiate(moduleName, ctrlName, 'controller');
    }
    at.Controller = Controller;
})(at || (at = {}));
var at;
(function (at) {
    function DelegateService(moduleName, serviceName) {
        return function (target) {
            target.prototype.__delegateServiceName = serviceName;
            angular.module(moduleName).service(serviceName, target);
        };
    }
    at.DelegateService = DelegateService;
})(at || (at = {}));
var at;
(function (at) {
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
    function Directive(moduleName, directiveName) {
        return function (target) {
            var config;
            var ctrlName = angular.isString(target.controller) ? target.controller.split(' ').shift() : null;
            /* istanbul ignore else */
            if (ctrlName) {
                at.Controller(moduleName, ctrlName)(target);
            }
            config = directiveProperties.reduce(function (config, property) {
                return angular.isDefined(target[property]) ? angular.extend(config, (_a = {}, _a[property] = target[property], _a)) :
                    config;
                var _a;
                /* istanbul ignore next */
            }, { controller: target, scope: Boolean(target.templateUrl) });
            angular.module(moduleName).directive(directiveName, function () { return (config); });
        };
    }
    at.Directive = Directive;
})(at || (at = {}));
var at;
(function (at) {
    function Factory(moduleName, serviceName) {
        return at.instantiate(moduleName, serviceName, 'factory');
    }
    at.Factory = Factory;
})(at || (at = {}));
var at;
(function (at) {
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
})(at || (at = {}));
var at;
(function (at) {
    function Provider(moduleName, serviceName) {
        return at.instantiate(moduleName, serviceName, 'provider');
    }
    at.Provider = Provider;
})(at || (at = {}));
var at;
(function (at) {
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
    }());
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
                return at.AttachInjects.apply(void 0, [angular.extend(newResource, angular.extend(target, newResource, {
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
///<reference path="../../typings/tsd.d.ts"/>
var at;
(function (at) {
    function RouteConfig(options) {
        var _$interpolateProvider;
        return function (target) {
            if (!options || !(options.stateConfigs && options.stateConfigs.length) || !options.module) {
                throw new Error('Options (stateConfigs, module) are missing for RouteConfig annotation');
            }
            options.module.config(['$stateProvider', '$interpolateProvider', '$urlRouterProvider',
                function ($stateProvider, $interpolateProvider, $urlRouterProvider) {
                    _$interpolateProvider = $interpolateProvider;
                    processUrlRouterProviderOptions($urlRouterProvider);
                    angular.forEach(options.stateConfigs, function (config) {
                        // process config for unnamed view
                        if ('component' in config) {
                            processComponent(config);
                        }
                        // process configs for named views
                        if (config.views) {
                            for (var key in config.views) {
                                if (config.views.hasOwnProperty(key)) {
                                    processComponent(config.views[key]);
                                }
                            }
                        }
                        $stateProvider.state(config);
                    });
                }]);
        };
        function processComponent(config) {
            var attributeMeta = config.component.prototype.__componentAttributes || [];
            checkToResolvedAttributes(attributeMeta, config.resolve);
            if (config.resolve) {
                config.controller = getController(attributeMeta, config.resolve);
            }
            config.template = getTemplate(attributeMeta, config.component.__componentSelector, config.resolve);
        }
        function processUrlRouterProviderOptions($urlRouterProvider) {
            if (options.conditions) {
                angular.forEach(options.conditions, function (condition) { return $urlRouterProvider.when(condition.when, condition.then); });
            }
            if (options.rules) {
                angular.forEach(options.rules, function (rule) { return $urlRouterProvider.rule(rule); });
            }
            if (options.otherwise) {
                $urlRouterProvider.otherwise(options.otherwise);
            }
            if (options.deferIntercept !== void 0) {
                $urlRouterProvider.deferIntercept(options.deferIntercept);
            }
        }
        /**
         * The created controller is more or less a proxy, that
         * provides the required data (through ui-routers resolve)
         * for the component, that should be loaded for the
         * specified state
         *
         * @param attributeMeta
         * @param resolveObj
         * @return {string[]}
         */
        function getController(attributeMeta, resolveObj) {
            var controller = function ($scope) {
                var resolvedValues = Array.prototype.slice.call(arguments, 1);
                attributeMeta.forEach(function (meta, index) {
                    // Only prepare dependencies, that are defined
                    // in resolveObj
                    if (resolveObj[meta.attrName]) {
                        $scope[meta.attrName] = resolvedValues[index];
                    }
                });
            };
            var resolvedNames = [];
            attributeMeta.forEach(function (meta) {
                // Only prepare dependencies, that are defined
                // in resolveObj
                if (resolveObj[meta.attrName]) {
                    resolvedNames.push(meta.attrName);
                }
            });
            return ['$scope'].concat(resolvedNames, controller);
        }
        /**
         * Throws error, if there is no resolve configuration for
         * required attributes
         *
         * @param attributeMeta
         * @param resolveObj
         */
        function checkToResolvedAttributes(attributeMeta, resolveObj) {
            if (resolveObj === void 0) { resolveObj = {}; }
            angular.forEach(attributeMeta, function (meta) {
                if (!resolveObj[meta.attrName] && !meta.isOptional) {
                    throw new Error("There is no resolve object for \"" + meta.attrName + "\" attribute defined");
                }
            });
        }
        /**
         * Creates template string for specified component
         *
         * @example
         *
         * <spinner delay="{{}}"></spinner>
         *
         * @param attributeMeta
         * @param selector
         * @param resolveObj
         * @return {string} Template
         */
        function getTemplate(attributeMeta, selector, resolveObj) {
            var templateAttrs = '';
            var endSymbol = _$interpolateProvider.endSymbol();
            var startSymbol = _$interpolateProvider.startSymbol();
            var dashedSelector = toDash(selector);
            var ONE_WAY_BINDING = '@';
            // It is only necessary to add attributes if there are resolved
            // in the templates scope
            if (resolveObj) {
                angular.forEach(attributeMeta, function (meta) {
                    // It is only necessary to add attributes to the component
                    // that are defined in resolveObj
                    if (resolveObj[meta.attrName]) {
                        templateAttrs += toDash(meta.attrName) + "=\"" + (meta.binding === ONE_WAY_BINDING ?
                            (startSymbol + meta.attrName + endSymbol) : meta.attrName) + "\" ";
                    }
                });
            }
            return "<" + dashedSelector + " " + templateAttrs + "></" + dashedSelector + ">";
        }
        function toDash(str) {
            return str.replace(/([A-Z])/g, function ($1) {
                return "-" + $1.toLowerCase();
            });
        }
    }
    at.RouteConfig = RouteConfig;
})(at || (at = {}));
var at;
(function (at) {
    function Service(moduleName, serviceName) {
        return at.instantiate(moduleName, serviceName, 'service');
    }
    at.Service = Service;
})(at || (at = {}));
var at;
(function (at) {
    var Delegate = (function () {
        function Delegate() {
            this.delegates = {};
        }
        Delegate.prototype.getByHandle = function (handleKey) {
            var delegate = this.delegates[handleKey];
            if (delegate) {
                return delegate;
            }
            throw new Error("Delegate with handle key " + handleKey + " does not exist");
        };
        /**
         * @internal
         * @param handleKey
         * @param componentInstance
         */
        Delegate.prototype.createDelegate = function (componentInstance, handleKey) {
            if (handleKey === void 0) { handleKey = null; }
            if (handleKey) {
                if (this.delegates[handleKey]) {
                    throw new Error("Delegate with handle key " + handleKey + " already exist");
                }
                var delegate = this.getInstance();
                delegate['componentInstance'] = componentInstance;
                this.delegates[handleKey] = delegate;
            }
            else {
                // if no handle key is provided, set current instance
                // to the delegate of the specified component instance
                // as fall back
                this.componentInstance = componentInstance;
            }
        };
        /**
         * @internal
         * @param handleKey
         */
        Delegate.prototype.removeDelegate = function (handleKey) {
            if (handleKey && this.delegates[handleKey]) {
                this.delegates[handleKey] = null;
            }
        };
        return Delegate;
    }());
    at.Delegate = Delegate;
})(at || (at = {}));
//# sourceMappingURL=at-angular.js.map