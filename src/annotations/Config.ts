import * as angular from 'angular';
import {invokable} from "../ng-typescript";

export function Config(module: ng.IModule, inlineAnnotatedFunction: any[]): ClassDecorator;
export function Config(moduleName: string, inlineAnnotatedFunction: any[]): ClassDecorator;
export function Config(any: any, inlineAnnotatedFunction: any[]): ClassDecorator {

    return () => {

        const module = angular.isObject(any) ? any : angular.module(any);

        inlineAnnotatedFunction = invokable.apply(invokable, inlineAnnotatedFunction);

        module.config(inlineAnnotatedFunction);
    }
}
