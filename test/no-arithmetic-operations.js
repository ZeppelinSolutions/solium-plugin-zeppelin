/**
 * @fileoverview Tests for no-arithmetic-operations rule
 */

"use strict";

let Solium = require("solium");
let wrappers = require("./utils/wrappers");
let toContract = wrappers.toContract;

let userConfig = {
    rules: {
        "zeppelin/no-arithmetic-operations": 1
    }
};

describe("[RULE] no-arithmetic-operations: Rejections", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should reject contracts using * operator", function(done) {
        let code = toContract("function test_sum () { uint a = 4 * 2; }"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        done();
    });

    it("should reject contracts using / operator", function(done) {
        let code = toContract("function test_sum () { uint a = 4 / 2; }"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        done();
    });


    it("should reject contracts using - operator", function(done) {
        let code = toContract("function test_sum () { uint a = 4 - 2; }"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        done();
    });

    it("should reject contracts using + operator", function(done) {
        let code = toContract("function test_sum () { uint a = 4 + 2; }"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        done();
    });
});
