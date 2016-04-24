
module at {

    export interface IServiceAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }

    export function Service(module: ng.IModule, serviceName: string): at.IClassAnnotationDecorator;
    export function Service(moduleName: string, serviceName: string): at.IClassAnnotationDecorator;
    export function Service(any: any, serviceName: string): at.IClassAnnotationDecorator {
        return instantiate(any, serviceName, 'service');
    }
}
