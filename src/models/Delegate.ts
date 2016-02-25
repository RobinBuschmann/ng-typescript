module at {

    export abstract class Delegate<TComponent, TDelegate extends Delegate<any, any>> {

        private delegates: {[handleKey: string]: TDelegate} = {};

        /**
         * @internal
         * @param handleKey
         */
        protected componentInstance: TComponent;

        getByHandle(handleKey: string): TDelegate {

            let delegate = this.delegates[handleKey];

            if (delegate) {

                return delegate;
            }

            throw new Error(`Delegate with handle key ${handleKey} does not exist`);
        }

        /**
         * @internal
         * @param handleKey
         * @param componentInstance
         */
        protected createDelegate(componentInstance: TComponent, handleKey: string = null) {

            if (handleKey) {

                if (this.delegates[handleKey]) {
                    throw new Error(`Delegate with handle key ${handleKey} already exist`);
                }

                let delegate = this.getInstance();
                delegate['componentInstance'] = componentInstance;

                this.delegates[handleKey] = delegate;

            } else {

                // if no handle key is provided, set current instance
                // to the delegate of the specified component instance
                // as fall back
                this.componentInstance = componentInstance;
            }
        }

        /**
         * @internal
         * @param handleKey
         */
        protected removeDelegate(handleKey: string) {

            if (handleKey && this.delegates[handleKey]) {

                this.delegates[handleKey] = null;
            }
        }

        protected abstract getInstance(): TDelegate;

    }
}

