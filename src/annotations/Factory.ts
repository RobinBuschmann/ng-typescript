import {process} from "../ng-typescript";

export function Factory(module: ng.IModule, serviceName?: string): ClassDecorator;
export function Factory(moduleName: string, serviceName?: string): ClassDecorator;
export function Factory(any: any, serviceName?: string): ClassDecorator {

    return process(any, serviceName, 'factory');
}
