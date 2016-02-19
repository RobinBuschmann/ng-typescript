///<reference path="../typings/tsd.d.ts"/>

// Support AMD require
// and SystemJS import
declare module 'at' {
    export = at;
}

module at {

    import IModule = angular.IModule;
    'use strict';

    const directiveProperties: string[] = [
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

    /* tslint:disable:no-any */
    export interface IClassAnnotationDecorator {
        (target: any): void;
        (t: any, key: string, index: number): void;
    }

    /* tslint:disable:no-any */
    export interface IMemberAnnotationDecorator {
        (target: any, key: string): void;
    }

    function instantiate(moduleName: string, name: string, mode: string): IClassAnnotationDecorator {
        return (target: any): void => {
            angular.module(moduleName)[mode](name, target);
        };
    }

    export function AttachInjects(target: any, ...args: any[]): any {
        (target.$inject || []).forEach((item: string, index: number) => {
            target.prototype[(item.charAt(0) === '$' ? '$' : '$$') + item] = args[index];
        });
        return target;
    }

    export interface IInjectAnnotation {
        (...args: any[]): IClassAnnotationDecorator;
    }

    export function Inject(...args: string[]): at.IClassAnnotationDecorator {
        return (target: any, key?: string, index?: number): void => {
            if (angular.isNumber(index)) {
                target.$inject = target.$inject || [];
                target.$inject[index] = args[0];
            } else {
                target.$inject = args;
            }
        };
    }

    export interface IServiceAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }

    export function Service(moduleName: string, serviceName: string): at.IClassAnnotationDecorator {
        return instantiate(moduleName, serviceName, 'service');
    }

    export interface IProviderAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }

    export function Provider(moduleName: string, serviceName: string): at.IClassAnnotationDecorator {
        return instantiate(moduleName, serviceName, 'provider');
    }

    export interface IFactoryAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }

    export function Factory(moduleName: string, serviceName: string): at.IClassAnnotationDecorator {
        return instantiate(moduleName, serviceName, 'factory');
    }

    export interface IControllerAnnotation {
        (moduleName: string, ctrlName: string): IClassAnnotationDecorator;
    }

    export function Controller(moduleName: string, ctrlName: string): at.IClassAnnotationDecorator {
        return instantiate(moduleName, ctrlName, 'controller');
    }

    export interface IDirectiveAnnotation {
        (moduleName: string, directiveName: string): IClassAnnotationDecorator;
    }

    export function Directive(moduleName: string, directiveName: string): at.IClassAnnotationDecorator {
        return (target: any): void => {
            let config: angular.IDirective;
            const ctrlName: string = angular.isString(target.controller) ? target.controller.split(' ').shift() : null;
            /* istanbul ignore else */
            if (ctrlName) {
                Controller(moduleName, ctrlName)(target);
            }
            config = directiveProperties.reduce((config: angular.IDirective,
                                                 property: string) => {
                return angular.isDefined(target[property]) ? angular.extend(config, {[property]: target[property]}) :
                    config;
                /* istanbul ignore next */
            }, {controller: target, scope: Boolean(target.templateUrl)});

            angular.module(moduleName).directive(directiveName, () => (config));
        };
    }

    export interface IClassFactoryAnnotation {
        (moduleName: string, className: string): IClassAnnotationDecorator;
    }

    export function ClassFactory(moduleName: string, className: string): at.IClassAnnotationDecorator {
        return (target: any): void => {
            function factory(...args: any[]): any {
                return at.AttachInjects(target, ...args);
            }

            /* istanbul ignore else */
            if (target.$inject && target.$inject.length > 0) {
                factory.$inject = target.$inject.slice(0);
            }
            angular.module(moduleName).factory(className, factory);
        };
    }

    interface IComponentDirective extends IComponentOptions {
        controller: Function|{prototype:{__componentAttributes:any;__componentRequirements:Array<string>}};
        scope: any;
        require: Array<string>;
    }

    export interface IComponentOptions {
        templateUrl?: string;
        template?: string;
        controllerAs?: string;
        moduleName?: string;
        module?: IModule;
        selector: string;
    }

    var componentDefaultOptions = {
        restrict: 'E',
        controllerAs: 'vm',
        transclude: true,
        bindToController: true,
        controller: null
    };

    export interface IPreLink {
        onPreLink: (element: JQuery) => void;
    }
    export interface IPostLink {
        onPostLink: (element: JQuery) => void;
    }

    export function Component(options: IComponentOptions): at.IClassAnnotationDecorator {
        return (target: Function) => {

            var config: IComponentDirective =
                angular.extend({}, componentDefaultOptions, options || {});

            target['__componentSelector'] = options.selector;

            let attributeMeta = target.prototype.__componentAttributes || [];

            config.controller = target;
            config.scope = {};

            // set scope hashes for controller scope
            angular.forEach(attributeMeta, meta => {
                config.scope[meta.key] = meta.scopeHash;
            });

            // If onPreLink or onPostLink is implemented by targets
            // prototype, prepare these events:
            if (target.prototype.onPreLink || target.prototype.onPostLink) {

                let link: {pre?: Function; post?: Function} = {};

                if (target.prototype.onPreLink) {
                    link.pre = (scope, element, attrs, ctrl) => {
                        if (ctrl.onPreLink) ctrl.onPreLink(element);
                    }
                }
                if (target.prototype.onPostLink) {
                    link.post = (scope, element, attrs, ctrl) => {
                        if (ctrl.onPostLink) ctrl.onPostLink(element);
                    }
                }

                (<any>config).compile = () => link;
            }

            if (!config.moduleName && !config.module) {

                throw new Error('Either "moduleName" or "module" has to be defined')
            }

            angular.module(config.moduleName || config.module.name)
                .directive(config.selector, () => config);
        }
    }

    export interface IAttributeOptions {
        binding?: string;
        name?: string;
        isOptional?: boolean;
    }

    const defaultAttributeOptions = {
        binding: '=',
        name: '',
        isOptional: false
    };

    export function Attribute(options: IAttributeOptions = {}): IMemberAnnotationDecorator {

        return (target: any, key: string) => {

            // will be used in "component" annotation
            if (!target.__componentAttributes) {
                target.__componentAttributes = [];
            }

            options = angular.extend({}, defaultAttributeOptions, options);

            // Add attribute meta data to the component meta data;
            target.__componentAttributes.push({
                key,
                scopeHash: options.binding + (options.isOptional ? '?' : '') + (options.name),
                isOptional: options.isOptional,
                attrName: (options.name || key),
                binding: options.binding
            });
        }
    }

    export interface IComponentState {

        /**
         * Class that is decorated by @at.Component
         */
        component?: Function;

        /**
         * Name of the state
         */
        name?: string;

        parent?: string;

        views?: { [name:string]: IComponentState };

        resolve?: { [name:string]: any };
        /**
         * A url with optional parameters. When a state is navigated or transitioned to, the $stateParams service will be populated with any parameters that were passed.
         */
        url?: string;
        /**
         * A map which optionally configures parameters declared in the url, or defines additional non-url parameters. Only use this within a state if you are not using url. Otherwise you can specify your parameters within the url. When a state is navigated or transitioned to, the $stateParams service will be populated with any parameters that were passed.
         */
        params?: any;
        /**
         * Use the views property to set up multiple views. If you don't need multiple views within a single state this property is not needed. Tip: remember that often nested views are more useful and powerful than multiple sibling views.
         */
            abstract?: boolean;
        /**
         * Callback function for when a state is entered. Good way to trigger an action or dispatch an event, such as opening a dialog.
         * If minifying your scripts, make sure to explicitly annotate this function, because it won't be automatically annotated by your build tools.
         */
        onEnter?: Function|Array<string|Function>;
        /**
         * Callback functions for when a state is entered and exited. Good way to trigger an action or dispatch an event, such as opening a dialog.
         * If minifying your scripts, make sure to explicitly annotate this function, because it won't be automatically annotated by your build tools.
         */
        onExit?: Function|Array<string|Function>;
        /**
         * Arbitrary data object, useful for custom configuration.
         */
        data?: any;

        /**
         * Boolean (default true). If false will not re-trigger the same state just because a search/query parameter has changed. Useful for when you'd like to modify $location.search() without triggering a reload.
         */
        reloadOnSearch?: boolean;

        /**
         * Boolean (default true). If false will reload state on everytransitions. Useful for when you'd like to restore all data  to its initial state.
         */
        cache?: boolean;
    }

    export interface IRouteConfigOptions {
        stateConfigs: Array<IComponentState>,
        module: IModule,
        conditions?: Array<{when: string|any, then: string|Function}>,
        rules?: Array<Function>,
        otherwise?: string|Function,
        deferIntercept?: boolean
    }

    export function RouteConfig(options: IRouteConfigOptions): at.IClassAnnotationDecorator {
        let _$interpolateProvider;

        return (target: Function) => {

            if (!options || !(options.stateConfigs && options.stateConfigs.length) || !options.module) {

                throw new Error('Options (stateConfigs, module) are missing for RouteConfig annotation');
            }

            options.module.config(['$stateProvider', '$interpolateProvider', '$urlRouterProvider',
                ($stateProvider, $interpolateProvider, $urlRouterProvider) => {

                    _$interpolateProvider = $interpolateProvider;
                    processUrlRouterProviderOptions($urlRouterProvider);

                    angular.forEach(options.stateConfigs, config => {

                        // process config for unnamed view
                        if ('component' in config) {
                            processComponent(config);
                        }

                        // process configs for named views
                        if (config.views) {
                            for (let key in config.views) {
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

            let attributeMeta = config.component.prototype.__componentAttributes || [];

            checkToResolvedAttributes(attributeMeta, config.resolve);

            if (config.resolve) {

                config.controller = getController(attributeMeta, config.resolve);
            }

            config.template = getTemplate(attributeMeta, config.component.__componentSelector, config.resolve);
        }

        function processUrlRouterProviderOptions($urlRouterProvider) {

            if(options.conditions) {
                angular.forEach(options.conditions, condition => $urlRouterProvider.when(condition.when, condition.then));
            }
            if(options.rules) {
                angular.forEach(options.rules, rule => $urlRouterProvider.rule(rule));
            }
            if(options.otherwise) {
                $urlRouterProvider.otherwise(options.otherwise);
            }
            if(options.deferIntercept !== void 0) {
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

            let controller = function ($scope) {

                var resolvedValues = Array.prototype.slice.call(arguments, 1);

                attributeMeta.forEach((meta, index) => {

                    // It is only necessary to add values to the scope
                    // that are defined in resolveObj
                    if (resolveObj[meta.attrName]) {

                        $scope[meta.attrName] = resolvedValues[index];
                    }
                })
            };

            return ['$scope'].concat(attributeMeta.map(meta => meta.attrName), controller)
        }

        /**
         * Throws error, if there is no resolve configuration for
         * required attributes
         *
         * @param attributeMeta
         * @param resolveObj
         */
        function checkToResolvedAttributes(attributeMeta, resolveObj = {}) {

            angular.forEach(attributeMeta, meta => {

                if (!resolveObj[meta.attrName] && !meta.isOptional) {

                    throw new Error(`There is no resolve object for "${meta.attrName}" attribute defined`);
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
        function getTemplate(attributeMeta, selector, resolveObj?) {
            let templateAttrs = '';
            let endSymbol = _$interpolateProvider.endSymbol();
            let startSymbol = _$interpolateProvider.startSymbol();
            let dashedSelector = toDash(selector);
            const ONE_WAY_BINDING = '@';

            // It is only necessary to add attributes if there are resolved
            // in the templates scope
            if (resolveObj) {

                angular.forEach(attributeMeta, meta => {

                    // It is only necessary to add attributes to the component
                    // that are defined in resolveObj
                    if (resolveObj[meta.attrName]) {

                        templateAttrs += `${toDash(meta.attrName)}="${meta.binding === ONE_WAY_BINDING ?
                            (startSymbol + meta.attrName + endSymbol) : meta.attrName}" `;
                    }

                });
            }

            return `<${dashedSelector} ${templateAttrs}></${dashedSelector}>`;
        }

        function toDash(str) {
            return str.replace(/([A-Z])/g, function ($1) {
                return "-" + $1.toLowerCase();
            });
        }
    }

    import IResourceArray = angular.resource.IResourceArray;
    'use strict';

    /* tslint:disable:no-any */
    type ResourceService = angular.resource.IResourceService;

    /* istanbul ignore next */
    function combineResource(instance: any, model?: any): void {
        angular.extend(instance, instance.$_Resource(model));
    }

    /* istanbul ignore next */
    export class ResourceClass<T> implements angular.resource.IResource<T> {
        public $promise: angular.IPromise<T>;
        private $promiseArray: angular.IPromise<IResourceArray<T>>;
        public $resolved: boolean;

        constructor(model?: any) {
            combineResource(this, model);
        }

        $get: () => angular.IPromise<T>;
        $query: () => angular.IPromise<IResourceArray<T>>;
        $save: () => angular.IPromise<T>;
        $remove: () => angular.IPromise<T>;
        $delete: () => angular.IPromise<T>;

        toJSON: () => {
            [index: string]: any;
        }
    }

    /* istanbul ignore next */
    //export class ResourceWithUpdate extends Resource  {
    //    public $promise : angular.IPromise<ResourceWithUpdate>;
    //    constructor(model?: any) { super(model); }
    //    public static update(params?: Object): ResourceWithUpdate { return new ResourceWithUpdate(); }
    //    public $update(params?: Object): angular.IPromise<ResourceWithUpdate> { return this.$promise; }
    //}

    export interface IResourceAnnotation {
        (moduleName: string, className: string): IClassAnnotationDecorator;
    }

    export function Resource(moduleName: string, className: string, url: string, options?: any): IClassAnnotationDecorator {
        return (target: any): void => {
            function resourceClassFactory($resource: ResourceService, $injector: ng.auto.IInjectorService, ...args: any[]): any {

                if (target.prototype.__resourceActions) prepareActionDataMapping(target.prototype.__resourceActions, $injector);

                const newResource: angular.resource.IResourceClass<any> =
                    $resource(url, target.prototype.__defaultResourceParams,
                        target.prototype.__resourceActions, options);

                // TODO: Quick fix INHERITANCE PROBLEM

                // NOTICE: Without 'extendWithPrototype' this overrides
                // prototype chain of target constructor function
                return AttachInjects(angular.extend(newResource, angular.extend(target, newResource, {
                    prototype: angular.extend(newResource.prototype,
                        // TODO: quick fix, "extendWithPrototype()" is used here
                        extendWithPrototype({}, angular.extend(target.prototype, {
                            /* tslint:disable:variable-name */
                            $_Resource: newResource
                            /* tslint:enable:variable-name */
                        })))
                })), ...args);
            }

            resourceClassFactory.$inject = (['$resource', '$injector']).concat(target.$inject /* istanbul ignore next */ || []);
            angular.module(moduleName).factory(className, resourceClassFactory);
        };
    }

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

    export interface IActionOptions extends angular.resource.IActionDescriptor {
        mapper?: (entry: any, ...dependencies) => any;
        mapperDependencies?: Array<string>;
    }

    var REMOVE_STARTING_$_REGEX = /^\$/;

    export function Action(options: IActionOptions): IMemberAnnotationDecorator {

        return (target: any, key: string): void => {

            if (!target.__resourceActions) {
                target.__resourceActions = {};
            }

            key = key.replace(REMOVE_STARTING_$_REGEX, '');

            target.__resourceActions[key] = options;
        }
    }

    function prepareActionDataMapping(actions, $injector) {

        var keys = Object.keys(actions);

        keys.forEach(key => {

            var action = actions[key];
            if (action.mapper) {
                if (action.transformResponse) {

                    throw new Error('Both "mapper" and "transformResponse" are not working on an action');
                }

                var dependencies = [];

                if (action.mapperDependencies) {
                    action.mapperDependencies.forEach(key => {
                        dependencies.push($injector.get(key));
                    });
                }

                action.transformResponse = data => {

                    return JSON.parse(data).map(entry =>
                        action.mapper.apply(null, [entry].concat(dependencies)));
                };
            }
        });

    }

    export function UseAsDefault(urlParamKey?: string): IMemberAnnotationDecorator {

        return (target: any, key: string): void => {

            if (!target.__defaultResourceParams) {
                target.__defaultResourceParams = {};
            }

            target.__defaultResourceParams[urlParamKey || key] = '@' + key;
        }
    }

    /* tslint:enable:no-any */

}
