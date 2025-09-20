import fs from "fs";
import { Lexer } from "./Lexer.js";
import { Reportes } from "./Reportes.js";

const entrada = fs.readFileSync("../Entradas/entry1.txt", "utf8");

const lexer = new Lexer(entrada);
const resultado = lexer.analizar();

console.log("========= Tokens generados =========");
console.table(resultado.tokens);

if (resultado.errores.length > 0) {
  console.log("========= Errores Léxicos =========");
  console.table(resultado.errores);
} else {
  console.log("No se encontraron errores léxicos.");
}

Reportes.generarTokensHTML(resultado.tokens, "../reportes/tokens.html");
Reportes.generarErroresHTML(resultado.errores, "../reportes/errores.html");

console.log("Reportes generados en la carpeta reportes/");
