describe('XML Model Testing Module', function() {

  //
  // Global settings
  //

  // server providing testing XML data
  var host = '127.0.0.1';
  var port = 8380;

  var XMLModel = require('../../lib/backbone-xml').XMLModel;

  var schema = {
    name: "testing",
    type: "object",
    properties: {
      "number": {
        type: "integer",
        minimum: 1,
        maximum: 10,
        required: true
      },
      "string": {
        type: "string"
        // not required
      },
      "array": {
        type: "array",
        items: {
          type: "integer"
        },
        required: true  // at least one array item required
      }
    }
  };

  // timeout for async functions to complete (in ms)
  var timeout = 1000;
  var model;
  var completedOK, completedError;

  //
  // Before each
  //

  beforeEach(function() {

    model = new XMLModel();
    completedOK = completedError = false;

    model.bind('change', function() {
      completedOK = true;
    });

    model.bind('error', function() {
      completedError = true;
    });

  });


  //
  // Test specs
  //


  it('should fail when URL is invalid', function() {

    var url = 'http://' + host + ':' + port + '/data/nonexistent.xml';

    model.fetch({
      url: url
    });

    waitsFor(function () {
      return completedError;
    }, timeout);

    runs(function() {
      expect(completedOK).toBeFalsy();
      expect(model.attributes).toEqual({});
    });

  });


  it('should fail for non-XML data', function() {

    var url = 'http://' + host + ':' + port + '/data/not-xml.xml';

    model.fetch({
      url: url
    });

    waitsFor(function () {
      return completedError;
    }, timeout);

    runs(function() {
      expect(completedOK).toBeFalsy();
      expect(model.attributes).toEqual({});
    });

  });


  it('should load arbitrary XML data when schema is not provided', function() {

    var url = 'http://' + host + ':' + port + '/data/schema-incompatible.xml';

    model.fetch({
      url: url
    });

    waitsFor(function () {
      return completedOK;
    }, timeout);

    runs(function() {
      expect(completedError).toBeFalsy();
      expect(model.get('greeting')).toEqual('hello world');
    });

  });


  it('should fail if the XML data does not match the provided schema',
  function() {

    var url = 'http://' + host + ':' + port + '/data/schema-incompatible.xml';

    model.fetch({
      url: url,
      schema: schema
    });

    waitsFor(function () {
      return completedError;
    }, timeout);

    runs(function() {
      expect(completedOK).toBeFalsy();
      expect(model.attributes).toEqual({});
    });

  });


  it('should load XML data conforming to provided schema', function() {

    var url = 'http://' + host + ':' + port + '/data/schema-compatible.xml';

    model.fetch({
      url: url,
      schema: schema
    });

    waitsFor(function () {
      return completedOK;
    }, timeout);

    runs(function() {
      expect(completedError).toBeFalsy();
      expect(model.get('number')).toEqual(5);
      expect(model.get('string')).toEqual('hello world');
      expect(model.get('array').length).toEqual(1);
      expect(model.get('array')[0]).toEqual(1);
    });

  });


  it('should fail for incomplete XML data', function() {

    var url = 'http://' + host + ':' + port + '/data/incomplete.xml';

    model.fetch({
      url: url,
      schema: schema
    });

    // longer timeout, so the default parser internal timeout can fire
    waitsFor(function () {
      return completedOK;
    }, 5*timeout);

    runs(function() {
      expect(completedOK).toBeFalsy();
      expect(model.attributes).toEqual({});
    });

  });

});
