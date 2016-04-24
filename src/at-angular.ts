// Support AMD require
// and SystemJS import
declare module 'at' {
    export = at;
}

module at {

    'use strict';

    /* tslint:disable:no-any */
    export interface IClassAnnotationDecorator {
        (target: any): void;
        (t: any, key: string, index: number): void;
    }

    /* tslint:disable:no-any */
    export interface IMemberAnnotationDecorator {
        (target: any, key: string): void;
    }

    export function retrieveInjectNames(values: Array<string|Function>) {

        return values.map(value => angular.isString(value) ? value : Reflect.getMetadata('injectName', value));
    }

    export function invokable(...dependencies: Array<string|Function>) {

        let fn = dependencies.pop();

        return retrieveInjectNames(dependencies).concat(fn);
    }

    export function defineInjectNameMeta(injectName, target, mode) {

        Reflect.defineMetadata('injectName', mode === 'provider' ? injectName + 'Provider' : injectName, target);
    }
    
    // This should prevent collision with other external modules,
    // which also uses the angular-typescript module
    // (initially created by http://stackoverflow.com/a/8084248/931502
    // and advanced by http://stackoverflow.com/users/1704773/luke)
    const APP_KEY = Math.random().toString(36).substr(2, 8);
    let count = 1; // the counter prevents internal collisions
    function getIdentifier(moduleName) {
        return moduleName + APP_KEY + (count++);
    }

    export function instantiate(module: ng.IModule, name: string, mode: string): IClassAnnotationDecorator;
    export function instantiate(moduleName: string, name: string, mode: string): IClassAnnotationDecorator;
    export function instantiate(any: any, name: string, mode: string): IClassAnnotationDecorator {
        return (target: any): void => {

            let module = angular.isObject(any) ? any : angular.module(any);
            
            // generate inject name if necessary
            name = name || getIdentifier(module.name);
            
            // store inject name via reflect-metadata
            defineInjectNameMeta(name, target, mode);
            
            module[mode](name, target);
        };
    }
}
