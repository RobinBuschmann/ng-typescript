
module at {

    export function Controller(module: ng.IModule, ctrlName?: string): at.IClassAnnotationDecorator;
    export function Controller(moduleName: string, ctrlName?: string): at.IClassAnnotationDecorator;
    export function Controller(any: any, ctrlName?: string): at.IClassAnnotationDecorator {
        return process(any, ctrlName, 'controller');
    }
}
