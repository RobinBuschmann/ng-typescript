'use strict';

describe 'annotations:', ->

  beforeEach module 'test'

  describe '@Service', ->
    deps = null
    testServiceTwo = null

    beforeEach inject (_$http_, _$parse_, _testServiceTwo_) ->
      deps =
        $http: _$http_
        $parse: _$parse_
      testServiceTwo = _testServiceTwo_

    it 'should be defined', ->

      expect at.Service
      .toEqual jasmine.any Function

    it 'should instantiate decorated class as new Service', ->

      expect testServiceTwo
      .toBeDefined()

      expect testServiceTwo
      .toEqual jasmine.any test.TestServiceTwo

    it 'should pass proper dependencies (based on static member "$inject") to Service constructor', ->

      for dep in test.TestServiceTwo.$inject
        expect testServiceTwo["$$#{ dep.replace('$', '') }"]
        .toBe deps[dep]


