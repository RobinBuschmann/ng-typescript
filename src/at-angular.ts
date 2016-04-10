
// Support AMD require
// and SystemJS import
declare module 'at' {
    export = at;
}

module at {

    'use strict';

    /* tslint:disable:no-any */
    export interface IClassAnnotationDecorator {
        (target: any): void;
        (t: any, key: string, index: number): void;
    }

    /* tslint:disable:no-any */
    export interface IMemberAnnotationDecorator {
        (target: any, key: string): void;
    }

    export function instantiate(moduleName: string, name: string, mode: string): IClassAnnotationDecorator {
        return (target: any): void => {
            angular.module(moduleName)[mode](name, target);
        };
    }
}
