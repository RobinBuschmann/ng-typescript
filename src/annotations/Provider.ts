import * as angular from 'angular';
import {process} from "../ng-typescript";

export function Provider(module: ng.IModule, serviceName?: string): ClassDecorator;
export function Provider(module: ng.IModule, providedServiceClass?: Function): ClassDecorator;
export function Provider(moduleName: string, serviceName?: string): ClassDecorator;
export function Provider(moduleName: string, providedServiceClass?: Function): ClassDecorator;
export function Provider(any: any, service?: any): ClassDecorator {
    return process(
        any,
        angular.isString(service) ? service : void 0,
        'provider',
        angular.isFunction(service) ? service : void 0
    );
}
