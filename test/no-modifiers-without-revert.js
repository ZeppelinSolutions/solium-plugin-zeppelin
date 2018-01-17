/**
 * @fileoverview Tests for no-unused-imports rule
 */

"use strict";

let Solium = require("solium");
let wrappers = require("./utils/wrappers");
let addPragma = wrappers.addPragma;

let userConfig = {
    rules: {
        "zeppelin/no-modifiers-without-revert": 1
    }
};

describe("[RULE] no-modifiers-without-revert: Acceptances", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept modifier with require call", function(done) {
        let code = "contract Dummy {\n" +
            "modifier testModifier {\n" +
            "    require('dummy' == 'dummy');\n" +
            "    _;\n" +
            "}}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept modifier with revert call", function(done) {
        let code = "contract Dummy {\n" +
            "modifier testModifier {\n" +
            "    if ('dummy' == 'dummy') {\n" +
            "        revert();\n" +
            "    }\n" +
            "    _;\n" +
            "}}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });
});

describe("[RULE] no-modifiers-without-revert: Rejections", function() {
    it("should reject modifiers without revert", function(done) {
        let code = "contract Dummy {\n" +
            "modifier testModifier {\n" +
            "    _;\n" +
            "}}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "Modifier 'testModifier' without revert.");

        Solium.reset();

        done();
    });
});
