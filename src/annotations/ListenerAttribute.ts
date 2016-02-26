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

  export function ListenerAttribute(options: IListenerAttributeOptions = {}): IMemberAnnotationDecorator {

    // Attribute defaults for listener
    (<IAttributeOptions>options).isOptional = true;
    (<IAttributeOptions>options).binding = '&';

    return at.Attribute(options);
  }
}
