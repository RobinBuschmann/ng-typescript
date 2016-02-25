
module at {

    export interface IControllerAnnotation {
        (moduleName: string, ctrlName: string): IClassAnnotationDecorator;
    }

    export function Controller(moduleName: string, ctrlName: string): at.IClassAnnotationDecorator {
        return instantiate(moduleName, ctrlName, 'controller');
    }
}
