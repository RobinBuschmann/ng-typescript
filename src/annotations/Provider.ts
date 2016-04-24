
module at {

    export interface IProviderAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }

    export function Provider(module: ng.IModule, serviceName?: string): at.IClassAnnotationDecorator;
    export function Provider(moduleName: string, serviceName?: string): at.IClassAnnotationDecorator;
    export function Provider(any: any, serviceName?: string): at.IClassAnnotationDecorator {
        return instantiate(any, serviceName, 'provider');
    }
}
