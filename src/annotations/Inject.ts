module at {

    export interface IInjectAnnotation {
        (...args: any[]): IClassAnnotationDecorator;
    }

    export function Inject(...args: Array<string|Function>): at.IClassAnnotationDecorator {
        return (target: any, key?: string, index?: any): void => {

            args = retrieveInjectNames(args);

            if (angular.isNumber(index)) {
                target.$inject = target.$inject || [];
                target.$inject[index] = args[0];
            } else {
                target.$inject = args;
            }
        };
    }
}
