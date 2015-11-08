'use strict';

describe 'annotations:', ->

  beforeEach module 'test'

  describe '@controller (with @Inject)', ->
    $scope = null
    $parse = null
    firstTestCtrl = null

    beforeEach inject ($controller, $rootScope, _$parse_) ->
      $scope = $rootScope.$new()
      $parse = _$parse_
      firstTestCtrl = $controller 'FirstTestCtrl', $scope: $scope

    it 'should be defined', ->

      expect at.controller
      .toEqual jasmine.any Function

    it 'should instantiate decorated class as new Service', ->

      expect firstTestCtrl
      .toBeDefined()

      expect firstTestCtrl
      .toEqual jasmine.any test.FirstTestCtrl

    it 'should assign proper $Inject array to Service constructor', ->

      expect test.FirstTestCtrl.$inject
      .toEqual ['$scope', '$parse']

    it 'should make proper dependencies are passed to Service constructor on instantiation', ->

      expect firstTestCtrl.$$parse
      .toBe $parse

      expect $scope.name
      .toBe 'FirstTestCtrl'


