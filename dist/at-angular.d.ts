/// <reference path="../typings/tsd.d.ts" />
declare module 'at' {
    export = at;
}
declare module at {
    interface IClassAnnotationDecorator {
        (target: any): void;
        (t: any, key: string, index: number): void;
    }
    interface IMemberAnnotationDecorator {
        (target: any, key: string): void;
    }
    function instantiate(moduleName: string, name: string, mode: string): IClassAnnotationDecorator;
}
declare module at {
    function AttachInjects(target: any, ...args: any[]): any;
}
declare module at {
    interface IAttributeOptions {
        binding?: string;
        name?: string;
        isOptional?: boolean;
    }
    function Attribute(options?: IAttributeOptions): IMemberAnnotationDecorator;
}
declare module at {
    interface IClassFactoryAnnotation {
        (moduleName: string, className: string): IClassAnnotationDecorator;
    }
    function ClassFactory(moduleName: string, className: string): at.IClassAnnotationDecorator;
}
declare module at {
    import IModule = angular.IModule;
    interface IComponentOptions {
        componentName: string;
        templateUrl?: string;
        template?: string;
        controllerAs?: string;
        moduleName?: string;
        module?: IModule;
    }
    interface IPreLink {
        onPreLink: (element?: JQuery) => void;
    }
    interface IPostLink {
        onPostLink: (element?: JQuery) => void;
    }
    interface IDestroy {
        onDestroy: (element?: JQuery) => void;
    }
    function Component(options: IComponentOptions): at.IClassAnnotationDecorator;
}
declare module at {
    interface IControllerAnnotation {
        (moduleName: string, ctrlName: string): IClassAnnotationDecorator;
    }
    function Controller(moduleName: string, ctrlName: string): at.IClassAnnotationDecorator;
}
declare module at {
    interface IDirectiveAnnotation {
        (moduleName: string, directiveName: string): IClassAnnotationDecorator;
    }
    function Directive(moduleName: string, directiveName: string): at.IClassAnnotationDecorator;
}
declare module at {
    interface IFactoryAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }
    function Factory(moduleName: string, serviceName: string): at.IClassAnnotationDecorator;
}
declare module at {
    interface IInjectAnnotation {
        (...args: any[]): IClassAnnotationDecorator;
    }
    function Inject(...args: string[]): at.IClassAnnotationDecorator;
}
declare module at {
    interface IListenerAttributeOptions {
        /**
         * @description Array of strings, which describes the parameters
         *              that should be added to the event listener
         * @example
         *
         *          In component class:
         *
         *          @ListenerAttribute({eventParamNames: ['$someObj']})
         *
         *          In html:
         *
         *          <some-component on-completed="onCompleted($someObj)"></some-component>
         */
        eventParamNames?: Array<string>;
        name?: string;
    }
    function ListenerAttribute(options?: IListenerAttributeOptions): IMemberAnnotationDecorator;
}
declare module at {
    interface IProviderAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }
    function Provider(moduleName: string, serviceName: string): at.IClassAnnotationDecorator;
}
declare module at {
    import IResourceArray = angular.resource.IResourceArray;
    class ResourceClass<T> implements angular.resource.IResource<T> {
        $promise: angular.IPromise<T>;
        private $promiseArray;
        $resolved: boolean;
        constructor(model?: any);
        $get: () => angular.IPromise<T>;
        $query: () => angular.IPromise<IResourceArray<T>>;
        $save: () => angular.IPromise<T>;
        $remove: () => angular.IPromise<T>;
        $delete: () => angular.IPromise<T>;
        toJSON: () => {
            [index: string]: any;
        };
    }
    interface IResourceAnnotation {
        (moduleName: string, className: string): IClassAnnotationDecorator;
    }
    function Resource(moduleName: string, className: string, url: string, options?: any): IClassAnnotationDecorator;
    interface IActionOptions extends angular.resource.IActionDescriptor {
        mapper?: (entry: any, ...dependencies) => any;
        mapperDependencies?: Array<string>;
    }
    function Action(options: IActionOptions): IMemberAnnotationDecorator;
    function UseAsDefault(urlParamKey?: string): IMemberAnnotationDecorator;
}
declare module at {
    import IModule = angular.IModule;
    interface IComponentState {
        /**
         * Class that is decorated by @at.Component
         */
        component?: Function;
        /**
         * Name of the state
         */
        name?: string;
        parent?: string;
        views?: {
            [name: string]: IComponentState;
        };
        resolve?: {
            [name: string]: any;
        };
        /**
         * A url with optional parameters. When a state is navigated or transitioned to, the $stateParams service will be populated with any parameters that were passed.
         */
        url?: string;
        /**
         * A map which optionally configures parameters declared in the url, or defines additional non-url parameters. Only use this within a state if you are not using url. Otherwise you can specify your parameters within the url. When a state is navigated or transitioned to, the $stateParams service will be populated with any parameters that were passed.
         */
        params?: any;
        /**
         * Use the views property to set up multiple views. If you don't need multiple views within a single state this property is not needed. Tip: remember that often nested views are more useful and powerful than multiple sibling views.
         */
        abstract?: boolean;
        /**
         * Callback function for when a state is entered. Good way to trigger an action or dispatch an event, such as opening a dialog.
         * If minifying your scripts, make sure to explicitly annotate this function, because it won't be automatically annotated by your build tools.
         */
        onEnter?: Function | Array<string | Function>;
        /**
         * Callback functions for when a state is entered and exited. Good way to trigger an action or dispatch an event, such as opening a dialog.
         * If minifying your scripts, make sure to explicitly annotate this function, because it won't be automatically annotated by your build tools.
         */
        onExit?: Function | Array<string | Function>;
        /**
         * Arbitrary data object, useful for custom configuration.
         */
        data?: any;
        /**
         * Boolean (default true). If false will not re-trigger the same state just because a search/query parameter has changed. Useful for when you'd like to modify $location.search() without triggering a reload.
         */
        reloadOnSearch?: boolean;
        /**
         * Boolean (default true). If false will reload state on everytransitions. Useful for when you'd like to restore all data  to its initial state.
         */
        cache?: boolean;
    }
    interface IRouteConfigOptions {
        stateConfigs: Array<IComponentState>;
        module: IModule;
        conditions?: Array<{
            when: string | any;
            then: string | Function;
        }>;
        rules?: Array<Function>;
        otherwise?: string | Function;
        deferIntercept?: boolean;
    }
    function RouteConfig(options: IRouteConfigOptions): at.IClassAnnotationDecorator;
}
declare module at {
    interface IServiceAnnotation {
        (moduleName: string, serviceName: string): IClassAnnotationDecorator;
    }
    function Service(moduleName: string, serviceName: string): at.IClassAnnotationDecorator;
}
