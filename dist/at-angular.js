var at;
(function (at) {
    'use strict';
    /**
     * Retrieves injectNames from specified classes,
     * to generate an array, which only consists of
     * inject names
     *
     * @param values
     * @return {string|Function|any[]}
     */
    function retrieveInjectNames(values) {
        return values.map(function (value) {
            if (angular.isString(value)) {
                return value;
            }
            var injectName = Reflect.getMetadata('injectName', value);
            if (!injectName) {
                throw new Error("Specified class '" + getFunctionName(value) + "' has no meta data for injectName");
            }
            return injectName;
        });
    }
    at.retrieveInjectNames = retrieveInjectNames;
    /**
     * Helper method to get name of function
     *
     * @param fn
     * @return {any}
     */
    function getFunctionName(fn) {
        if (fn.name) {
            return fn.name;
        }
        return /^function\s+([\w\$]+)\s*\(/.exec(fn.toString())[1];
    }
    /**
     * A helper method to generate an annotated function
     * in the old angular way. This accepts beside strings
     * annotated classes.
     *
     *
     * @param dependencies
     * @return {string|Function[]|string|Function|any[]}
     */
    function invokable() {
        var dependencies = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            dependencies[_i - 0] = arguments[_i];
        }
        var fn = dependencies.pop();
        return retrieveInjectNames(dependencies).concat(fn);
    }
    at.invokable = invokable;
    /**
     * This generates an identifier for any app component
     * (services, providers, factories, controllers).
     * To ensure, that each component gets an unique
     * identifier, an autoincrement numerical value
     * is used. To prevent collision with external
     * modules, the identifier consists of the components
     * module name, which already has to be unique
     * regarding other modules.
     *
     * @param moduleName
     * @return {string}
     */
    at.createIdentifier = (function () {
        var count = 1; // the counter prevents internal collisions
        return function (moduleName) { return moduleName + '-' + (count++); };
    }());
    /**
     * Processes annotations for services, providers, factories and controllers.
     * Stores meta data for injectName for each class and initializes each
     * component with specified module.
     *
     * @param any
     * @param name
     * @param mode
     * @param providedServiceClass
     * @param create
     * @return {function(any): void}
     */
    function process(any, name, mode, providedServiceClass, create) {
        if (create === void 0) { create = true; }
        return function (target) {
            var module = angular.isObject(any) ? any : angular.module(any);
            // if Provider annotation passes provided service class,
            // retrieve inject name from service
            if (providedServiceClass) {
                name = Reflect.getMetadata('injectName', providedServiceClass);
            }
            else {
                // generate inject name if necessary
                name = name || at.createIdentifier(module.name);
            }
            // store inject name via reflect-metadata
            Reflect.defineMetadata('injectName', mode === 'provider' ? name + 'Provider' : name, target);
            if (create)
                module[mode](name, target);
        };
    }
    at.process = process;
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
    /**
     * Prepares attributes for component directives.
     *
     * @param options
     * @return {function(any, string): void}
     * @annotation
       */
    function Attribute(options) {
        if (options === void 0) { options = {}; }
        return function (target, key) {
            var componentAttributesMeta = Reflect.getMetadata('componentAttributes', target.constructor);
            if (!componentAttributesMeta) {
                componentAttributesMeta = [];
                Reflect.defineMetadata('componentAttributes', componentAttributesMeta, target.constructor);
            }
            var attributeMeta = angular.extend({}, defaultAttributeOptions, options);
            attributeMeta.propertyName = key;
            attributeMeta.name = options.name || key;
            attributeMeta.scopeHash = attributeMeta.binding + (attributeMeta.isOptional ? '?' : '') + (attributeMeta.name);
            componentAttributesMeta.push(attributeMeta);
        };
    }
    at.Attribute = Attribute;
})(at || (at = {}));
var at;
(function (at) {
    function ClassFactory(any, className) {
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
            var module = angular.isObject(any) ? any : angular.module(any);
            // generate inject name if necessary
            className = className || at.createIdentifier(module.name);
            // store inject name via reflect-metadata
            // to target, not factory
            Reflect.defineMetadata('injectName', className, target);
            module.factory(className, factory);
        };
    }
    at.ClassFactory = ClassFactory;
})(at || (at = {}));
var at;
(function (at) {
    var componentDefaultOptions = {
        restrict: 'E',
        controllerAs: 'vm',
        transclude: false,
        bindToController: true,
        controller: null
    };
    /**
     * Creates an angular directive in component style
     *
     * @param options
     * @return {function(Function): void}
     * @annotation
     */
    function Component(options) {
        return function (target) {
            var config = angular.extend({}, componentDefaultOptions, options || {});
            // store component name, to be accessible from native js object
            var componentMeta = { name: options.componentName };
            Reflect.defineMetadata('component', componentMeta, target);
            // attribute meta data is defined in Attribute annotation
            var attributeMeta = Reflect.getMetadata('componentAttributes', target) || [];
            // required controller meta data is defined in RequiredCtrl annotation
            var requiredCtrlMeta = Reflect.getMetadata('requiredControllers', target) || [];
            // add required elements to directive config
            config.require = requiredCtrlMeta.map(function (value) { return value.option; });
            // set target class as controller
            config.controller = target;
            // init isolated scope
            config.scope = {};
            // set scope hashes for controller scope
            angular.forEach(attributeMeta, function (meta) {
                config.scope[meta.propertyName] = meta.scopeHash;
            });
            // If onPreLink, onPostLink or onDestroy are implemented by
            // targets prototype, prepare these events:
            if (target.prototype.onPreLink
                || target.prototype.onPostLink
                || target.prototype.onDestroy
                || requiredCtrlMeta.length) {
                var link_1 = {};
                if (target.prototype.onPreLink
                    || target.prototype.onDestroy
                    || requiredCtrlMeta.length) {
                    link_1.pre = function (scope, element, attrs, requiredCtrlInstances) {
                        // ensure that requiredCtrlInstances parameter is always an array
                        requiredCtrlInstances = requiredCtrlInstances ? [].concat(requiredCtrlInstances) : [];
                        // retrieve component instance from scope, through controllerAs name
                        var componentInstance = scope[config.controllerAs];
                        // initialized required controller instances to component instance
                        requiredCtrlInstances.forEach(function (instance, index) {
                            componentInstance[requiredCtrlMeta[index].key] = instance;
                        });
                        // process registered event handlers
                        if (componentInstance.onPreLink)
                            componentInstance.onPreLink(element);
                        if (componentInstance.onDestroy)
                            scope.$on('$destroy', function () { return componentInstance.onDestroy(element); });
                    };
                }
                if (target.prototype.onPostLink) {
                    link_1.post = function (scope, element) {
                        // retrieve component instance from scope, through controllerAs name
                        var componentInstance = scope[config.controllerAs];
                        // process registered event handlers
                        if (componentInstance.onPostLink)
                            componentInstance.onPostLink(element);
                    };
                }
                // add link to directive config
                config.compile = function () { return link_1; };
            }
            if (!config.moduleName && !config.module) {
                throw new Error('Either "moduleName" or "module" has to be defined');
            }
            angular.module(config.moduleName || config.module.name)
                .directive(config.componentName, function () { return config; });
        };
    }
    at.Component = Component;
})(at || (at = {}));
var at;
(function (at) {
    function Config(any, inlineAnnotatedFunction) {
        return function (target) {
            var module = angular.isObject(any) ? any : angular.module(any);
            inlineAnnotatedFunction = at.invokable.apply(at.invokable, inlineAnnotatedFunction);
            module.config(inlineAnnotatedFunction);
        };
    }
    at.Config = Config;
})(at || (at = {}));
var at;
(function (at) {
    function Controller(any, ctrlName) {
        return at.process(any, ctrlName, 'controller');
    }
    at.Controller = Controller;
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
    function Directive(any, directiveName) {
        return function (target) {
            var module = angular.isObject(any) ? any : angular.module(any);
            var config;
            var ctrlName = angular.isString(target.controller) ? target.controller.split(' ').shift() : null;
            /* istanbul ignore else */
            if (ctrlName) {
                at.Controller(module.name, ctrlName)(target);
            }
            config = directiveProperties.reduce(function (config, property) {
                return angular.isDefined(target[property]) ? angular.extend(config, (_a = {}, _a[property] = target[property], _a)) :
                    config;
                var _a;
                /* istanbul ignore next */
            }, { controller: target, scope: Boolean(target.templateUrl) });
            at.process(any, directiveName, 'directive')(function () { return (config); });
        };
    }
    at.Directive = Directive;
})(at || (at = {}));
var at;
(function (at) {
    function Factory(any, serviceName) {
        return at.process(any, serviceName, 'factory');
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
            args = at.retrieveInjectNames(args);
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
    /**
     * Prepares input attribute for component directives.
     *
     * @param options
     * @return {function(any, string): void}
     * @annotation
       */
    function Input(options) {
        if (options === void 0) { options = {}; }
        options.binding = '=';
        return at.Attribute(options);
    }
    at.Input = Input;
})(at || (at = {}));
var at;
(function (at) {
    /**
     * Prepares output attributes for component directives.
     * The consumer of the corresponding component can pass
     * event listeners to this attribute. This attribute is
     * defined for a specified action. Every time this action
     * occurs, the event listener will be executed.
     *
     * @param options
     * @return {IMemberAnnotationDecorator}
     * @annotation
       */
    function Output(options) {
        if (options === void 0) { options = {}; }
        // Attribute defaults for listener
        options.isOptional = true;
        options.binding = '&';
        return at.Attribute(options);
    }
    at.Output = Output;
})(at || (at = {}));
var at;
(function (at) {
    function ProvidedService(any, serviceName) {
        return at.process(any, serviceName, 'service', void 0, false);
    }
    at.ProvidedService = ProvidedService;
})(at || (at = {}));
var at;
(function (at) {
    function Provider(any, service) {
        return at.process(any, angular.isString(service) ? service : void 0, 'provider', angular.isFunction(service) ? service : void 0);
    }
    at.Provider = Provider;
})(at || (at = {}));
var at;
(function (at) {
    /**
     * Processes required controller for components property.
     * Property is initialized with controller instance
     * of required component or directive through preLink.
     *
     * @param option Name of component or directive with require specification (^, ^^)
     * @return {function(any, string): void}
     * @constructor
       */
    function RequiredCtrl(option) {
        return function (target, key) {
            var requiredControllersMeta = Reflect.getMetadata('requiredControllers', target.constructor);
            if (!requiredControllersMeta) {
                requiredControllersMeta = [];
                Reflect.defineMetadata('requiredControllers', requiredControllersMeta, target.constructor);
            }
            // Add required controller meta data to the component meta data;
            requiredControllersMeta.push({ key: key, option: option });
        };
    }
    at.RequiredCtrl = RequiredCtrl;
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
var at;
(function (at) {
    /**
     * This is a configuration wrapper for the ui-router.
     * It makes it possible to define states, configured
     * with components instead of views and controllers.
     *
     * @param options
     * @return {function(Function): void}
     * @annotation
     */
    function RouteConfig(options) {
        var _$interpolateProvider;
        return function (target) {
            if (!options || !(options.stateConfigs && options.stateConfigs.length) || !options.module) {
                throw new Error('Options (stateConfigs, module) are missing for RouteConfig annotation');
            }
            options.module.config(['$stateProvider', '$interpolateProvider', '$urlRouterProvider', '$injector',
                function ($stateProvider, $interpolateProvider, $urlRouterProvider, $injector) {
                    _$interpolateProvider = $interpolateProvider;
                    processUrlRouterProviderOptions($urlRouterProvider);
                    if (options.invokable)
                        $injector.invoke(options.invokable);
                    angular.forEach(options.stateConfigs, function (config) {
                        // process config for unnamed view
                        if ('component' in config || 'view' in config) {
                            processView(config);
                        }
                        // process configs for named views
                        if (config.views) {
                            for (var key in config.views) {
                                if (config.views.hasOwnProperty(key)) {
                                    processView(config.views[key]);
                                }
                            }
                        }
                        $stateProvider.state(config);
                    });
                }]);
        };
        /**
         * Resolves wrapped RouteConfig configuration to $stateProvider
         * state configurations for one view
         *
         * @param config
         */
        function processView(config) {
            if (config.component) {
                var componentMeta = Reflect.getMetadata('component', config.component);
                if (!componentMeta.name) {
                    throw new Error('Value for component attribute has to be a with @Component decorated class');
                }
                var attributeMeta = Reflect.getMetadata('componentAttributes', config.component) || [];
                checkToResolvedAttributes(attributeMeta, config.resolve);
                if (config.resolve) {
                    config.controller = getController(attributeMeta, config.resolve);
                }
                config.template = getTemplate(attributeMeta, componentMeta.name, config.resolve);
            }
            else if (config.view) {
                var viewMeta = Reflect.getMetadata('view', config.view);
                if (!viewMeta) {
                    throw new Error('Value for view attribute has to be a with @View decorated class');
                }
                var viewConfig = viewMeta;
                for (var key in viewConfig) {
                    if (viewConfig.hasOwnProperty(key)) {
                        config[key] = viewConfig[key];
                    }
                }
            }
            else {
                throw new Error('View configuration needs either an view or component attribute');
            }
        }
        /**
         * Prepares the $urlRouterProvider configurations "when", "rule", "otherwise" and "deferIntercept"
         * @example
         *
         * from RouterConfig options:
         *    {
     *        conditions: [{when: '/', then: '/user'}],
     *        rules: [function rule1(){ .. }, function rule2() { .. }],
     *        otherwise: '/home',
     *        deferIntercept: true
     *    }
         * to $urlRouterProvider configuration:
         *
         *    $urlRouterProvider.when(conditions[0].when, conditions[0].then);
         *    $urlRouterProvider.rule(rules[0]);
         *    $urlRouterProvider.otherwise(otherwise);
         *    $urlRouterProvider.deferIntercept(deferIntercept);
         *
         *
         * @param $urlRouterProvider
         */
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
            var resolvedMetaData = attributeMeta.filter(function (meta) {
                // Only prepare dependencies, that are defined
                // in resolveObj
                return !!resolveObj[meta.name];
            });
            var controller = function ($scope) {
                var resolvedValues = Array.prototype.slice.call(arguments, 1);
                resolvedMetaData.forEach(function (meta, index) {
                    return $scope[meta.name] = resolvedValues[index];
                });
            };
            return ['$scope'].concat(resolvedMetaData.map(function (meta) { return meta.name; }), controller);
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
                if (!resolveObj[meta.name] && !meta.isOptional) {
                    throw new Error("There is no resolve object for \"" + meta.name + "\" attribute defined");
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
         * @param componentName
         * @param resolveObj
         * @return {string} Template
         */
        function getTemplate(attributeMeta, componentName, resolveObj) {
            var templateAttrs = '';
            var endSymbol = _$interpolateProvider.endSymbol();
            var startSymbol = _$interpolateProvider.startSymbol();
            var dashedSelector = toDash(componentName);
            var SIMPLE_STRING_BINDING = '@';
            var LISTENER_BINDING = '&';
            // It is only necessary to add attributes if there are resolved
            // in the templates scope
            if (resolveObj) {
                angular.forEach(attributeMeta, function (meta) {
                    // It is only necessary to add attributes to the component
                    // that are defined in resolveObj
                    if (resolveObj[meta.name]) {
                        var value = void 0;
                        switch (meta.binding) {
                            case SIMPLE_STRING_BINDING:
                                value = (startSymbol + meta.name + endSymbol);
                                break;
                            case LISTENER_BINDING:
                                value = meta.name + "(" + (meta.eventParamNames ? meta.eventParamNames.join(',') : '') + ")";
                                break;
                            default:
                                value = meta.name;
                        }
                        templateAttrs += toDash(meta.name) + "=\"" + value + "\" ";
                    }
                });
            }
            return "<" + dashedSelector + " " + templateAttrs + "></" + dashedSelector + ">";
        }
        /**
         * Converts camelcase to dashed case
         *
         * @example
         *    "thatIsGreat" > "that-is-great"
         *
         * @param str
         * @return {any}
         */
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
    function Service(any, serviceName) {
        return at.process(any, serviceName, 'service');
    }
    at.Service = Service;
})(at || (at = {}));
var at;
(function (at) {
    /**
     * Stores meta data for configuring a view for ui.router
     *
     * @param options
     * @return {function(Function): void}
     * @annotation
     */
    function View(options) {
        return function (target) {
            var viewMeta = options;
            if (!viewMeta.controllerAs)
                viewMeta.controllerAs = 'vm';
            viewMeta.controller = target;
            Reflect.defineMetadata('view', viewMeta, target);
        };
    }
    at.View = View;
})(at || (at = {}));
//# sourceMappingURL=at-angular.js.map