
module at {
    
    export function Config(module: ng.IModule, inlineAnnotatedFunction: any[]): at.IClassAnnotationDecorator;
    export function Config(moduleName: string, inlineAnnotatedFunction: any[]): at.IClassAnnotationDecorator;
    export function Config(any: any, inlineAnnotatedFunction: any[]): at.IClassAnnotationDecorator {
        
        return function (target: any) {

            let module = angular.isObject(any) ? any : angular.module(any);

            inlineAnnotatedFunction = invokable.apply(invokable, inlineAnnotatedFunction);
            
            module.config(inlineAnnotatedFunction);
        }
    }
}
