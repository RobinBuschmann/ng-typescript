module at {

  /**
   * Processes required controller for components property.
   * Property is initialized with controller instance
   * of required component or directive through preLink.
   *
   * @param option Name of component or directive with require specification (^, ^^)
   * @return {function(any, string): void}
   * @constructor
     */
  export function RequiredCtrl(option: string): IMemberAnnotationDecorator {

    return (target: any, key: string) => {
      
      let requiredControllersMeta = Reflect.getMetadata('requiredControllers', target.constructor);

      if(!requiredControllersMeta) {

        requiredControllersMeta = [];
        Reflect.defineMetadata('requiredControllers', requiredControllersMeta, target.constructor);
      }

      // Add required controller meta data to the component meta data;
      requiredControllersMeta.push({key, option});
    }
  }
}
