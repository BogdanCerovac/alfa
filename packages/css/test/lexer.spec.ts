import { test, Test } from "@alfa/test";
import { WithLocation } from "@alfa/lang";
import { CssToken, lex } from "../src/lexer";

async function css(
  t: Test,
  input: string,
  expected: Array<WithLocation<CssToken>>
) {
  t.deepEqual(lex(input), expected);
}

test("Can lex whitespace", async t =>
  css(t, "  \n \t", [
    {
      type: "whitespace",
      location: {
        start: { line: 0, column: 0 },
        end: { line: 1, column: 2 }
      }
    }
  ]));

test("Can lex a comment", async t =>
  css(t, "/*Hello world*/", [
    {
      type: "comment",
      value: "Hello world",
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 15 }
      }
    }
  ]));

test("Can lex an ident", async t =>
  css(t, "foo", [
    {
      type: "ident",
      value: "foo",
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 3 }
      }
    }
  ]));

test("Can lex an ident prefixed with a single hyphen", async t =>
  css(t, "-foo", [
    {
      type: "ident",
      value: "-foo",
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 4 }
      }
    }
  ]));

test("Can lex an ident containing an underscore", async t =>
  css(t, "foo_bar", [
    {
      type: "ident",
      value: "foo_bar",
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 7 }
      }
    }
  ]));

test("Can lex an ident containing a hyphen", async t =>
  css(t, "foo-bar", [
    {
      type: "ident",
      value: "foo-bar",
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 7 }
      }
    }
  ]));

test("Can lex a double quoted string", async t =>
  css(t, '"foo"', [
    {
      type: "string",
      value: "foo",
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 5 }
      }
    }
  ]));

test("Can lex a single quoted string", async t =>
  css(t, "'foo'", [
    {
      type: "string",
      value: "foo",
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 5 }
      }
    }
  ]));

test("Can lex an integer", async t =>
  css(t, "123", [
    {
      type: "number",
      value: 123,
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 3 }
      }
    }
  ]));

test("Can lex a decimal", async t =>
  css(t, "123.456", [
    {
      type: "number",
      value: 123.456,
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 7 }
      }
    }
  ]));

test("Can lex a number in E-notation", async t =>
  css(t, "123.456e2", [
    {
      type: "number",
      value: 123.456e2,
      location: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 9 }
      }
    }
  ]));
