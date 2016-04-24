module at {

    export interface IClassFactoryAnnotation {
        (moduleName: string, className: string): IClassAnnotationDecorator;
    }

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

            instantiate(any, className, 'factory')(factory);
        };
    }
}
