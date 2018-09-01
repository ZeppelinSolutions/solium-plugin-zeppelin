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

describe("[RULE] internal-state-underscore-suffix-implicit: Rejections", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should reject implicit internal state variables without underscore suffix", function(done) {
        const code = dedent`
            contract TestContract {

                bool implicit_no_underscore_suffix = false;

                function testFunction(uint parameter) {
                  bool foo = true;
                }
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'implicit_no_underscore_suffix' does not have an underscore as suffix.");
        done();
    });
});

describe("[RULE] internal-state-underscore-suffix-implicit: Acceptances", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept implicit internal state variables with underscore suffix", function(done) {
        const code = dedent`
            contract TestContract {

                bool internal_underscore_suffix_ = false;

                function testFunction(uint parameter) {
                  bool foo = true;
                }
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

});

describe("[RULE] internal-state-underscore-suffix-private: Rejections", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should reject private state variables without underscore suffix", function(done) {
        const code = dedent`
            contract TestContract {

                bool private no_underscore_suffix = false;

                function testFunction(uint parameter) {
                  bool foo = true;
                }
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'no_underscore_suffix' does not have an underscore as suffix.");
        done();
    });
});

describe("[RULE] internal-state-underscore-suffix-private: Acceptances", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept private state variables with underscore suffix", function(done) {
        const code = dedent`
            contract TestContract {

                bool private underscore_suffix_ = false;

                function testFunction(uint parameter) {
                  bool foo = true;
                }
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

});

describe("[RULE] internal-state-underscore-suffix: Rejections", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should reject internal state variables without underscore suffix", function(done) {
        const code = dedent`
            contract TestContract {

                bool internal no_underscore_suffix = false;

                function testFunction(uint parameter) {
                  bool foo = true;
                }
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'no_underscore_suffix' does not have an underscore as suffix.");
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

                bool internal underscore_suffix_ = false;

                function testFunction(uint parameter) {
                  bool foo = true;
                }
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

});
