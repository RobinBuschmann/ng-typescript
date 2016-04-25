module at {

    export function ClassFactory(module: ng.IModule, className?: string): at.IClassAnnotationDecorator;
    export function ClassFactory(moduleName: string, className?: string): at.IClassAnnotationDecorator;
    export function ClassFactory(any: any, className?: string): at.IClassAnnotationDecorator {
        return (target: any): void => {
            function factory(...args: any[]): any {
                return at.AttachInjects(target, ...args);
            }

            /* istanbul ignore else */
            if (target.$inject && target.$inject.length > 0) {
                factory.$inject = target.$inject.slice(0);
            }
            
            let module = angular.isObject(any) ? any : angular.module(any);

            // generate inject name if necessary
            className = className || createIdentifier(module.name);

            // store inject name via reflect-metadata
            // to target, not factory
            Reflect.defineMetadata('injectName', className, target);
            
            module.factory(className, factory)
        };
    }
}
