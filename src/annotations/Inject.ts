import * as angular from 'angular';
import {INLINE_INJECTS, retrieveInjectNames} from "../ng-typescript";

export function Inject(...args: Array<string | Function>): ClassDecorator & PropertyDecorator & ParameterDecorator {

    return (target: any, key?: string, index?: any) => {

        if (!args.length) {

            const $inject = target.$inject;
            const types = Reflect.getMetadata('design:paramtypes', target) || [];

            if ($inject) {

                args = types.map((type, index) => $inject[index] || type)
            } else {
                args = types;
            }
        }

        args = retrieveInjectNames(args);

        if (angular.isNumber(index)) {
            target.$inject = target.$inject || [];
            target.$inject[index] = args[0];
        } else if (typeof key === 'string') {
            let inlineInjects = Reflect.getMetadata(INLINE_INJECTS, target);

            if (!inlineInjects) {
                inlineInjects = [];
                Reflect.defineMetadata(INLINE_INJECTS, inlineInjects, target);
            }

            inlineInjects.push({key, injectName: args[0]})
        } else {
            target.$inject = args;
        }
    };
}

export function _Inject(...args: Array<string | Function>): ClassDecorator & PropertyDecorator & ParameterDecorator {

    return (target: any, key?: string, index?: any) => {

        if (!args.length) {

            args = Reflect.getMetadata('design:paramtypes', target);
        }

        args = retrieveInjectNames(args);

        if (angular.isNumber(index)) {
            target.$inject = target.$inject || [];
            target.$inject[index] = args[0];
        } else if (typeof key === 'string') {
            let inlineInjects = Reflect.getMetadata(INLINE_INJECTS, target);

            if (!inlineInjects) {
                inlineInjects = [];
                Reflect.defineMetadata(INLINE_INJECTS, inlineInjects, target);
            }

            inlineInjects.push({key, injectName: args[0]})
        } else {
            target.$inject = args;
        }


    };
}
