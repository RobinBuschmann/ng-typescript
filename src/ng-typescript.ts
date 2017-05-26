import 'reflect-metadata';
import * as angular from 'angular';

export {Attribute} from './annotations/Attribute';
export {ClassFactory} from './annotations/ClassFactory';
export {Component} from './annotations/Component';
export {Config} from './annotations/Config';
export {Factory} from './annotations/Factory';
export {Inject} from './annotations/Inject';
export {Input} from './annotations/Input';
export {Output} from './annotations/Output';
export {ProvidedService} from './annotations/ProvidedService';
export {Provider} from './annotations/Provider';
export {RequiredCtrl} from './annotations/RequiredCtrl';
export {RouteConfig} from './annotations/RouteConfig';
export {Service} from './annotations/Service';
export {View} from './annotations/View';

export const VIEW_KEY = 'ng:view-key';
export const REQUIRED_CTRL_KEY = 'ng:required-ctrl';
export const INJECT_NAME_KEY = 'ng:inject-name';
export const INLINE_INJECTS = 'ng:inline-injects';
export const COMPONENT_KEY = 'ng:component';
export const COMPONENT_ATTR_KEY = 'ng:component-attr';
export const COMPONENT_CTRL_KEY = 'ng:component-ctrl';

/**
 * Retrieves injectNames from specified classes,
 * to generate an array, which only consists of
 * inject names
 */
export function retrieveInjectNames(values: Array<string | Function>) {

    return values.map(value => {

        if (angular.isString(value)) {

            return value;
        }

        const _injectName = Reflect.getMetadata(INJECT_NAME_KEY, value.prototype);

        if (!_injectName) {

            throw new Error(`Specified class '${getFunctionName(value)}' has no meta data for injectName`);
        }

        return _injectName;
    });
}

/**
 * Retrieves inject name from specified class
 */
export function injectName(type: Function): string|undefined {

    return Reflect.getMetadata(INJECT_NAME_KEY, type.prototype);
}

/**
 * A helper method to generate an annotated function
 * in the old angular way. This accepts beside strings
 * annotated classes.
 */
export function invokable(...dependencies: Array<string | Function>) {

    let fn = dependencies.pop();

    return retrieveInjectNames(dependencies).concat(fn);
}


/**
 * This generates an identifier for any app component
 * (services, providers, factories, controllers).
 * To ensure, that each component gets an unique
 * identifier, an autoincrement numerical value
 * is used. To prevent collision with external
 * modules, the identifier consists of the components
 * module name, which already has to be unique
 * regarding other modules.
 */
export const createIdentifier = (function() {

    let count = 1; // the counter prevents internal collisions

    return (moduleName, className?) => moduleName + '-' + (count++) + (className ? ('-' + className) : '');

}());

/**
 * Processes annotations for services, providers, factories and controllers.
 * Stores meta data for injectName for each class and initializes each
 * component with specified module.
 */
export function process(any: any,
                        name: string,
                        mode: string,
                        providedServiceClass?: Function,
                        create = true): ClassDecorator&PropertyDecorator&ParameterDecorator {

    return (target: any) => {

        const module = angular.isObject(any) ? any : angular.module(any);

        // if Provider annotation passes provided service class,
        // retrieve inject name from service
        if (providedServiceClass) {

            name = Reflect.getMetadata(INJECT_NAME_KEY, providedServiceClass.prototype);
        } else {

            // generate inject name if necessary
            name = name || createIdentifier(module.name, target.name);
        }

        // store inject name via reflect-metadata
        Reflect.defineMetadata(INJECT_NAME_KEY, mode === 'provider' ?
            name + 'Provider' : name, target.prototype);

        if (create) module[mode](name, target);
    };
}

/**
 * Helper method to get name of function
 */
function getFunctionName(fn) {

    if (fn.name) {

        return fn.name;
    }

    return /^function\s+([\w\$]+)\s*\(/.exec(fn.toString())[1];
}
