# Lox (TS)

Implementing Lox from [Crafting Interpreters](https://craftinginterpreters.com) in TypeScript!

Crafting Interpreters is a fantastic online book describing the implementation of a programming language: from writing a lexer, to a parser, to a bytecode VM in C. The first half of the book is in Java, so I'm translating it to TypeScript. Most of the time, it's not necessary or idiomatic to use classes in the same way, so I'm translating where appropriate into a more function/module oriented style.

So far, it's got a reasonable lexer following the implementation in the book, plus multiline comments which allow for nesting. I've been adding test cases throughout.

Current chapter: **5**.