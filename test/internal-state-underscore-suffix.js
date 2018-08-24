/**
 * @fileoverview Tests for internal-state-underscore-suffix rule
 */

"use strict";

const dedent = require("dedent");
const Solium = require("solium");
const wrappers = require("./utils/wrappers");
const addPragma = wrappers.addPragma;

const userConfig = {
    rules: {
        "zeppelin/internal-state-underscore-suffix": 1
    }
};

describe("[RULE] internal-state-underscore-suffix: Rejections", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should reject internal state variables without underscore suffix", function(done) {
        const code = dedent`
            contract TestContract {

                bool internal_no_underscore_suffix = false;

                function testFunction(uint parameter) {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'internal_no_underscore_suffix' does not have an underscore as suffix.");
        done();
    });
});

describe("[RULE] internal-state-underscore-suffix: Acceptances", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept internal state variables with underscore suffix", function(done) {
        const code = dedent`
            contract TestContract {

                bool public internal_underscore_suffix_ = false;

                function testFunction(uint parameter) {}
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

});
