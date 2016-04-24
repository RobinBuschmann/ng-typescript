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

    export function instantiate(module: ng.IModule, name: string, mode: string): IClassAnnotationDecorator;
    export function instantiate(moduleName: string, name: string, mode: string): IClassAnnotationDecorator;
    export function instantiate(any: any, name: string, mode: string): IClassAnnotationDecorator {
        return (target: any): void => {

            defineInjectNameMeta(name, target, mode);

            let module = angular.isObject(any) ? any : angular.module(any);

            module[mode](name, target);
        };
    }
}
