import {process} from "../ng-typescript";

export function Service(module: ng.IModule, serviceName?: string): ClassDecorator;
export function Service(moduleName: string, serviceName?: string): ClassDecorator;
export function Service(any: any, serviceName?: string): ClassDecorator {
    return process(any, serviceName, 'service');
}
