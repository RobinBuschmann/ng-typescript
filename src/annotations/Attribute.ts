import  * as angular from 'angular';
import {IAttributeOptions} from "../interfaces/IAttributeOptions";
import {COMPONENT_ATTR_KEY} from "../ng-typescript";

const defaultAttributeOptions = {
    binding: '=',
    name: '',
    isOptional: false
};

/**
 * Prepares attributes for component directives.
 * @annotation
 */
export function Attribute(options: IAttributeOptions = {}): PropertyDecorator {

    return (target: any, key: string) => {

        let componentAttributesMeta = Reflect.getMetadata(COMPONENT_ATTR_KEY, target);

        if (!componentAttributesMeta) {

            componentAttributesMeta = [];
            Reflect.defineMetadata(COMPONENT_ATTR_KEY, componentAttributesMeta, target);
        }

        const attributeMeta = angular.extend({}, defaultAttributeOptions, options);

        attributeMeta.propertyName = key;
        attributeMeta.name = options.name || key;
        attributeMeta.scopeHash = attributeMeta.binding + (attributeMeta.isOptional ? '?' : '') + (attributeMeta.name);

        componentAttributesMeta.push(attributeMeta);
    }
}
