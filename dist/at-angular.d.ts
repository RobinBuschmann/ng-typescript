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
    /**
     * Retrieves injectNames from specified classes,
     * to generate an array, which only consists of
     * inject names
     *
     * @param values
     * @return {string|Function|any[]}
     */
    function retrieveInjectNames(values: Array<string | Function>): any[];
    /**
     * A helper method to generate an annotated function
     * in the old angular way. This accepts beside strings
     * annotated classes.
     *
     *
     * @param dependencies
     * @return {string|Function[]|string|Function|any[]}
     */
    function invokable(...dependencies: Array<string | Function>): any[];
    /**
     * This generates an identifier for any app component
     * (services, providers, factories, controllers).
     * To ensure, that each component gets an unique
     * identifier, an autoincrement numerical value
     * is used. To prevent collision with external
     * modules, the identifier consists of the components
     * module name, which already has to be unique
     * regarding other modules.
     *
     * @param moduleName
     * @return {string}
     */
    const createIdentifier: (moduleName: any) => string;
    /**
     * Processes annotations for services, providers, factories and controllers.
     * Stores meta data for injectName for each class and initializes each
     * component with specified module.
     *
     * @param any
     * @param name
     * @param mode
     * @param providedServiceClass
     * @param create
     * @return {function(any): void}
     */
    function process(any: any, name: string, mode: string, providedServiceClass?: Function, create?: boolean): IClassAnnotationDecorator;
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
    /**
     * Prepares attributes for component directives.
     *
     * @param options
     * @return {function(any, string): void}
     * @annotation
       */
    function Attribute(options?: IAttributeOptions): IMemberAnnotationDecorator;
}
declare module at {
    function ClassFactory(module: ng.IModule, className?: string): at.IClassAnnotationDecorator;
    function ClassFactory(moduleName: string, className?: string): at.IClassAnnotationDecorator;
}
declare module at {
    import IModule = angular.IModule;
    interface IComponentOptions {
        componentName: string;
        templateUrl?: string;
        template?: string;
        transclude?: boolean;
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
    /**
     * Creates an angular directive in component style
     *
     * @param options
     * @return {function(Function): void}
     * @annotation
     */
    function Component(options: IComponentOptions): at.IClassAnnotationDecorator;
}
declare module at {
    function Controller(module: ng.IModule, ctrlName?: string): at.IClassAnnotationDecorator;
    function Controller(moduleName: string, ctrlName?: string): at.IClassAnnotationDecorator;
}
declare module at {
    interface IDirectiveAnnotation {
        (moduleName: string, directiveName: string): IClassAnnotationDecorator;
    }
    function Directive(module: ng.IModule, directiveName: string): at.IClassAnnotationDecorator;
    function Directive(moduleName: string, directiveName: string): at.IClassAnnotationDecorator;
}
declare module at {
    function Factory(module: ng.IModule, serviceName?: string): at.IClassAnnotationDecorator;
    function Factory(moduleName: string, serviceName?: string): at.IClassAnnotationDecorator;
}
declare module at {
    interface IInjectAnnotation {
        (...args: any[]): IClassAnnotationDecorator;
    }
    function Inject(...args: Array<string | Function>): at.IClassAnnotationDecorator;
}
declare module at {
    interface IInputOptions {
        name?: string;
        isOptional?: boolean;
    }
    /**
     * Prepares input attribute for component directives.
     *
     * @param options
     * @return {function(any, string): void}
     * @annotation
       */
    function Input(options?: IInputOptions): IMemberAnnotationDecorator;
}
declare module at {
    interface IOutputOptions {
        /**
         * @description Array of strings, which describes the parameters
         *              that should be added to the event listener, if
         *              the output component is used for resolve in
         *              RouteConfig.
         * @example
         *
         *          In component class:
         *
         *          @Output({eventParamNames: ['$someObj']})
         *
         *          In html:
         *
         *          <some-component on-completed="onCompleted($someObj)"></some-component>
         */
        eventParamNames?: Array<string>;
        name?: string;
    }
    /**
     * Prepares output attributes for component directives.
     * The consumer of the corresponding component can pass
     * event listeners to this attribute. This attribute is
     * defined for a specified action. Every time this action
     * occurs, the event listener will be executed.
     *
     * @param options
     * @return {IMemberAnnotationDecorator}
     * @annotation
       */
    function Output(options?: IOutputOptions): IMemberAnnotationDecorator;
}
declare module at {
    function ProvidedService(module: ng.IModule, serviceName?: string): at.IClassAnnotationDecorator;
    function ProvidedService(moduleName: string, serviceName?: string): at.IClassAnnotationDecorator;
}
declare module at {
    function Provider(module: ng.IModule, serviceName?: string): at.IClassAnnotationDecorator;
    function Provider(module: ng.IModule, providedServiceClass?: Function): at.IClassAnnotationDecorator;
    function Provider(moduleName: string, serviceName?: string): at.IClassAnnotationDecorator;
    function Provider(moduleName: string, providedServiceClass?: Function): at.IClassAnnotationDecorator;
}
declare module at {
    /**
     * Processes required controller for components property.
     * Property is initialized with controller instance
     * of required component or directive through preLink.
     *
     * @param option Name of component or directive with require specification (^, ^^)
     * @return {function(any, string): void}
     * @constructor
       */
    function RequiredCtrl(option: string): IMemberAnnotationDecorator;
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
         * Class that is decorated by @Component
         */
        component?: Function;
        /**
         * Class that is decorated by @View
         */
        view?: Function;
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
        invokable?: Function | Array<string | Function>;
        deferIntercept?: boolean;
    }
    /**
     * This is a configuration wrapper for the ui-router.
     * It makes it possible to define states, configured
     * with components instead of views and controllers.
     *
     * @param options
     * @return {function(Function): void}
     * @annotation
     */
    function RouteConfig(options: IRouteConfigOptions): at.IClassAnnotationDecorator;
}
declare module at {
    function Service(module: ng.IModule, serviceName?: string): at.IClassAnnotationDecorator;
    function Service(moduleName: string, serviceName?: string): at.IClassAnnotationDecorator;
}
declare module at {
    interface IViewOptions {
        templateUrl?: string;
        template?: string;
        controllerAs?: string;
    }
    /**
     * Stores meta data for configuring a view for ui.router
     *
     * @param options
     * @return {function(Function): void}
     * @annotation
     */
    function View(options: IViewOptions): at.IClassAnnotationDecorator;
}
