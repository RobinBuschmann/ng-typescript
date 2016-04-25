
module at {
    
    export function Provider(module: ng.IModule, serviceName?: string): at.IClassAnnotationDecorator;
    export function Provider(module: ng.IModule, providedServiceClass?: Function): at.IClassAnnotationDecorator;
    export function Provider(moduleName: string, serviceName?: string): at.IClassAnnotationDecorator;
    export function Provider(moduleName: string, providedServiceClass?: Function): at.IClassAnnotationDecorator;
    export function Provider(any: any, service?: any): at.IClassAnnotationDecorator {
        return process(
            any, 
            angular.isString(service) ? service : void 0, 
            'provider',
            angular.isFunction(service) ? service : void 0
        );
    }
}
