/**
 * @fileoverview Tests for no-unchecked-send rule
 */

"use strict";

let Solium = require("solium");
let wrappers = require("./utils/wrappers");
let toContract = wrappers.toContract;

let userConfig = {
    rules: {
        "zeppelin/no-unchecked-send": 1
    }
};

describe("[RULE] no-unchecked-send: Acceptances", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });


    it("should accept send call inside if", function(done) {
        let code = toContract("function test(address to) {\n" +
                              "    if (to.send()) { throw; }\n" +
                              "}"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });


    it("should accept negated send call inside if", function(done) {
        let code = toContract("function test(address to) {\n" +
                              "    if (!to.send()) { throw; }\n" +
                              "}"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept send call inside assert", function(done) {
        let code = toContract("function test(address to) {\n" +
                              "    assert(to.send());\n" +
                              "}"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept negated send call inside assert", function(done) {
        let code = toContract("function test(address to) {\n" +
                              "    assert(!to.send());\n" +
                              "}"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept send call inside require", function(done) {
        let code = toContract("function test(address to) {\n" +
                              "    require(to.send());\n" +
                              "}"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept negated send call inside require", function(done) {
        let code = toContract("function test(address to) {\n" +
                              "    require(!to.send());\n" +
                              "}"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });
});

describe("[RULE] no-unchecked-send: Rejections", function() {
    it("should reject unchecked send call", function(done) {
        let code = toContract("function test(address to) { to.send(); }"),
            errors = Solium.lint(code, userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });
});
