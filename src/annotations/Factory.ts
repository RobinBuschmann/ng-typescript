
module at {
    
    export function Factory(module: ng.IModule, serviceName?: string): at.IClassAnnotationDecorator;
    export function Factory(moduleName: string, serviceName?: string): at.IClassAnnotationDecorator;
    export function Factory(any: any, serviceName?: string): at.IClassAnnotationDecorator {
        return process(any, serviceName, 'factory');
    }
}
