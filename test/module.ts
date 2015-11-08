module test {

    'use strict';

    export const inject: at.IInjectAnnotation = at.Inject;
    export const service: at.IServiceAnnotation = at.Service;
    export const controller: at.IControllerAnnotation = at.controller;
    export const directive: at.IDirectiveAnnotation = at.directive;
    export const classFactory: at.IClassFactoryAnnotation = at.classFactory;
    export const resource: at.IResourceAnnotation = at.resource;

    angular.module('test', ['ngResource']);

}
