
module at {

    const directiveProperties: string[] = [
        'compile',
        'controller',
        'controllerAs',
        'bindToController',
        'link',
        'priority',
        'replace',
        'require',
        'restrict',
        'scope',
        'template',
        'templateUrl',
        'terminal',
        'transclude'
    ];

    export interface IDirectiveAnnotation {
        (moduleName: string, directiveName: string): IClassAnnotationDecorator;
    }

    export function Directive(moduleName: string, directiveName: string): at.IClassAnnotationDecorator {
        return (target: any): void => {
            let config: angular.IDirective;
            const ctrlName: string = angular.isString(target.controller) ? target.controller.split(' ').shift() : null;
            /* istanbul ignore else */
            if (ctrlName) {
                Controller(moduleName, ctrlName)(target);
            }
            config = directiveProperties.reduce((config: angular.IDirective,
                                                 property: string) => {
                return angular.isDefined(target[property]) ? angular.extend(config, {[property]: target[property]}) :
                    config;
                /* istanbul ignore next */
            }, {controller: target, scope: Boolean(target.templateUrl)});

            angular.module(moduleName).directive(directiveName, () => (config));
        };
    }
}
