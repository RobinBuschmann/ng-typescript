'use strict';

describe 'annotations:', ->

  beforeEach module 'test'

  describe '@Inject', ->
    $http = null
    $parse = null
    testServiceOne = null

    beforeEach inject (_$http_, _$parse_, _testServiceOne_) ->
      $http = _$http_
      $parse = _$parse_
      testServiceOne = _testServiceOne_

    it 'should be defined', ->

      expect at.Inject
      .toEqual jasmine.any Function

    it 'should assign proper $Inject array to Service constructor', ->

      expect testServiceOne
      .toEqual jasmine.any test.TestServiceOne

      expect test.TestServiceOne.$inject
      .toEqual ['$http', '$parse']

    it 'should make proper dependencies are passed to Service constructor on instantiation', ->

      expect testServiceOne.$$http
      .toBe $http

      expect testServiceOne.$$parse
      .toBe $parse


