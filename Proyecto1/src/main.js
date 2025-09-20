import fs from "fs";
import { Lexer } from "./Lexer.js";

const entrada = fs.readFileSync("../Entradas/entry1.txt", "utf8");

const lexer = new Lexer(entrada);
const tokens = lexer.analizar();

console.log("========= Tokens generados =========");
console.table(tokens);
