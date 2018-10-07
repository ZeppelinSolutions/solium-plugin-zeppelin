/**
 * @fileoverview Tests for no-state-variable-shadowing rule
 */

"use strict";

const dedent = require("dedent");
const Solium = require("solium");
const wrappers = require("./utils/wrappers");
const addPragma = wrappers.addPragma;

const userConfig = {
    rules: {
        "zeppelin/parameters-underscore-prefix": 1
    }
};

describe("[RULE] parameters-underscore-prefix: Rejections", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should reject parameters without underscore prefix", function(done) {
        const code = dedent`
            contract TestContract {
                function testFunction(uint parameterWithoutUnderscorePrefix) {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'parameterWithoutUnderscorePrefix' is not prefixed with an underscore.");
        done();
    });
});

describe("[RULE] parameter-underscore-prefix: Acceptances", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept parameters with underscore prefix", function(done) {
        const code = dedent`
            contract TestContract {
                function testFunction(uint _parameterWithUnderscorePrefix) {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

});
