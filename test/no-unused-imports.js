/**
 * @fileoverview Tests for no-unused-imports rule
 */

"use strict";

let dedent = require("dedent");
let fs = require("fs");
let rimraf = require("rimraf");
let Solium = require("solium");
let wrappers = require("./utils/wrappers");
let addPragma = wrappers.addPragma;


let userConfig = {
    rules: {
        "zeppelin/no-unused-imports": 1
    }
};

describe("[RULE] no-unused-imports: Acceptances", function() {

    beforeEach(function(done) {
        fs.mkdir("test-tmp", done);
    });

    afterEach(function(done) {
        Solium.reset();

        rimraf("test-tmp", done);
    });

    it("should accept imported symbol used in inheritance", function(done) {
        let code = dedent`
                import {TestImportedContract} from './Dummy.sol';
                contract Dummy is TestImportedContract {}`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept imported symbol used in multiple inheritance", function(done) {
        let code = dedent`
                import {TestImportedContract} from './Dummy.sol';
                contract Dummy1 is Dummy2, TestImportedContract {}`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept multiple imported symbols used in inheritance", function(done) {
        let code = dedent`
            import {TestImportedContract1, TestImportedContract2} from './Dummy.sol';
            contract Dummy is TestImportedContract1, TestImportedContract2 {}`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept imported symbol used in alias", function(done) {
        let code = dedent`
                import {Dummy as TestImportedContract} from './Dummy.sol';
                contract Dummy is TestImportedContract {}`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept imported symbol with member used", function(done) {
        let code = dedent`
                import {TestImportedContract} from './Dummy.sol';
                contract Dummy {int dummy = TestImportedContract.dummy();}`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept library in using", function(done) {
        let code = dedent`
                import {TestImportedLibrary} from './Dummy.sol';
                contract Dummy {using TestImportedLibrary for Dummy;}`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept contract from global import", function(done) {
        let importedCode = "contract TestImportedContract {}";
        fs.writeFileSync("test-tmp/TestImported.sol", addPragma(importedCode));
        let importCode = dedent`
                import './test-tmp/TestImported.sol';
                contract Dummy is TestImportedContract {}`,
            errors = Solium.lint(addPragma(importCode), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept interface from global import", function(done) {
        let importedCode = "interface TestImportedInterface {}";
        fs.writeFileSync("test-tmp/TestImported.sol", addPragma(importedCode));
        let importCode = dedent`
                import './test-tmp/TestImported.sol';
                contract Dummy is TestImportedInterface {}`,
            errors = Solium.lint(addPragma(importCode), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept library from global import", function(done) {
        let importedCode = "library TestLibrary {}";
        fs.writeFileSync("test-tmp/TestImported.sol", addPragma(importedCode));
        let importCode = dedent`
            import './test-tmp/TestImported.sol';
            contract Dummy {
                TestLibrary.Dummy dummy;
            }`,
            errors = Solium.lint(addPragma(importCode), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept global import with some unused symbols", function(done) {
        let importedCode = dedent`
            contract TestImportedContract1 {}
            contract TestImportedContract2 {}`;
        fs.writeFileSync("test-tmp/TestImported.sol", addPragma(importedCode));
        let importCode = dedent`
            import './test-tmp/TestImported.sol';
            contract Dummy is TestImportedContract1 {}`,
            errors = Solium.lint(addPragma(importCode), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should ignore global import of unexisting file", function(done) {
        let importCode = "import './TestUnexistingImported.sol';",
            errors = Solium.lint(addPragma(importCode), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });
});

describe("[RULE] no-unused-imports: Rejections", function() {

    beforeEach(function(done) {
        fs.mkdir("test-tmp", done);
    });

    afterEach(function(done) {
        Solium.reset();

        rimraf("test-tmp", done);
    });


    it("should reject contracts with unused imported symbols", function(done) {
        let code = dedent`
            import {TestImportedContract} from './TestFile.sol';
            contract Dummy {}`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "Unused imported symbol 'TestImportedContract' from './TestFile.sol'.");

        done();
    });

    it("should reject unused contract from global import", function(done) {
        let importedCode = "contract TestImportedContract {}";
        fs.writeFileSync("test-tmp/TestImported.sol", addPragma(importedCode));
        let importCode = dedent`
            import './test-tmp/TestImported.sol';
            contract Dummy {}`,
            errors = Solium.lint(addPragma(importCode), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "Unused imported symbol 'TestImportedContract' from './test-tmp/TestImported.sol'.");

        done();
    });
});
