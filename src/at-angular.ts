///<reference path="../typings/tsd.d.ts"/>

// Support AMD require
// and SystemJS import
declare module 'at' {
    export = at;
}

module at {

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
            config = directiveProperties.reduce((
                config: angular.IDirective,
                property: string
            ) => {
                return angular.isDefined(target[property]) ? angular.extend(config, {[property]: target[property]}) :
                    config; /* istanbul ignore next */
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
        moduleName: string;
        componentName: string;
    }

    var componentDefaultOptions = {
        restrict: 'E',
        controllerAs: 'ctrl',
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

            config.controller = target;

            // attributes and there requirements are defined in
            // the "attribute" annotation
            config.scope = target.prototype.__componentAttributes || {};

            if(target.prototype.onPreLink || target.prototype.onPostLink) {

                let link: {pre?: Function; post?: Function} = {};

                if(target.prototype.onPreLink) {
                    link.pre = (scope, element, attrs, ctrl) => {
                        if (ctrl.onPreLink) ctrl.onPreLink(element);
                    }
                }
                if(target.prototype.onPostLink) {
                    link.post = (scope, element, attrs, ctrl) => {
                        if (ctrl.onPostLink) ctrl.onPostLink(element);
                    }
                }

                (<any>config).compile = () => link;
            }

            angular.module(config.moduleName)
                .directive(config.componentName, () => config);
        }
    }

    export interface IAttributeOptions {
        binding?: string;
        name?: string;
    }

    var bindings = {
        'function': '@',
        'default': '='
    };

    export function Attribute(options: IAttributeOptions = {}): IMemberAnnotationDecorator {

        return (target: any, key: string) => {

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
        public $promise : angular.IPromise<T>;
        private $promiseArray : angular.IPromise<IResourceArray<T>>;
        public $resolved : boolean;
        constructor(model?: any) { combineResource(this, model); }

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

                if(target.prototype.__resourceActions) prepareActionDataMapping(target.prototype.__resourceActions, $injector);

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

        for(var key in src) {
            if(!dist[key]) {
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

            if(!target.__resourceActions) {
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
            if(action.mapper) {
                if(action.transformResponse) {

                    throw new Error('Both "mapper" and "transformResponse" are not working on an action');
                }

                var dependencies = [];

                if(action.mapperDependencies) {
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

            if(!target.__defaultResourceParams) {
                target.__defaultResourceParams = {};
            }

            target.__defaultResourceParams[urlParamKey || key] = '@' + key;
        }
    }
    /* tslint:enable:no-any */

}
