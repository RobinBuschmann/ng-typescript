import {process} from "../ng-typescript";

export function ProvidedService(module: ng.IModule, serviceName?: string): ClassDecorator;
export function ProvidedService(moduleName: string, serviceName?: string): ClassDecorator;
export function ProvidedService(any: any, serviceName?: string): ClassDecorator {

    return process(any, serviceName, 'service', void 0, false);
}
