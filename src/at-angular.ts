// Support AMD require
// and SystemJS import
declare module 'at' {
    export = at;
}

module at {

    'use strict';

    /* tslint:disable:no-any */
    export interface IClassAnnotationDecorator {
        (target: any): void;
        (t: any, key: string, index: number): void;
    }

    /* tslint:disable:no-any */
    export interface IMemberAnnotationDecorator {
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
    export function retrieveInjectNames(values: Array<string|Function>) {

        return values.map(value => {

            if(angular.isString(value)) {

                return value;
            }

            const injectName = Reflect.getMetadata('injectName', value);

            if(!injectName) {

                throw new Error(`Specified class '${getFunctionName(value)}' has no meta data for injectName`);
            }

            return injectName;
        });
    }

    /**
     * Helper method to get name of function
     *
     * @param fn
     * @return {any}
     */
    function getFunctionName(fn) {

        if(fn.name) {

            return fn.name;
        }

        return /^function\s+([\w\$]+)\s*\(/.exec( fn.toString() )[ 1 ];
    }

    /**
     * A helper method to generate an annotated function
     * in the old angular way. This accepts beside strings
     * annotated classes.
     *
     *
     * @param dependencies
     * @return {string|Function[]|string|Function|any[]}
     */
    export function invokable(...dependencies: Array<string|Function>) {

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
     *
     * @param moduleName
     * @return {string}
     */
    export const createIdentifier = (function () {

        let count = 1; // the counter prevents internal collisions

        return moduleName => moduleName + '-' + (count++);

    }());

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
    export function process(any: any, name: string, mode: string, providedServiceClass?: Function, create = true): IClassAnnotationDecorator {
        return (target: any): void => {

            let module = angular.isObject(any) ? any : angular.module(any);

            // if Provider annotation passes provided service class,
            // retrieve inject name from service
            if (providedServiceClass) {

                name = Reflect.getMetadata('injectName', providedServiceClass);
            } else {

                // generate inject name if necessary
                name = name || createIdentifier(module.name);
            }

            // store inject name via reflect-metadata
            Reflect.defineMetadata('injectName', mode === 'provider' ? name + 'Provider' : name, target);

            if (create) module[mode](name, target);
        };
    }
}
