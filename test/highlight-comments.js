/**
 * @fileoverview Tests for highlight-comments rule
 */

"use strict";

let Solium = require("solium");
let wrappers = require("./utils/wrappers");
let addPragma = wrappers.addPragma;

let userConfig = {
    rules: {
        "zeppelin/highlight-comments": 1
    }
};

describe("[RULE] highlight-comments: Rejections", function() {
    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should comments with highlights", function(done) {
        let scenarios = [
            {
                highlightComment: "AUDIT",
                code: "// AUDIT dummy comment."
            }, {
                highlightComment: "AUDIT",
                code: "/* AUDIT dummy comment.\n*/"
            }, {
                highlightComment: "FIXME",
                code: "// FIXME dummy comment."
            }, {
                highlightComment: "FIXME",
                code: "/* FIXME dummy comment.\n*/"
            }, {
                highlightComment: "TODO",
                code: "// TODO dummy comment."
            }, {
                highlightComment: "TODO",
                code: "/* TODO dummy comment.\n*/"
            }, {
                highlightComment: "XXX",
                code: "// XXX dummy comment."
            }, {
                highlightComment: "XXX",
                code: "/* XXX dummy comment.\n*/"
            }
        ];
        scenarios.forEach(scenario => {
            let errors = Solium.lint(addPragma(scenario.code), userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(1);
            errors[0].message.should.equal(`'${scenario.highlightComment}' comment.`);
        });

        done();
    });
});

describe("[RULE] highlight-comments: Acceptances", function() {
    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept comments without highlights", function(done) {
        let scenarios = [
            "// dummy comment.",
            "/* dummy comment.\n*/"
        ];

        scenarios.forEach(code => {
            let errors = Solium.lint(addPragma(code), userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(0);
        });

        done();
    });
});
