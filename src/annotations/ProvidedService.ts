
module at {

    export function ProvidedService(module: ng.IModule, serviceName?: string): at.IClassAnnotationDecorator;
    export function ProvidedService(moduleName: string, serviceName?: string): at.IClassAnnotationDecorator;
    export function ProvidedService(any: any, serviceName?: string): at.IClassAnnotationDecorator {
        
        return process(any, serviceName, 'service', void 0, false);
    }
}
