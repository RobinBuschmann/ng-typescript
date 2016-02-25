
module at {

    export function DelegateService(moduleName: string, serviceName: string): at.IClassAnnotationDecorator {
        return (target: any): void => {

            target.prototype.__delegateServiceName = serviceName;

            angular.module(moduleName).service(serviceName, target);
        };
    }
}
