
module at {

    export interface IControllerAnnotation {
        (moduleName: string, ctrlName: string): IClassAnnotationDecorator;
    }

    export function Controller(module: ng.IModule, ctrlName?: string): at.IClassAnnotationDecorator;
    export function Controller(moduleName: string, ctrlName?: string): at.IClassAnnotationDecorator;
    export function Controller(any: any, ctrlName?: string): at.IClassAnnotationDecorator {
        return instantiate(any, ctrlName, 'controller');
    }
}
