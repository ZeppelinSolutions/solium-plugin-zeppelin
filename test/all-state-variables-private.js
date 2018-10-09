/**
 * @fileoverview Tests for all-state-variables-private
 */

"use strict";

const dedent = require("dedent");
const Solium = require("solium");
const wrappers = require("./utils/wrappers");
const addPragma = wrappers.addPragma;

const userConfig = {
    rules: {
        "zeppelin/all-state-variables-private": 1
    }
};

describe("[RULE] all-state-variables-private: Rejections", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should reject public state variables", function(done) {
        const code = dedent`
            contract TestContract {
                bool public publicStateVariable = false;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'publicStateVariable' is not private.");
        done();
    });

    it("should reject internal state variables", function(done) {
        const code = dedent`
            contract TestContract {
                bool internal internalStateVariable = false;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'internalStateVariable' is not private.");
        done();
    });

    it("should reject state variables with default visibility", function(done) {
        const code = dedent`
            contract TestContract {
                bool stateVariableWithDefaultVisibility = false;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'stateVariableWithDefaultVisibility' is not private.");
        done();
    });

});

describe("[RULE] all-state-variables-private: Acceptances", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept private state variables", function(done) {
        const code = dedent`
            contract TestContract {
                bool private privateStateVariable = false;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

});
