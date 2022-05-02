import { error } from "./Lox.ts";
import { Token, TokenType } from "./Token.ts";

const singleCharTokens: Record<string, TokenType> = {
  "(": "LEFT_PAREN",
  ")": "RIGHT_PAREN",
  "{": "LEFT_BRACE",
  "}": "RIGHT_BRACE",
  ",": "COMMA",
  ".": "DOT",
  "-": "MINUS",
  "+": "PLUS",
  ";": "SEMICOLON",
  "*": "STAR",
};

const keywords: Record<string, TokenType> = {
  and: "AND",
  class: "CLASS",
  else: "ELSE",
  false: "FALSE",
  for: "FOR",
  fun: "FUN",
  if: "IF",
  nil: "NIL",
  or: "OR",
  print: "PRINT",
  return: "RETURN",
  super: "SUPER",
  this: "THIS",
  true: "TRUE",
  var: "VAR",
  while: "WHILE",
};

const conditionalTokens: Record<string, [string, TokenType, TokenType]> = {
  "!": ["=", "NOT_EQUAL", "NOT"],
  "=": ["=", "EQUAL", "GETS"],
  "<": ["=", "LESS_EQUAL", "LESS"],
  ">": ["=", "GREATER_EQUAL", "GREATER"],
};

const isAlpha = (s: string) => s[0].match(/[A-Za-z]/) !== null;
const isNumeric = (s: string) => s[0].match(/\d/) !== null;
const isIdentifier = (s: string) => isAlpha(s) || isNumeric(s) || s === "_";

export function scanTokens(source: string): Token[] {
  const finalTokens: Token[] = [];

  let start = 0,
    current = 0,
    line = 1;

  // Will source[current] give us an error?
  function isAtEnd(): boolean {
    return current >= source.length;
  }

  // Return the next character and advance our current pointer.
  function advance(): string {
    const char = source[current++];
    if (char === "\n") line++;
    return char;
  }

  // IF the next character matches what we expect, munches it and returns true.
  function match(expected: string): boolean {
    if (peek() !== expected) return false;
    current++;
    return true;
  }

  // Get the next character without advancing.
  function peek() {
    if (isAtEnd()) return "\0";
    return source[current];
  }

  /**
   * Add a token (plus metadata) to the list of tokens.
   */
  function addToken(
    tokenType: TokenType,
    literal?: unknown,
    overrideLine?: number
  ) {
    const text = source.substring(start, current);

    line = overrideLine !== undefined ? overrideLine : line;
    finalTokens.push({
      type: tokenType,
      lexeme: text,
      literal: literal ?? null,
      line: line,
    });
  }

  // Consume a string.
  function string() {
    const startLine = line;
    while (peek() !== '"' && !isAtEnd()) {
      advance();
    }
    if (isAtEnd()) {
      error(line, "Unterminated string.");
      return;
    }

    // Consume the final " character.
    advance();

    // String value doesn't include the quotes.
    const value = source.substring(start + 1, current - 1);
    addToken("STRING", value, startLine);
  }

  // Is a character in the range 0-9?
  function isDigit(s: string): boolean {
    const ord = (s: string) => s.charCodeAt(0);
    return ord(s) >= ord("0") && ord(s) <= ord("9");
  }

  // Look at the next character without consuming it.
  function peekNext() {
    if (current + 1 >= source.length) return "\0";
    return source[current + 1];
  }

  // Consume a number.
  function number() {
    while (isDigit(peek())) advance();
    if (peek() === "." && isDigit(peekNext())) {
      advance();
      while (isDigit(peek())) advance();
    }
    const value = source.substring(start, current);
    addToken("NUMBER", parseFloat(value));
  }

  // Consume an identifier.
  function identifier() {
    while (isIdentifier(peek())) advance();
    const identifier = source.substring(start, current);
    const tokenType =
      identifier in keywords ? keywords[identifier] : "IDENTIFIER";
    addToken(tokenType);
  }

  // Consume a nested multiline comment (doesn't output any tokens).
  function multilineComment() {
    let nestingLevel = 1;
    while (nestingLevel > 0 && !isAtEnd()) {
      console.log({ peek: peek(), peekNext: peekNext(), nestingLevel });
      if (match("*") && peek() === "/") {
        nestingLevel--;
      } else if (match("/") && peek() === "*") {
        nestingLevel++;
      }
      advance();
    }
  }

  // Consume a whole token.
  function scanToken() {
    const char = advance();

    if (char in singleCharTokens) {
      addToken(singleCharTokens[char]);
    } else if (char in conditionalTokens) {
      const [nextChar, ifMatches, ifNotMatches] = conditionalTokens[char];
      addToken(match(nextChar) ? ifMatches : ifNotMatches);
    } else if (isNumeric(char)) {
      number();
    } else if (isAlpha(char)) {
      identifier();
    } else if (char === '"') {
      string();
    } else if (char === "/") {
      if (match("/")) {
        while (peek() !== "\n" && !isAtEnd()) advance();
      } else if (match("*")) {
        multilineComment();
      } else {
        addToken("SLASH");
      }
    } else if (![" ", "\r", "\t", "\n"].includes(char)) {
      error(line, `Unexpected character: ${char}`);
    }
  }

  while (!isAtEnd()) {
    start = current;
    scanToken();
  }

  finalTokens.push({
    type: "EOF",
    lexeme: "",
    literal: null,
    line: line,
  });

  return finalTokens;
}
