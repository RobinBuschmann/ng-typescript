///<reference path="../typings/angularjs/angular.d.ts"/>
///<reference path="../typings/angularjs/angular-resource.d.ts"/>
///<reference path="at-angular.ts"/>
var at;
(function (at) {
    'use strict';
    function combineResource(instance, model) {
        angular.extend(instance, instance.$_Resource(model));
    }
    var Resource = (function () {
        function Resource(model) {
            combineResource(this, model);
        }
        Resource.prototype.$get = function (params) { return this.$promise; };
        Resource.prototype.$query = function (params) { return this.$promiseArray; };
        Resource.prototype.$remove = function (params) { return this.$promise; };
        Resource.prototype.$save = function (params) { return this.$promise; };
        Resource.prototype.$delete = function (params) { return this.$promise; };
        return Resource;
    })();
    at.Resource = Resource;
    function resource(moduleName, className, url, options) {
        return function (target) {
            function resourceClassFactory($resource) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var newResource = $resource(url, target.params, target.prototype.__rActions, options);
                return at.AttachInjects.apply(void 0, [angular.extend(newResource, angular.extend(target, newResource, {
                    prototype: angular.extend(newResource.prototype, angular.extend(target.prototype, {
                        $_Resource: newResource
                    }))
                }))].concat(args));
            }
            resourceClassFactory.$inject = (['$resource']).concat(target.$inject || []);
            angular.module(moduleName).factory(className, resourceClassFactory);
        };
    }
    at.resource = resource;
    function action(options) {
        return function (target, key) {
            if (!target.__rActions) {
                target.__rActions = {};
            }
            target.__rActions[key] = options;
        };
    }
    at.action = action;
})(at || (at = {}));
//# sourceMappingURL=at-angular-resource.js.map