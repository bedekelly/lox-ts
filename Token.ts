type TokenLiteralType = "IDENTIFIER" | "STRING" | "NUMBER";

type TokenKeyword =
  | "AND"
  | "CLASS"
  | "ELSE"
  | "FALSE"
  | "FUN"
  | "FOR"
  | "IF"
  | "NIL"
  | "OR"
  | "PRINT"
  | "RETURN"
  | "SUPER"
  | "THIS"
  | "TRUE"
  | "VAR"
  | "WHILE";

export type TokenType =
  // Brackets:
  | "LEFT_PAREN"
  | "RIGHT_PAREN"
  | "LEFT_BRACE"
  | "RIGHT_BRACE"

  // Punctuation:
  | "COMMA"
  | "DOT"
  | "MINUS"
  | "PLUS"
  | "SEMICOLON"
  | "SLASH"
  | "STAR"

  // Comparison/assignment tokens
  | "NOT"
  | "NOT_EQUAL"
  | "EQUAL"
  | "GREATER"
  | "GREATER_EQUAL"
  | "LESS"
  | "LESS_EQUAL"
  | "GETS"

  // More useful types.
  | TokenLiteralType
  | TokenKeyword

  // Misc.
  | "EOF";

export type Token = {
  type: TokenType;
  lexeme: string;
  literal: unknown | null;
  line: number;
};
