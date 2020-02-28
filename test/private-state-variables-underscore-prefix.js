/**
 * @fileoverview Tests for private-state-variables-underscore-prefix
 */

"use strict";

const dedent = require("dedent");
const Solium = require("solium");
const wrappers = require("./utils/wrappers");
const addPragma = wrappers.addPragma;

const userConfig = {
    rules: {
        "zeppelin/private-state-variables-underscore-prefix": 1
    }
};

describe("[RULE] private-state-variables-underscore-prefix: Rejections", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should reject private state variables without underscore prefix", function(done) {
        const code = dedent`
            contract TestContract {
                bool private variableWithoutUnderscorePrefix = false;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'variableWithoutUnderscorePrefix' does not have an underscore as prefix.");
        done();
    });
});

describe("[RULE] private-state-variables-underscore-prefix: Acceptances", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept private state variables with underscore prefix", function(done) {
        const code = dedent`
            contract TestContract {
                bool private _variableWithUnderscorePrefix = false;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

    it("should accept public state variables", function(done) {
        const code = dedent`
            contract TestContract {
                bool public publicStateVariable = false;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

    it("should accept internal state variables", function(done) {
        const code = dedent`
            contract TestContract {
                bool internal internalStateVariable = false;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

    it("should accept state variables with default visibility", function(done) {
        const code = dedent`
            contract TestContract {
                bool stateVariableWithDefaultVisibility = false;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

});
