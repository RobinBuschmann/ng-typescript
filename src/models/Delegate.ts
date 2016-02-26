module at {

    // TODO has to be reconsidered

    export interface IObservable<T> {

        subscribe(subscriber: (item: T) => any)
        unSubscribe(subscriber: (item: T) => any)
    }

    class Observable<T> implements IObservable<T> {

        private subscriber: Array<(item: T) => any>;

        constructor(private item?: T) {

            this.subscriber = [];
        }

        set(item: T) {
            this.item = item;
            this.trigger();
        }

        reset() {
            this.item = null;
        }

        subscribe(subscriber: (item: T) => any) {

            this.subscriber.push(subscriber);
        }

        unSubscribe(subscriber: (item: T) => any) {

            let index = this.subscriber.indexOf(subscriber);

            if (index !== -1) {

                this.subscriber.splice(index, 1);
            }
        }

        private trigger() {

            this.subscriber.forEach(subscriber => subscriber(this.item));

        }
    }

    export abstract class Delegate<TComponent, TDelegate extends Delegate<any, any>> {

        private delegates: {[handleKey: string]: TDelegate} = {};
        private componentInstanceObservable: Observable<TComponent>;


        constructor(protected $q: ng.IQService) {

            this.componentInstanceObservable = new Observable<TComponent>();

        }

        getByHandle(handleKey: string): TDelegate {

            if (!this.delegates[handleKey]) {

                this.createDelegate(handleKey);
            }

            return this.delegates[handleKey];
        }

        /**
         * @internal
         * @return {IPromise<TResult>}
         */
        protected componentInstance(): IObservable<TComponent> {

            return this.componentInstanceObservable;
        }

        /**
         * @internal
         */
        protected registerComponentInstance(componentInstance: TComponent, handleKey?: string) {

            let delegate;

            if (handleKey) {

                if (!this.delegates[handleKey]) {

                    this.createDelegate(handleKey);
                }

                delegate = this.delegates[handleKey];
            } else {

                delegate = this;
            }

            delegate.componentInstanceObservable.set(componentInstance);

        }

        /**
         * @internal
         * @param handleKey
         */
        protected createDelegate(handleKey: string) {

            this.delegates[handleKey] = this.getInstance();
        }

        /**
         * @internal
         * @param handleKey
         */
        protected removeDelegate(handleKey?: string) {

            if (handleKey && this.delegates[handleKey]) {

                this.delegates[handleKey] = null;
            } else if (!handleKey) {

                this.componentInstanceObservable.reset();
            }
        }

        protected abstract getInstance(): TDelegate;

    }
}

