
module at {

    export interface IServiceAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }

    export function Service(moduleName: string, serviceName: string): at.IClassAnnotationDecorator {
        return instantiate(moduleName, serviceName, 'service');
    }
}
