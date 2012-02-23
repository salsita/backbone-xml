# backbone-xml

## Description

*Backbone.Model* uses by default *Backbone.sync* every time it attempts to read
a model from or save a model to the server. This works well for models stored in
JSON, but does not work for models that are stored in XML on the server.
*Backbone.XMLModel*, introduced here in *backbone-xml.js* CommonJS module,
overrides the *sync* method with one that allows models to be stored in XML on
the server. Optionally each XML data obtained from the server can be
schema-validated before it is *set* on the model. Currently only read-only mode
is supported, i.e. you can use the model only to *fetch* XML data from the
server. The capability of saving the models back to the server in XML will be
implemented in the future.

If schema verification is desired, pass the schema-describing object in `schema`
option to the *fetch* call. The object must confirm to [Description of Structure
and Meaning of JSON
Documents](http://tools.ietf.org/html/draft-zyp-json-schema-03 "Description of
Structure and Meaning of JSON Documents").

The XMLModel emits `change` event when the XML data is downloaded from the
server, the data is XML-parsed, optionally schema-verified, and possibly
validated (when *validate* function is provided in the derived model). When you
bind a callback with the `change` event, you can access the model's data using
*get* method there.

The XMLModel emits `error` event on any transport, parsing or validating error.
The error is accompanied with text description of the problem.


## Dependencies

The XMLModel implementation depends on the following libraries / modules:
* [jquery.js](http://jquery.com/ "jquery.js"):  Ajax interactions, 
* [backbone.js](http://documentcloud.github.com/backbone/ "backbone.js"): the
* Backbone functionality we are extending,
* [xml2js.js](https://github.com/salsita/node-xml2js/ "xml2js.js"):
* XML parser, and
* [xml2js-schema.js](https://github.com/salsita/xml2js-schema
* "xml2js-schema.js"): schema validator.

The XMLModel is a CommonJS module and uses other CommonJS modules, so function
`require()` must exist in the execution context.


## Usage

      var model = new XMLModel(/* optional */ attributes);
      model.bind('change', successCallback);
      /* optional */ model.bind('error', errorCallback);
      model.fetch({
        url: ...,
        /* optional */ schema: ...
      });


## Example

      var XMLModel = require('backbone-xml').XMLModel;

      var TODOModel = XMLModel.extend({
        validate: function(attributes) {
          if ( (attributes.number_of_tags > 0  && !attributes.tags) ||
               (attributes.number_of_tags != attributes.tags.length) ) {
            return 'problem with tags';
          }
        }
      });

      var TODOschema = {
        name: "TODOitem",
        type: "object",
        properties: {
          "text": {
            type: "string",
            required: true
          },
          "done": {
            type: "boolean",
            required: true
          },
          "display_order": {
            type: "integer"
          },
          "number_of_tags": {
            type: "integer",
            required: true
          },
          "tags": {
            type: "array",
            items: {
              type: "string"
            }
          }
        }
      };

      function success() {
        console.log('TODO model:');
        console.log(todoItem.attributes);
      }

      function error(message) {
        console.log('Error:', message);
      }

      var todoItem = new TODOModel();
      todoItem.bind('change', success);
      todoItem.bind('error', error);
      todoItem.fetch({
        url: 'http://127.0.0.1:8380/data/todo.xml',
        schema: TODOschema
      });


## Testing

Jasmine-node test specification for XMLModel code can be found in
tests/specs/xmlmodel.spec.js file. To run the tests, go to the tests directory
and run the test suite:

      $ jasmine-node --verbose specs

Since we test also fetching the XML data from a server, we need an HTTP server
running. A node.js HTTP server implementation can be found in tests/server. To
start the server, go to the tests/server directory and issue:

      $ node file-server.js

The tests/server/data directory contains all the XML files for the jasmine test
suite, it includes also todo.xml file for the Example above.
