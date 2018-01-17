/**
 * @fileoverview Tests for no-unused-imports rule
 */

"use strict";

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
        let code = "import {TestImportedContract} from './Dummy.sol';\n" +
            "contract Dummy is TestImportedContract {}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept imported symbol used in multiple inheritance", function(done) {
        let code = "import {TestImportedContract} from './Dummy.sol';\n" +
            "contract Dummy1 is Dummy2, TestImportedContract {}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept multiple imported symbols used in inheritance", function(done) {
        let code = "import {TestImportedContract1, TestImportedContract2} from './Dummy.sol';\n" +
            "contract Dummy is TestImportedContract1, TestImportedContract2 {}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept imported symbol used in alias", function(done) {
        let code = "import {Dummy as TestImportedContract} from './Dummy.sol';\n" +
            "contract Dummy is TestImportedContract {}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept imported symbol with member used", function(done) {
        let code = "import {TestImportedContract} from './Dummy.sol';\n" +
            "contract Dummy {int dummy = TestImportedContract.dummy();}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept library in using", function(done) {
        let code = "import {TestImportedLibrary} from './Dummy.sol';\n" +
            "contract Dummy {using TestImportedLibrary for Dummy;}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept contract from global import", function(done) {
        let importedCode = "contract TestImportedContract {}";
        fs.writeFileSync("test-tmp/TestImported.sol", addPragma(importedCode));
        let importCode = "import './test-tmp/TestImported.sol';\n" +
            "contract Dummy is TestImportedContract {}",
            errors = Solium.lint(addPragma(importCode), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept interface from global import", function(done) {
        let importedCode = "interface TestImportedInterface {}";
        fs.writeFileSync("test-tmp/TestImported.sol", addPragma(importedCode));
        let importCode = "import './test-tmp/TestImported.sol';\n" +
            "contract Dummy is TestImportedInterface {}",
            errors = Solium.lint(addPragma(importCode), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept library from global import", function(done) {
        let importedCode = "library TestLibrary {}";
        fs.writeFileSync("test-tmp/TestImported.sol", addPragma(importedCode));
        let importCode = "import './test-tmp/TestImported.sol';\n" +
            "contract Dummy {\n" +
            "    TestLibrary.Dummy dummy;\n" +
            "}",
            errors = Solium.lint(addPragma(importCode), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        done();
    });

    it("should accept global import with some unused symbols", function(done) {
        let importedCode = "contract TestImportedContract1 {}\n" +
            "contract TestImportedContract2 {}";
        fs.writeFileSync("test-tmp/TestImported.sol", addPragma(importedCode));
        let importCode = "import './test-tmp/TestImported.sol';\n" +
            "contract Dummy is TestImportedContract1 {}",
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
        let code = "import {TestImportedContract} from './TestFile.sol';\n" +
            "contract Dummy {}",
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
        let importCode = "import './test-tmp/TestImported.sol';\n" +
            "contract Dummy {}",
            errors = Solium.lint(addPragma(importCode), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "Unused imported symbol 'TestImportedContract' from './test-tmp/TestImported.sol'.");

        done();
    });
});
