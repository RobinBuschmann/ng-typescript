module at {

    import IModule = angular.IModule;
    
    export interface IViewOptions {
        templateUrl?: string;
        template?: string;
    }
    
    /**
     * Stores meta data for configuring a ionic view for 
     * ui.router through RouteConfig;
     * Ionic framework is required.
     *
     * @param options
     * @return {function(Function): void}
     * @annotation
     */
    export function IonView(options: IViewOptions): at.IClassAnnotationDecorator {
        return (target: Function) => {

            target['__ionView'] = options;
        }
    }
}
