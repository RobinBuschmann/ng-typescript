
module at {

    export interface IProviderAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }

    export function Provider(moduleName: string, serviceName: string): at.IClassAnnotationDecorator {
        return instantiate(moduleName, serviceName, 'provider');
    }
}
