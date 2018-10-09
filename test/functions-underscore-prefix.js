/**
 * @fileoverview Tests for functions-underscore-prefix rule
 */

"use strict";

const dedent = require("dedent");
const Solium = require("solium");
const wrappers = require("./utils/wrappers");
const addPragma = wrappers.addPragma;

const userConfig = {
    rules: {
        "zeppelin/functions-underscore-prefix": 1
    }
};

describe("[RULE] functions-underscore-prefix: Rejections", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should reject internal functions without underscore prefix", function(done) {
        const code = dedent`
            contract TestContract {
                function internalFunctionWithoutUnderscorePrefix() internal {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'internalFunctionWithoutUnderscorePrefix' is not prefixed with an underscore.");
        done();
    });

    it("should reject private functions without underscore prefix", function(done) {
        const code = dedent`
            contract TestContract {
                function privateFunctionWithoutUnderscorePrefix() private {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'privateFunctionWithoutUnderscorePrefix' is not prefixed with an underscore.");
        done();
    });


});

describe("[RULE] functions-underscore-prefix: Acceptances", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept internal functions with underscore prefix", function(done) {
        const code = dedent`
            contract TestContract {
                function _internalFunctionWithUnderscorePrefix() internal {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

    it("should accept private functions with underscore prefix", function(done) {
        const code = dedent`
            contract TestContract {
                function _privateFunctionWithUnderscorePrefix() private {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

    it("should accept public functions", function(done) {
        const code = dedent`
            contract TestContract {
                function publicFunction() public {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

    it("should accept functions with default visibility", function(done) {
        const code = dedent`
            contract TestContract {
                function functionWithDefaultVisibility() {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });


});
