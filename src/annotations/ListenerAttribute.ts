module at {

  export interface IListenerAttributeOptions {

    /**
     * @description Array of strings, which describes the parameters
     *              that should be added to the event listener
     * @example
     *
     *          In component class:
     *
     *          @ListenerAttribute({eventParamNames: ['$someObj']})
     *
     *          In html:
     *
     *          <some-component on-completed="onCompleted($someObj)"></some-component>
     */
    eventParamNames?: Array<string>;
    name?: string;
  }

  /**
   * Prepares "listener" attributes for component directives.
   * The consumer of the corresponding component can pass
   * event listeners to this attribute. This attribute is
   * defined for a specified action. Every time this action
   * occurs, the event listener will be executed.
   *
   * @param options
   * @return {IMemberAnnotationDecorator}
   * @annotation
     */
  export function ListenerAttribute(options: IListenerAttributeOptions = {}): IMemberAnnotationDecorator {

    // Attribute defaults for listener
    (<IAttributeOptions>options).isOptional = true;
    (<IAttributeOptions>options).binding = '&';

    return at.Attribute(options);
  }
}
