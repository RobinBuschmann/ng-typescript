module at {

    import IModule = angular.IModule;

    export interface IComponentState {

        /**
         * Class that is decorated by @Component
         */
        component?: Function;

        /**
         * Class that is decorated by @IonView
         */
        ionView?: Function;

        /**
         * Name of the state
         */
        name?: string;

        parent?: string;

        views?: { [name: string]: IComponentState };

        resolve?: { [name: string]: any };
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
        onEnter?: Function|Array<string|Function>;
        /**
         * Callback functions for when a state is entered and exited. Good way to trigger an action or dispatch an event, such as opening a dialog.
         * If minifying your scripts, make sure to explicitly annotate this function, because it won't be automatically annotated by your build tools.
         */
        onExit?: Function|Array<string|Function>;
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

    export interface IRouteConfigOptions {
        stateConfigs: Array<IComponentState>,
        module: IModule,
        conditions?: Array<{when: string|any, then: string|Function}>,
        rules?: Array<Function>,
        otherwise?: string|Function,
        deferIntercept?: boolean
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
    export function RouteConfig(options: IRouteConfigOptions): at.IClassAnnotationDecorator {
        let _$interpolateProvider;

        return (target: Function) => {

            if (!options || !(options.stateConfigs && options.stateConfigs.length) || !options.module) {

                throw new Error('Options (stateConfigs, module) are missing for RouteConfig annotation');
            }

            options.module.config(['$stateProvider', '$interpolateProvider', '$urlRouterProvider',
                ($stateProvider, $interpolateProvider, $urlRouterProvider) => {

                    _$interpolateProvider = $interpolateProvider;
                    processUrlRouterProviderOptions($urlRouterProvider);

                    angular.forEach(options.stateConfigs, config => {

                        // process config for unnamed view
                        if ('component' in config || 'ionView' in config) {
                            processView(config);
                        }

                        // process configs for named views
                        if (config.views) {
                            for (let key in config.views) {
                                if (config.views.hasOwnProperty(key)) {
                                    processView(config.views[key]);
                                }
                            }
                        }
                        $stateProvider.state(config);
                    });
                }]);
        };

        /**
         * Resolves wrapped RouteConfig configuration to $stateProvider
         * state configurations for one view
         *
         * @param config
         */
        function processView(config) {

            if (config.component) {
                
                if (!config.component.__componentName) {
                    throw new Error('Value for component attribute has to be a with @Component decorated class');
                }

                let attributeMeta = config.component.prototype.__componentAttributes || [];

                checkToResolvedAttributes(attributeMeta, config.resolve);

                if (config.resolve) {

                    config.controller = getController(attributeMeta, config.resolve);
                }

                config.template = getTemplate(attributeMeta, config.component.__componentName, config.resolve);

            } else if (config.ionView) {

                if (!config.ionView.__ionView) {
                    throw new Error('Value for ionView attribute has to be a with @IonView decorated class');
                }

                config.controller = config.ionView;

                if (config.ionView.__ionView.template) {

                    config.template = config.ionView.__ionView.template;
                } else if (config.ionView.__ionView.templateUrl) {

                    config.templateUrl = config.ionView.__ionView.templateUrl;
                } else {

                    throw new Error('Either template or templateUrl has to be defined for ionView');
                }

            } else {

                throw new Error('View configuration needs either an ionView or component attribute');
            }
        }

        /**
         * Prepares the $urlRouterProvider configurations "when", "rule", "otherwise" and "deferIntercept"
         * @example
         *
         * from RouterConfig options:
         *    {
     *        conditions: [{when: '/', then: '/user'}],
     *        rules: [function rule1(){ .. }, function rule2() { .. }],
     *        otherwise: '/home',
     *        deferIntercept: true
     *    }
         * to $urlRouterProvider configuration:
         *
         *    $urlRouterProvider.when(conditions[0].when, conditions[0].then);
         *    $urlRouterProvider.rule(rules[0]);
         *    $urlRouterProvider.otherwise(otherwise);
         *    $urlRouterProvider.deferIntercept(deferIntercept);
         *
         *
         * @param $urlRouterProvider
         */
        function processUrlRouterProviderOptions($urlRouterProvider) {

            if (options.conditions) {
                angular.forEach(options.conditions, condition => $urlRouterProvider.when(condition.when, condition.then));
            }
            if (options.rules) {
                angular.forEach(options.rules, rule => $urlRouterProvider.rule(rule));
            }
            if (options.otherwise) {
                $urlRouterProvider.otherwise(options.otherwise);
            }
            if (options.deferIntercept !== void 0) {
                $urlRouterProvider.deferIntercept(options.deferIntercept);
            }
        }

        /**
         * The created controller is more or less a proxy, that
         * provides the required data (through ui-routers resolve)
         * for the component, that should be loaded for the
         * specified state
         *
         * @param attributeMeta
         * @param resolveObj
         * @return {string[]}
         */
        function getController(attributeMeta: Array<{name: string}>, resolveObj) {

            let resolvedMetaData = attributeMeta.filter(meta => {

                // Only prepare dependencies, that are defined
                // in resolveObj
                return !!resolveObj[meta.name];
            });

            let controller = function ($scope) {

                let resolvedValues = Array.prototype.slice.call(arguments, 1);

                resolvedMetaData.forEach((meta, index) =>
                    $scope[meta.name] = resolvedValues[index])
            };

            return (<any[]>['$scope']).concat(resolvedMetaData.map(meta => meta.name), controller)
        }

        /**
         * Throws error, if there is no resolve configuration for
         * required attributes
         *
         * @param attributeMeta
         * @param resolveObj
         */
        function checkToResolvedAttributes(attributeMeta, resolveObj = {}) {

            angular.forEach(attributeMeta, meta => {

                if (!resolveObj[meta.name] && !meta.isOptional) {

                    throw new Error(`There is no resolve object for "${meta.name}" attribute defined`);
                }
            });
        }

        /**
         * Creates template string for specified component
         *
         * @example
         *
         * <spinner delay="{{}}"></spinner>
         *
         * @param attributeMeta
         * @param componentName
         * @param resolveObj
         * @return {string} Template
         */
        function getTemplate(attributeMeta, componentName, resolveObj?) {
            let templateAttrs = '';
            let endSymbol = _$interpolateProvider.endSymbol();
            let startSymbol = _$interpolateProvider.startSymbol();
            let dashedSelector = toDash(componentName);
            const SIMPLE_STRING_BINDING = '@';
            const LISTENER_BINDING = '&';

            // It is only necessary to add attributes if there are resolved
            // in the templates scope
            if (resolveObj) {

                angular.forEach(attributeMeta, meta => {

                    // It is only necessary to add attributes to the component
                    // that are defined in resolveObj
                    if (resolveObj[meta.name]) {

                        let value;

                        switch (meta.binding) {
                            case SIMPLE_STRING_BINDING:
                                value = (startSymbol + meta.name + endSymbol);
                                break;
                            case LISTENER_BINDING:
                                value = `${meta.name}(${meta.eventParamNames ? meta.eventParamNames.join(',') : ''})`;
                                break;
                            default:
                                value = meta.name;
                        }

                        templateAttrs += `${toDash(meta.name)}="${value}" `;
                    }

                });
            }

            return `<${dashedSelector} ${templateAttrs}></${dashedSelector}>`;
        }

        /**
         * Converts camelcase to dashed case
         *
         * @example
         *    "thatIsGreat" > "that-is-great"
         *
         * @param str
         * @return {any}
         */
        function toDash(str) {
            return str.replace(/([A-Z])/g, function ($1) {
                return "-" + $1.toLowerCase();
            });
        }
    }
}
