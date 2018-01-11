/**
 * @fileoverview Tests for constant-candidates rule
 */

"use strict";

let Solium = require("solium");
let wrappers = require("./utils/wrappers");
let toContract = wrappers.toContract;

let userConfig = {
    rules: {
        "zeppelin/constant-candidates": 1
    }
};

describe("[RULE] constant-candidates: Acceptances", function() {
    it("should accept constant state variable", function(done) {
        let code = toContract("uint constant testVar = 10;"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();

        done();
    });
});

describe("[RULE] constant-candidates: Acceptances", function() {
    it("should accept non-private state variable", function(done) {
        let code = toContract("uint testVar = 10;"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();

        done();
    });
});

describe("[RULE] constant-candidates: Acceptances", function() {
    it("should accept private state variable with mutation", function(done) {
        let code = toContract("uint private testVar = 10;\n" +
                              "function testFunc() {testVar = 5;}"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();

        done();
    });
});

describe("[RULE] constant-candidates: Rejections", function() {
    it("should reject private numeric state variable without mutation", function(done) {
        let code = toContract("uint private testVar = 10;"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "The state variable 'testVar' could be constant.");

        Solium.reset();

        done();
    });
});

describe("[RULE] constant-candidates: Rejections", function() {
    it("should reject private string state variable without mutation", function(done) {
        let code = toContract("string private testVar = 'test';"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "The state variable 'testVar' could be constant.");

        Solium.reset();

        done();
    });
});

describe("[RULE] constant-candidates: Rejections", function() {
    it("should reject private numeric operation state variable without mutation", function(done) {
        let code = toContract("uint private testVar = 1 * 1 + 5;"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "The state variable 'testVar' could be constant.");

        Solium.reset();

        done();
    });
});

describe("[RULE] constant-candidates: Rejections", function() {
    it("should reject private keccak256 state variable without mutation", function(done) {
        let code = toContract("bytes32 private testVar = keccak256('test');"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "The state variable 'testVar' could be constant.");

        Solium.reset();

        done();
    });
});

describe("[RULE] constant-candidates: Rejections", function() {
    it("should reject private sha256 state variable without mutation", function(done) {
        let code = toContract("bytes32 private testVar = sha256('test');"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "The state variable 'testVar' could be constant.");

        Solium.reset();

        done();
    });
});

describe("[RULE] constant-candidates: Rejections", function() {
    it("should reject private ripemd160 state variable without mutation", function(done) {
        let code = toContract("bytes32 private testVar = ripemd160('test');"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "The state variable 'testVar' could be constant.");

        Solium.reset();

        done();
    });
});

describe("[RULE] constant-candidates: Rejections", function() {
    it("should reject private ecrecover state variable without mutation", function(done) {
        let code = toContract("address private testVar = ecrecover('dummy', 1, 'dummy', 'dummy');"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "The state variable 'testVar' could be constant.");

        Solium.reset();

        done();
    });
});

describe("[RULE] constant-candidates: Rejections", function() {
    it("should reject private addmod state variable without mutation", function(done) {
        let code = toContract("uint256 private testVar = addmod(1, 1, 1);"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "The state variable 'testVar' could be constant.");

        Solium.reset();

        done();
    });
});

describe("[RULE] constant-candidates: Rejections", function() {
    it("should reject private mulmod state variable without mutation", function(done) {
        let code = toContract("uint256 private testVar = mulmod(1, 1, 1);"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "The state variable 'testVar' could be constant.");

        Solium.reset();

        done();
    });
});
