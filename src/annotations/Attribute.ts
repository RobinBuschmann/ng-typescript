

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

  /**
   * Prepares attributes for component directives.
   *
   * @param options
   * @return {function(any, string): void}
   * @annotation
     */
  export function Attribute(options: IAttributeOptions = {}): IMemberAnnotationDecorator {

    return (target: any, key: string) => {
      
      let componentAttributesMeta = Reflect.getMetadata('componentAttributes', target.constructor);
      
      if(!componentAttributesMeta) {

        componentAttributesMeta = [];
        Reflect.defineMetadata('componentAttributes', componentAttributesMeta, target.constructor);
      }
      
      let attributeMeta = angular.extend({}, defaultAttributeOptions, options);

      attributeMeta.propertyName = key;
      attributeMeta.name = options.name || key;
      attributeMeta.scopeHash = attributeMeta.binding + (attributeMeta.isOptional ? '?' : '') + (attributeMeta.name);

      componentAttributesMeta.push(attributeMeta);
    }
  }
}
