/**
 * @fileoverview Tests for no-state-variable-shadowing rule
 */

"use strict";

let Solium = require("solium");
let wrappers = require("./utils/wrappers");
let addPragma = wrappers.addPragma;

let userConfig = {
    rules: {
        "zeppelin/no-state-variable-shadowing": 1
    }
};

describe("[RULE] no-state-variable-shadowing: Rejections", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should reject direct inheritance shadowing on same file", function(done) {
        let code = "contract TestParentContract {\n" +
            "    uint testVariable;\n" +
            "}\n" +
            "contract TestContract is TestParentContract {\n" +
            "    uint testVariable;\n" +
            "}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'TestContract' shadows the state variable 'testVariable' " +
                "defined in the parent contract 'TestParentContract'.");

        done();
    });

    it("should reject transitive inheritance shadowing on same file", function(done) {
        let code = "contract TestGrandParentContract {\n" +
            "    uint testVariable;\n" +
            "}\n" +
            "contract TestParentContract is TestGrandParentContract {}\n" +
            "contract TestContract is TestParentContract {\n" +
            "    uint testVariable;\n" +
            "}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "'TestContract' shadows the state variable 'testVariable' " +
                "defined in the parent contract 'TestGrandParentContract'.");

        done();
    });

});

describe("[RULE] no-state-variable-shadowing: Acceptances", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept contracts without inheritance", function(done) {
        let code = "contract TestContract {\n" +
            "    uint testVariable;\n" +
            "}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept contracts with inheritance without shadowing", function(done) {
        let code = "contract ParentTestContract {\n" +
            "    uint testVariable;\n" +
            "}\n" +
            "contract TestContract is ParentTestContract {\n" +
            "    uint testVariable2;\n" +
            "}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept contracts with transitive inheritance without shadowing", function(done) {
        let code = "contract GrandParentTestContract {\n" +
            "    uint testVariable;\n" +
            "}\n" +
            "contract ParentTestContract is GrandParentTestContract {\n" +
            "    uint testVariable2;\n" +
            "}\n" +
            "contract TestContract is ParentTestContract {\n" +
            "    uint testVariable3;\n" +
            "}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

});
