
export interface IComponentState {

    /**
     * Class that is decorated by @Component
     */
    component?: Function;

    /**
     * Class that is decorated by @View
     */
    view?: Function;

    /**
     * Name of the state
     */
    name?: string;

    parent?: string;

    views?: { [name: string]: IComponentState };

    resolve?: { [name: string]: any };
    /**
     * A url with optional parameters. When a state is navigated or transitioned to, the $stateParams service will be populated with any parameters that were passed.
     */
    url?: string;
    /**
     * A map which optionally configures parameters declared in the url, or defines additional non-url parameters. Only use this within a state if you are not using url. Otherwise you can specify your parameters within the url. When a state is navigated or transitioned to, the $stateParams service will be populated with any parameters that were passed.
     */
    params?: any;
    /**
     * Use the views property to set up multiple views. If you don't need multiple views within a single state this property is not needed. Tip: remember that often nested views are more useful and powerful than multiple sibling views.
     */
    abstract?: boolean;
    /**
     * Callback function for when a state is entered. Good way to trigger an action or dispatch an event, such as opening a dialog.
     * If minifying your scripts, make sure to explicitly annotate this function, because it won't be automatically annotated by your build tools.
     */
    onEnter?: Function | Array<string | Function>;
    /**
     * Callback functions for when a state is entered and exited. Good way to trigger an action or dispatch an event, such as opening a dialog.
     * If minifying your scripts, make sure to explicitly annotate this function, because it won't be automatically annotated by your build tools.
     */
    onExit?: Function | Array<string | Function>;
    /**
     * Arbitrary data object, useful for custom configuration.
     */
    data?: any;

    /**
     * Boolean (default true). If false will not re-trigger the same state just because a search/query parameter has changed. Useful for when you'd like to modify $location.search() without triggering a reload.
     */
    reloadOnSearch?: boolean;

    /**
     * Boolean (default true). If false will reload state on everytransitions. Useful for when you'd like to restore all data  to its initial state.
     */
    cache?: boolean;
}
