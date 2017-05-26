
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
