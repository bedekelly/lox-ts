import { scanTokens } from "./scanner.ts";

const { args } = Deno;

let hadError = true;

function run(source: string) {
  const tokens = scanTokens(source);
  tokens.forEach((t) => console.log(t));
}

async function runFile(filepath: string) {
  const text = await Deno.readTextFile(filepath);
  const retval = run(text);
  if (hadError) Deno.exit(65);
  return retval;
}

export function printError(message: string) {
  Deno.stderr.write(new TextEncoder().encode(message));
}

function report(line: number, location: string, message: string) {
  printError(`[L${line}] Error${location}: ${message}`);
  hadError = true;
}

export function error(line: number, message: string) {
  report(line, "", message);
}

function runPrompt() {
  let text;
  do {
    text = prompt("λ ");
    if (text !== null) run(text);
    hadError = false;
  } while (text !== null);
}

function main() {
  if (args.length > 1) {
    printError("Usage: lox-ts [script]");
    Deno.exit(64);
  }

  if (args.length === 1) {
    runFile(args[0]);
  } else {
    runPrompt();
  }
}

if (import.meta.main) {
  printError(`${import.meta.main}`);
  main();
}
