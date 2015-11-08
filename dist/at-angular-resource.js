///<reference path="../typings/angularjs/angular.d.ts"/>
///<reference path="../typings/angularjs/angular-resource.d.ts"/>
///<reference path="at-angular.ts"/>
var at;
(function (at) {
    'use strict';
    function combineResource(instance, model) {
        angular.extend(instance, instance.$_Resource(model));
    }
    var ResourceClass = (function () {
        function ResourceClass(model) {
            combineResource(this, model);
        }
        ResourceClass.prototype.$get = function (params) { return this.$promise; };
        ResourceClass.prototype.$query = function (params) { return this.$promiseArray; };
        ResourceClass.prototype.$remove = function (params) { return this.$promise; };
        ResourceClass.prototype.$save = function (params) { return this.$promise; };
        ResourceClass.prototype.$delete = function (params) { return this.$promise; };
        return ResourceClass;
    })();
    at.ResourceClass = ResourceClass;
    function Resource(moduleName, className, url, options) {
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
    at.Resource = Resource;
    function Action(options) {
        return function (target, key) {
            if (!target.__rActions) {
                target.__rActions = {};
            }
            target.__rActions[key] = options;
        };
    }
    at.Action = Action;
})(at || (at = {}));
//# sourceMappingURL=at-angular-resource.js.map