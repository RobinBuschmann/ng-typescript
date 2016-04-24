module at {

  export interface IOutputOptions {

    /**
     * @description Array of strings, which describes the parameters
     *              that should be added to the event listener, if 
     *              the output component is used for resolve in
     *              RouteConfig.
     * @example
     *
     *          In component class:
     *
     *          @Output({eventParamNames: ['$someObj']})
     *
     *          In html:
     *
     *          <some-component on-completed="onCompleted($someObj)"></some-component>
     */
    eventParamNames?: Array<string>;
    name?: string;
  }

  /**
   * Prepares output attributes for component directives.
   * The consumer of the corresponding component can pass
   * event listeners to this attribute. This attribute is
   * defined for a specified action. Every time this action
   * occurs, the event listener will be executed.
   *
   * @param options
   * @return {IMemberAnnotationDecorator}
   * @annotation
     */
  export function Output(options: IOutputOptions = {}): IMemberAnnotationDecorator {

    // Attribute defaults for listener
    (<IAttributeOptions>options).isOptional = true;
    (<IAttributeOptions>options).binding = '&';

    return at.Attribute(options);
  }
}
