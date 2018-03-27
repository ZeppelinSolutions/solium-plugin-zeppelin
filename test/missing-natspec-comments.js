/**
 * @fileoverview Tests for missing-natspec-comments rule
 */

"use strict";

let dedent = require("dedent");
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

            dedent`
                /// @title valid natspec comment
                contract Dummy {
                    function TestStatement() {}
                }`
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
            dedent`
                // Not a natspec comment.
                contract TestStatement {}`,

            dedent`
                /*
                 * Not a natspec comment.
                 */
                contract TestStatement {}`,

            dedent`
                // Not a natspec comment.
                interface TestStatement {}`,

            dedent`
                /*
                 * Not a natspec comment.
                 */
                interface TestStatement {}`,

            dedent`
                // Not a natspec comment.
                library TestStatement {}`,

            dedent`
                /*
                 * Not a natspec comment.
                 */
                library TestStatement {}`,

            dedent`
                /// @title valid natspec comment.
                contract DummyContract {
                    // Not a natspec comment.
                    function TestStatement() {}
                }`,

            dedent`
                /// @title valid natspec comment.
                contract DummyContract {
                    /*
                     * Not a natspec comment.
                     */
                    function TestStatement() {}
                }`
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
            dedent`
                /// Natspec comment without title.
                contract TestStatement {}`,

            dedent`
               /**
                * Natspec comment without title.
                */
               contract TestStatement {}`,

            dedent`
                /// Natspec comment without title.
                interface TestStatement {}`,

            dedent`
                /**
                 * Natspec comment without title.
                 */
                interface TestStatement {}`,

            dedent`
                /// Natspec comment without title.
                library TestStatement {}`,

            dedent`
                /**
                 * Natspec comment without title.
                 */
                library TestStatement {}`
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
            dedent`
                /// @title Natspec comment with title.
                contract TestContract {}`,

            dedent`
                /// @title Natspec comment with title.
                /// extra comment.
                contract TestContract {}`,

            dedent`
                /**
                 * @title Natspec comment with title.
                 */
                contract TestContract {}`,

            dedent`
                /// @title Natspec comment with title.
                interface TestStatement {}`,

            dedent`
                /**
                 * @title Natspec comment with title.
                 */
                interface TestStatement {}`,

            dedent`
                /// @title Natspec comment with title.
                library TestStatement {}`,

            dedent`
                /**
                 * @title Natspec comment with title.
                 */
                library TestStatement {}`,

            dedent`
                /// @title valid natspec comment.
                contract DummyContract {
                    /// @title Natspec comment with title
                    function TestStatement() {}
                }`,

            dedent`
                /// @title valid natspec comment.
                contract DummyContract {
                    /**
                     * @title Natspec comment with title.
                     */
                    function TestStatement() {}
                }`
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
            dedent`
                /// @title dummy comment.
                contract DummyContract {
                    /// Natspec comment without title
                    function TestStatement() {}
                }`,

            dedent`
                /// @title dummy comment.
                contract DummyContract {
                    /**
                     * Natspec comment without title.
                     */
                    function TestStatement() {}
                }`
        ];
        scenarios.forEach(code => {
            let errors = Solium.lint(addPragma(code), userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(0);
        });

        done();
    });

});
