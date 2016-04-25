
module at {
    
    export function Service(module: ng.IModule, serviceName?: string): at.IClassAnnotationDecorator;
    export function Service(moduleName: string, serviceName?: string): at.IClassAnnotationDecorator;
    export function Service(any: any, serviceName?: string): at.IClassAnnotationDecorator {
        return process(any, serviceName, 'service');
    }
}
