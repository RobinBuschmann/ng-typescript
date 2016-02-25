
module at {

    export interface IFactoryAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }

    export function Factory(moduleName: string, serviceName: string): at.IClassAnnotationDecorator {
        return instantiate(moduleName, serviceName, 'factory');
    }
}
