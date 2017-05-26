import * as angular from "angular";
import {IRouteConfigOptions} from "../interfaces/IRouteConfigOptions";
import {COMPONENT_ATTR_KEY, COMPONENT_KEY, VIEW_KEY} from "../ng-typescript";

/**
 * This is a configuration wrapper for the ui-router.
 * It makes it possible to define states, configured
 * with components instead of views and controllers.
 */
export function RouteConfig(options: IRouteConfigOptions): ClassDecorator {
    let _$interpolateProvider;

    return () => {

        if (!options || !(options.stateConfigs && options.stateConfigs.length) || !options.module) {

            throw new Error('Options (stateConfigs, module) are missing for RouteConfig annotation');
        }

        options.module.config(['$stateProvider', '$interpolateProvider', '$urlRouterProvider', '$injector',
            ($stateProvider, $interpolateProvider, $urlRouterProvider, $injector) => {

                _$interpolateProvider = $interpolateProvider;
                processUrlRouterProviderOptions($urlRouterProvider);
                if (options.invokable) $injector.invoke(options.invokable);

                angular.forEach(options.stateConfigs, config => {

                    // process config for unnamed view
                    if ('component' in config || 'view' in config) {
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

            let componentMeta = Reflect.getMetadata(COMPONENT_KEY, config.component);

            if (!componentMeta.name) {
                throw new Error('Value for component attribute has to be a with @Component decorated class');
            }

            let attributeMeta = Reflect.getMetadata(COMPONENT_ATTR_KEY, config.component) || [];

            checkToResolvedAttributes(attributeMeta, config.resolve);

            if (config.resolve) {

                config.controller = getController(attributeMeta, config.resolve);
            }

            config.template = getTemplate(attributeMeta, componentMeta.name, config.resolve);

        } else if (config.view) {

            let viewMeta = Reflect.getMetadata(VIEW_KEY, config.view);

            if (!viewMeta) {
                throw new Error('Value for view attribute has to be a with @View decorated class');
            }

            let viewConfig = viewMeta;

            for (let key in viewConfig) {
                if (viewConfig.hasOwnProperty(key)) {
                    config[key] = viewConfig[key];
                }
            }
        } else {

            throw new Error('View configuration needs either an view or component attribute');
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
    function getController(attributeMeta: Array<{ name: string }>, resolveObj) {

        const resolvedMetaData = attributeMeta.filter(meta => {

            // Only prepare dependencies, that are defined
            // in resolveObj
            return !!resolveObj[meta.name];
        });

        const controller = function($scope) {

            let resolvedValues = Array.prototype.slice.call(arguments, 1);

            resolvedMetaData.forEach((meta, index) =>
                $scope[meta.name] = resolvedValues[index])
        };

        return (['$scope'] as any[]).concat(resolvedMetaData.map(meta => meta.name), controller)
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
        return str.replace(/([A-Z])/g, function($1) {
            return "-" + $1.toLowerCase();
        });
    }
}
