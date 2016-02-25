
module at {

    export interface IAttributeOptions {
        binding?: string;
        name?: string;
        isOptional?: boolean;
    }

    const defaultAttributeOptions = {
        binding: '=',
        name: '',
        isOptional: false
    };

    export function Attribute(options: IAttributeOptions = {}): IMemberAnnotationDecorator {

        return (target: any, key: string) => {

            // will be used in "component" annotation
            if (!target.__componentAttributes) {
                target.__componentAttributes = [];
            }

            options = angular.extend({}, defaultAttributeOptions, options);

            // Add attribute meta data to the component meta data;
            target.__componentAttributes.push({
                key,
                scopeHash: options.binding + (options.isOptional ? '?' : '') + (options.name),
                isOptional: options.isOptional,
                attrName: (options.name || key),
                binding: options.binding
            });
        }
    }
}
