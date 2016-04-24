
module at {

    export interface IFactoryAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }

    export function Factory(module: ng.IModule, serviceName: string): at.IClassAnnotationDecorator;
    export function Factory(moduleName: string, serviceName: string): at.IClassAnnotationDecorator;
    export function Factory(any: any, serviceName: string): at.IClassAnnotationDecorator {
        return instantiate(any, serviceName, 'factory');
    }
}
