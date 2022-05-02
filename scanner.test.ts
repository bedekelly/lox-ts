import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { scanTokens } from "./scanner.ts";
import { Token } from "./Token.ts";

Deno.test("Scanner scans single characers correctly", () => {
  assertEquals<Token[]>(scanTokens(".!."), [
    { type: "DOT", lexeme: ".", line: 1, literal: null },
    { type: "NOT", lexeme: "!", line: 1, literal: null },
    { type: "DOT", lexeme: ".", line: 1, literal: null },
    { type: "EOF", lexeme: "", line: 1, literal: null },
  ]);
});

Deno.test("Scanner scans ==! correctly (mix of double and single)", () => {
  assertEquals<Token[]>(scanTokens("==!"), [
    { type: "EQUAL", lexeme: "==", line: 1, literal: null },
    { type: "NOT", lexeme: "!", line: 1, literal: null },
    { type: "EOF", lexeme: "", line: 1, literal: null },
  ]);
});

Deno.test("Scanner scans !== correctly (mix of double and single)", () => {
  assertEquals<Token[]>(scanTokens("!=="), [
    { type: "NOT_EQUAL", lexeme: "!=", line: 1, literal: null },
    { type: "GETS", lexeme: "=", line: 1, literal: null },
    { type: "EOF", lexeme: "", line: 1, literal: null },
  ]);
});

Deno.test("Scanner skips comments correctly", () => {
  assertEquals<Token[]>(scanTokens(".!//@.!"), [
    { type: "DOT", lexeme: ".", line: 1, literal: null },
    { type: "NOT", lexeme: "!", line: 1, literal: null },
    { type: "EOF", lexeme: "", line: 1, literal: null },
  ]);
});

Deno.test("Scanner skips whitespace correctly", () => {
  assertEquals<Token[]>(scanTokens(". \t   !  \r / \n  //@.!"), [
    { type: "DOT", lexeme: ".", line: 1, literal: null },
    { type: "NOT", lexeme: "!", line: 1, literal: null },
    { type: "SLASH", lexeme: "/", line: 1, literal: null },
    { type: "EOF", lexeme: "", line: 2, literal: null },
  ]);
});

Deno.test("Comments and slashes are differentiated", () => {
  assertEquals<Token[]>(scanTokens("/ / // / //"), [
    { type: "SLASH", lexeme: "/", line: 1, literal: null },
    { type: "SLASH", lexeme: "/", line: 1, literal: null },
    { type: "EOF", lexeme: "", line: 1, literal: null },
  ]);
});

Deno.test("Scanner gets braces and parens correct", () => {
  assertEquals<Token[]>(scanTokens("{} ()"), [
    { type: "LEFT_BRACE", lexeme: "{", line: 1, literal: null },
    { type: "RIGHT_BRACE", lexeme: "}", line: 1, literal: null },
    { type: "LEFT_PAREN", lexeme: "(", line: 1, literal: null },
    { type: "RIGHT_PAREN", lexeme: ")", line: 1, literal: null },
    { type: "EOF", lexeme: "", line: 1, literal: null },
  ]);
});

Deno.test("Scanner gets lines correct", () => {
  assertEquals<Token[]>(
    scanTokens(
      `{
      (
        {

        }
      )
    }
    `
    ),
    [
      { type: "LEFT_BRACE", lexeme: "{", line: 1, literal: null },
      { type: "LEFT_PAREN", lexeme: "(", line: 2, literal: null },
      { type: "LEFT_BRACE", lexeme: "{", line: 3, literal: null },
      { type: "RIGHT_BRACE", lexeme: "}", line: 5, literal: null },
      { type: "RIGHT_PAREN", lexeme: ")", line: 6, literal: null },
      { type: "RIGHT_BRACE", lexeme: "}", line: 7, literal: null },
      { type: "EOF", lexeme: "", line: 8, literal: null },
    ]
  );
});

Deno.test("Scanner gets maths symbols correct", () => {
  assertEquals<Token[]>(scanTokens("+ - / *"), [
    { type: "PLUS", lexeme: "+", line: 1, literal: null },
    { type: "MINUS", lexeme: "-", line: 1, literal: null },
    { type: "SLASH", lexeme: "/", line: 1, literal: null },
    { type: "STAR", lexeme: "*", line: 1, literal: null },
    { type: "EOF", lexeme: "", line: 1, literal: null },
  ]);
});

Deno.test("Scanner supports string literals", () => {
  assertEquals<Token[]>(scanTokens(`"hello, world!"`), [
    {
      type: "STRING",
      lexeme: '"hello, world!"',
      line: 1,
      literal: "hello, world!",
    },
    { type: "EOF", lexeme: "", line: 1, literal: null },
  ]);
});

Deno.test("Scanner supports multiline strings", () => {
  assertEquals<Token[]>(
    scanTokens(`"one
two"`),
    [
      {
        type: "STRING",
        lexeme: '"one\ntwo"',
        line: 1,
        literal: "one\ntwo",
      },
      { type: "EOF", lexeme: "", line: 1, literal: null },
    ]
  );
});

Deno.test("Scanner supports number literals", () => {
  assertEquals<Token[]>(scanTokens("123 234 12.43 130.001"), [
    {
      type: "NUMBER",
      lexeme: "123",
      line: 1,
      literal: 123,
    },
    {
      type: "NUMBER",
      lexeme: "234",
      line: 1,
      literal: 234,
    },
    {
      type: "NUMBER",
      lexeme: "12.43",
      line: 1,
      literal: 12.43,
    },
    {
      type: "NUMBER",
      lexeme: "130.001",
      line: 1,
      literal: 130.001,
    },
    { type: "EOF", lexeme: "", line: 1, literal: null },
  ]);
});

Deno.test("Scanner recognises identifiers", () => {
  assertEquals<Token[]>(scanTokens("one two2 three_3"), [
    {
      type: "IDENTIFIER",
      lexeme: "one",
      line: 1,
      literal: null,
    },
    {
      type: "IDENTIFIER",
      lexeme: "two2",
      line: 1,
      literal: null,
    },
    {
      type: "IDENTIFIER",
      lexeme: "three_3",
      line: 1,
      literal: null,
    },
    { type: "EOF", lexeme: "", line: 1, literal: null },
  ]);
});

Deno.test("Scanner recognises reserved keywords", () => {
  assertEquals<Token[]>(scanTokens("and class else"), [
    {
      type: "AND",
      lexeme: "and",
      line: 1,
      literal: null,
    },
    {
      type: "CLASS",
      lexeme: "class",
      line: 1,
      literal: null,
    },
    {
      type: "ELSE",
      lexeme: "else",
      line: 1,
      literal: null,
    },
    { type: "EOF", lexeme: "", line: 1, literal: null },
  ]);
});

Deno.test("Scanner handles multiline comments", () => {
  assertEquals<Token[]>(
    scanTokens(`1 2 /* 3 */ 4
  /*
  5
  */
 6`),
    [
      {
        type: "NUMBER",
        lexeme: "1",
        line: 1,
        literal: 1,
      },
      {
        type: "NUMBER",
        lexeme: "2",
        line: 1,
        literal: 2,
      },
      {
        type: "NUMBER",
        lexeme: "4",
        line: 1,
        literal: 4,
      },
      {
        type: "NUMBER",
        lexeme: "6",
        line: 5,
        literal: 6,
      },

      { type: "EOF", lexeme: "", line: 5, literal: null },
    ]
  );
});

Deno.test("Scanner handles nested multiline comments", () => {
  assertEquals<Token[]>(
    scanTokens(`1 2 /* 3 */ 4
  /*
  5
  /*
  86
  */
   82
  */
 6`),
    [
      {
        type: "NUMBER",
        lexeme: "1",
        line: 1,
        literal: 1,
      },
      {
        type: "NUMBER",
        lexeme: "2",
        line: 1,
        literal: 2,
      },
      {
        type: "NUMBER",
        lexeme: "4",
        line: 1,
        literal: 4,
      },
      {
        type: "NUMBER",
        lexeme: "6",
        line: 9,
        literal: 6,
      },

      { type: "EOF", lexeme: "", line: 9, literal: null },
    ]
  );
});
