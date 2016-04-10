module at {

    import IModule = angular.IModule;

    export interface IViewOptions {
        templateUrl?: string;
        template?: string;
    }

    /**
     * Stores meta data for configuring a view for ui.router
     *
     * @param options
     * @return {function(Function): void}
     * @annotation
     */
    export function View(options: IViewOptions): at.IClassAnnotationDecorator {
        return (target: Function) => {

            target['__view'] = options;
        }
    }
}
