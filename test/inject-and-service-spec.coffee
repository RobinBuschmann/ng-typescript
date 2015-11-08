'use strict';

describe 'annotations:', ->

  beforeEach module 'test'

  describe '@Inject & @Service together', ->
    $http = null
    $parse = null
    testServiceThree = null

    beforeEach inject (_$http_, _$parse_, _testServiceThree_) ->
      $http = _$http_
      $parse = _$parse_
      testServiceThree = _testServiceThree_

    it 'should instantiate decorated class as new Service', ->

      expect testServiceThree
      .toBeDefined()

      expect testServiceThree
      .toEqual jasmine.any test.TestServiceThree

    it 'should assign proper $Inject array to Service constructor', ->

      expect test.TestServiceThree.$inject
      .toEqual ['$http', '$parse']

    it 'should make proper dependencies are passed to Service constructor on instantiation', ->

      expect testServiceThree.$$http
      .toBe $http

      expect testServiceThree.$$parse
      .toBe $parse


