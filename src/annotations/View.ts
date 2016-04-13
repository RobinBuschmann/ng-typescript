module at {

    import IModule = angular.IModule;

    export interface IViewOptions {
        templateUrl?: string;
        template?: string;
        controllerAs?: string;
    }
    
    interface IViewMeta extends IViewOptions {
        controller?: Function;
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
            
            let viewMeta: IViewMeta = options;

            if(!viewMeta.controllerAs) viewMeta.controllerAs = 'vm';
            viewMeta.controller = target;
            
            Reflect.defineMetadata('view', viewMeta, target);
        }
    }
}
