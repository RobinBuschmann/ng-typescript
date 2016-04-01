module at {

  /**
   * Processes required controller for defined property.
   * Property is initialized with controller instance
   * of required component or directive with preLink.
   *
   * @param option Name of component or directive with require specification (^, ^^)
   * @return {function(any, string): void}
   * @constructor
     */
  export function RequiredCtrl(option: string): IMemberAnnotationDecorator {

    return (target: any, key: string) => {

      // will be used in "component" annotation
      if (!target.__requiredControllers) {
        target.__requiredControllers = [];
      }

      // Add required controller meta data to the component meta data;
      target.__requiredControllers.push({key, option});
    }
  }
}
