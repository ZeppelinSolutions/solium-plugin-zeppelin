/**
 * @fileoverview Tests for parameters-without-underscore rule
 */

"use strict";

const dedent = require("dedent");
const Solium = require("solium");
const wrappers = require("./utils/wrappers");
const addPragma = wrappers.addPragma;

const userConfig = {
    rules: {
        "zeppelin/parameters-without-underscore": 1
    }
};

describe("[RULE] parameters-without-underscore: Rejections", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should reject parameters with underscore prefix", function(done) {
        const code = dedent`
            contract TestContract {
                function testFunction(uint _parameterWithUnderscorePrefix) {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'_parameterWithUnderscorePrefix' is prefixed with an underscore.");
        done();
    });

    it("should reject parameters with underscore suffix", function(done) {
        const code = dedent`
            contract TestContract {
                function testFunction(uint parameterWithUnderscoreSuffix_) {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'parameterWithUnderscoreSuffix_' is suffixed with an underscore.");
        done();
    });

    it("should reject parameters with underscore prefix and suffix", function(done) {
        const code = dedent`
            contract TestContract {
                function testFunction(uint _parameterWithUnderscorePrefixAndSuffix_) {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'_parameterWithUnderscorePrefixAndSuffix_' is prefixed with an underscore.");
        done();
    });

});

describe("[RULE] parameters-without-underscore: Acceptances", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept parameters without underscores", function(done) {
        const code = dedent`
            contract TestContract {
                function testFunction(uint parameterWithoutUnderscores) {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

    it("should accept parameters with underscores in the middle", function(done) {
        const code = dedent`
            contract TestContract {
                function testFunction(uint parameter_with_underscores_in_the_middle) {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });
});
