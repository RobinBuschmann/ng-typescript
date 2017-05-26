import * as angular from 'angular';
import {createIdentifier, INJECT_NAME_KEY, INLINE_INJECTS} from "../ng-typescript";

export function ClassFactory(module: ng.IModule, className?: string): ClassDecorator;
export function ClassFactory(moduleName: string, className?: string): ClassDecorator;
export function ClassFactory(any: any, className?: string): ClassDecorator {

    return (target: any): void => {

        const inlineInjects = Reflect.getMetadata(INLINE_INJECTS, target.prototype) || [];

        factory.$inject = inlineInjects.map(({injectName}) => injectName);

        function factory(...args: any[]): any {

            inlineInjects.forEach(({key}, index) => target.prototype[key] = args[index]);

            return target;
        }

        const module = angular.isObject(any) ? any : angular.module(any);

        // generate inject name if necessary
        className = className || createIdentifier(module.name);

        // store inject name via reflect-metadata
        Reflect.defineMetadata(INJECT_NAME_KEY, className, target);

        module.factory(className, factory)
    };
}
