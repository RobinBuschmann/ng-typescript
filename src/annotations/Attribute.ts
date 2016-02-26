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

      let metaData = angular.extend({}, defaultAttributeOptions, options);

      metaData.propertyName = key;
      metaData.name = options.name || key;
      metaData.scopeHash = metaData.binding + (metaData.isOptional ? '?' : '') + (metaData.name);

      target.__componentAttributes.push(metaData);

      // Add attribute meta data to the component meta data;
      target.__componentAttributes.push();
    }
  }
}
