/**
 * @fileoverview Tests for missing-natspec-comments rule
 */

"use strict";

let Solium = require("solium");
let wrappers = require("./utils/wrappers");
let addPragma = wrappers.addPragma;

let userConfig = {
    rules: {
        "zeppelin/missing-natspec-comments": 1
    }
};

describe("[RULE] missing-natspec-comments: Rejections", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should reject statements without comments", function(done) {
        let scenarios = [
            "contract TestStatement {}",

            "interface TestStatement {}",

            "library TestStatement {}",

            "/// @title valid natspec comment\n" +
            "contract Dummy {\n" +
            "    function TestStatement() {}\n" +
            "}"
        ];
        scenarios.forEach(code => {
            let errors = Solium.lint(addPragma(code), userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(1);
            errors[0].message.should.equal("'TestStatement' has no comment.");
        });

        done();
    });


    it("should reject statements without natspec comments", function(done) {
        let scenarios = [
            "// Not a natspec comment.\n" +
            "contract TestStatement {}",

            "/*\n" +
            " Not a natspec comment.\n" +
            " */\n" +
            "contract TestStatement {}",

            "// Not a natspec comment.\n" +
            "interface TestStatement {}",

            "/*\n" +
            " Not a natspec comment.\n" +
           " */\n" +
            "interface TestStatement {}",

            "// Not a natspec comment.\n" +
            "library TestStatement {}",

            "/*\n" +
            " Not a natspec comment.\n" +
            " */\n" +
            "library TestStatement {}",

            "/// @title valid natspec comment.\n" +
            "contract DummyContract {\n" +
            "    // Not a natspec comment.\n" +
            "    function TestStatement() {}\n" +
            "}",

            "/// @title valid natspec comment.\n" +
            "contract DummyContract {\n" +
            "    /*\n" +
            "     Not a natspec comment.\n" +
            "     */\n" +
            "    function TestStatement() {}\n" +
            "}"
        ];
        scenarios.forEach(code => {
            let errors = Solium.lint(addPragma(code), userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(1);
            errors[0].message.should.equal(
                "'TestStatement' has no natspec comment.");
        });

        done();
    });

    it("should reject statements without natspec title", function(done) {
        let scenarios = [
            "/// Natspec comment without title.\n" +
            "contract TestStatement {}",

            "/**\n" +
            " Natspec comment without title.\n" +
            " */\n" +
            "contract TestStatement {}",

            "/// Natspec comment without title.\n" +
            "interface TestStatement {}",

            "/**\n" +
            " Natspec comment without title.\n" +
           " */\n" +
            "interface TestStatement {}",

            "/// Natspec comment without title.\n" +
            "library TestStatement {}",

            "/**\n" +
            " Natspec comment without title.\n" +
            " */\n" +
            "library TestStatement {}"
        ];
        scenarios.forEach(code => {
            let errors = Solium.lint(addPragma(code), userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(1);
            errors[0].message.should.equal(
                "'TestStatement' has no natspec title comment.");
        });

        done();
    });

});

describe("[RULE] missing-natspec-comments: Acceptances", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept statements with natspec title", function(done) {
        let scenarios = [
            "/// @title Natspec comment with title.\n" +
            "contract TestContract {}",

            "/// @title Natspec comment with title.\n" +
            "/// extra comment.\n" +
            "contract TestContract {}\n" +

            "/**\n" +
            " @title Natspec comment with title.\n" +
            " */\n" +
            "contract TestContract {}",

            "/// @title Natspec comment with title.\n" +
            "interface TestStatement {}",

            "/**\n" +
            " @title Natspec comment with title.\n" +
           " */\n" +
            "interface TestStatement {}",

            "/// @title Natspec comment with title.\n" +
            "library TestStatement {}",

            "/**\n" +
            " @title Natspec comment with title.\n" +
            " */\n" +
            "library TestStatement {}",

            "/// @title valid natspec comment.\n" +
            "contract DummyContract {\n" +
            "    /// @title Natspec comment with title\n" +
            "    function TestStatement() {}\n" +
            "}",

            "/// @title valid natspec comment.\n" +
            "contract DummyContract {\n" +
            "    /**\n" +
            "     @title Natspec comment with title.\n" +
            "    */\n" +
            "    function TestStatement() {}\n" +
            "}"
        ];
        scenarios.forEach(code => {
            let errors = Solium.lint(addPragma(code), userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(0);
        });

        done();
    });

    // Regression test for
    // https://github.com/OpenZeppelin/solium-plugin-zeppelin/issues/24
    it("should accept functions without natspec title", function(done) {
        let scenarios = [
            "/// @title dummy comment.\n" +
            "contract DummyContract {\n" +
            "    /// Natspec comment without title\n" +
            "    function TestStatement() {}\n" +
            "}",

            "/// @title dummy comment.\n" +
            "contract DummyContract {\n" +
            "    /**\n" +
            "     Natspec comment without title.\n" +
            "     */\n" +
            "    function TestStatement() {}\n" +
            "}"
        ];
        scenarios.forEach(code => {
            let errors = Solium.lint(addPragma(code), userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(0);
        });

        done();
    });

});
