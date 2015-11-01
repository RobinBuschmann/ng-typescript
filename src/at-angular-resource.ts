///<reference path="../typings/angularjs/angular.d.ts"/>
///<reference path="../typings/angularjs/angular-resource.d.ts"/>
///<reference path="at-angular.ts"/>


/* istanbul ignore next */

module at {

    import IResourceArray = angular.resource.IResourceArray;
    'use strict';

    /* tslint:disable:no-any */
    type ResourceClass = angular.resource.IResourceClass<any>;
    type ResourceService = angular.resource.IResourceService;

    /* istanbul ignore next */
    function combineResource(instance: any, model?: any): void {
        angular.extend(instance, instance.$_Resource(model));
    }

    /* istanbul ignore next */
    export class Resource<T> implements angular.resource.IResource<T> {
        public $promise : angular.IPromise<T>;
        private $promiseArray : angular.IPromise<IResourceArray<T>>;
        public $resolved : boolean;
        constructor(model?: any) { combineResource(this, model); }
        public $get(params?: Object): angular.IPromise<T> { return this.$promise; }
        public $query(params?: Object): angular.IPromise<IResourceArray<T>> { return this.$promiseArray; }
        public $remove(params?: Object): angular.IPromise<T> { return this.$promise; }
        public $save(params?: Object): angular.IPromise<T> { return this.$promise; }
        public $delete(params?: Object): angular.IPromise<T> { return this.$promise; }
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

    export function resource(moduleName: string, className: string, url: string, options?: any): IClassAnnotationDecorator {
        return (target: any): void => {
            function resourceClassFactory($resource: ResourceService, ...args: any[]): any {
                const newResource: ResourceClass = $resource(url, target.params, target.prototype.__rActions, options);
                return attachInjects(angular.extend(newResource, angular.extend(target, newResource, {
                    prototype: angular.extend(newResource.prototype, angular.extend(target.prototype, {
                        /* tslint:disable:variable-name */
                        $_Resource: newResource
                        /* tslint:enable:variable-name */
                    }))
                })), ...args);
            }

            resourceClassFactory.$inject = (['$resource']).concat(target.$inject /* istanbul ignore next */ || []);
            angular.module(moduleName).factory(className, resourceClassFactory);
        };
    }

    export function action(options: angular.resource.IActionDescriptor): IMemberAnnotationDecorator {

        return (target: any, key: string): void => {

            if(!target.__rActions) {
                target.__rActions = {};
            }
            target.__rActions[key] = options;
        }
    }

    /* tslint:enable:no-any */

}
