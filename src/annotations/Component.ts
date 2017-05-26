import * as angular from 'angular';
import {IComponentOptions} from "../interfaces/IComponentOptions";
import {IComponentDirective} from "../interfaces/IComponentDirective";
import {COMPONENT_ATTR_KEY, COMPONENT_CTRL_KEY, COMPONENT_KEY} from "../ng-typescript";

const componentDefaultOptions = {
    restrict: 'E',
    controllerAs: '$ctrl',
    transclude: false,
    controller: null
};

const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

/**
 * Converts snake_case to camelCase.
 * Also there is special case for Moz prefix starting with upper case letter.
 * @param name Name to normalize
 */
function camelCase(name) {
    return name.
    replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    }).
    replace(MOZ_HACK_REGEXP, 'Moz$1');
}

/**
 * Creates an angular directive in component style
 *
 * @param options
 * @return {function(Function): void}
 * @annotation
 */
export function Component(options: IComponentOptions): ClassDecorator {

    return (target: Function) => {

        const componentName = camelCase(options.selector);
        const config: IComponentDirective =
            angular.extend({}, componentDefaultOptions, options || {});

        // store component name, to be accessible from native js object
        const componentMeta = {name: componentName};

        Reflect.defineMetadata(COMPONENT_KEY, componentMeta, target.prototype);

        // attribute meta data is defined in Attribute annotation
        const attributeMeta = Reflect.getMetadata(COMPONENT_ATTR_KEY, target.prototype) || [];

        // required controller meta data is defined in RequiredCtrl annotation
        const requiredCtrlMeta = Reflect.getMetadata(COMPONENT_CTRL_KEY, target.prototype) || [];

        // add required elements to directive config
        config.require = requiredCtrlMeta.map(value => value.option);

        // set target class as controller
        config.controller = target;

        // init isolated scope
        config.scope = {};

        // set scope hashes for controller scope
        angular.forEach(attributeMeta, meta => {
            config.scope[meta.propertyName] = meta.scopeHash;
        });

        // If onPreLink, onPostLink or onDestroy are implemented by
        // targets prototype, prepare these events:
        if (target.prototype.onPreLink
            || target.prototype.onPostLink
            || target.prototype.onDestroy
            || requiredCtrlMeta.length) {

            const link: { pre?: Function; post?: Function } = {};

            if (target.prototype.onPreLink
                || target.prototype.onDestroy
                || requiredCtrlMeta.length) {
                link.pre = (scope, element, attrs, requiredCtrlInstances) => {

                    // ensure that requiredCtrlInstances parameter is always an array
                    requiredCtrlInstances = requiredCtrlInstances ? [].concat(requiredCtrlInstances) : [];

                    // retrieve component instance from scope, through controllerAs name
                    const componentInstance = scope[config.controllerAs];

                    // initialized required controller instances to component instance
                    requiredCtrlInstances.forEach((instance, index) => {

                        componentInstance[requiredCtrlMeta[index].key] = instance;
                    });

                    // process registered event handlers
                    if (componentInstance.onPreLink) componentInstance.onPreLink(element);
                    if (componentInstance.onDestroy) scope.$on('$destroy', () => componentInstance.onDestroy(element));
                }
            }
            if (target.prototype.onPostLink) {
                link.post = (scope, element) => {

                    // retrieve component instance from scope, through controllerAs name
                    const componentInstance = scope[config.controllerAs];

                    // process registered event handlers
                    if (componentInstance.onPostLink) componentInstance.onPostLink(element);
                }
            }

            // add link to directive config
            (config as any).compile = () => link;
        }

        if (!config.moduleName && !config.module) {

            throw new Error('Either "moduleName" or "module" has to be defined')
        }

        angular
            .module(config.moduleName || config.module.name)
            .directive(componentName, () => config);
    }
}
