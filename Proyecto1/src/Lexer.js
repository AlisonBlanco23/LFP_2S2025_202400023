import { Token } from "./Token.js";

export class Lexer {
  constructor(texto) {
    this.texto = texto;
    this.pos = 0;
    this.linea = 1;
    this.columna = 1;
    this.tokens = [];
    this.errores = [];
  }

  analizar() {
    while (this.pos < this.texto.length) {
      let char = this.texto[this.pos];

      if (char === " " || char === "\t") {
        this.avanzar();
        continue;
      }

      if (char === "\n" || char === "\r") {
        this.linea++;
        this.columna = 1;
        this.pos++;
        continue;
      }

      if (char === "{") {
        this.agregarToken("LLAVE_IZQ", "{");
        this.avanzar();
        continue;
      }

      if (char === "}") {
        this.agregarToken("LLAVE_DER", "}");
        this.avanzar();
        continue;
      }

      if (char === "[") {
        this.agregarToken("CORCHETE_IZQ", "[");
        this.avanzar();
        continue;
      }

      if (char === "]") {
        this.agregarToken("CORCHETE_DER", "]");
        this.avanzar();
        continue;
      }

      if (char === ":") {
        this.agregarToken("DOS_PUNTOS", ":");
        this.avanzar();
        continue;
      }

      if (char === ",") {
        this.agregarToken("COMA", ",");
        this.avanzar();
        continue;
      }

      if (char === "\"") {
        let cadena = this.leerCadena();
        this.agregarToken("CADENA", cadena);
        continue;
      }

      if (this.esLetra(char)) {
        let palabra = this.leerPalabra();
        let tipo = this.clasificarPalabra(palabra);
        this.agregarToken(tipo, palabra);
        continue;
      }

      if (this.esNumero(char)) {
        let numero = this.leerNumero();
        this.agregarToken("NUMERO", numero);
        continue;
      }

      this.agregarError(char, "Token inválido", "Símbolo no reconocido");
      this.avanzar();
    }

    return { tokens: this.tokens, errores: this.errores };
  }

  avanzar() {
    this.pos++;
    this.columna++;
  }

  agregarToken(tipo, valor) {
    this.tokens.push(new Token(tipo, valor, this.linea, this.columna));
  }

  agregarError(lexema, tipo, descripcion) {
    this.errores.push({
      lexema: lexema,
      tipo: tipo,
      descripcion: descripcion,
      linea: this.linea,
      columna: this.columna
    });
  }

  leerCadena() {
    let resultado = "";
    this.avanzar(); 
    while (this.pos < this.texto.length && this.texto[this.pos] !== "\"") {
      resultado += this.texto[this.pos];
      this.avanzar();
    }
    this.avanzar();
    return resultado;
  }

  leerPalabra() {
    let resultado = "";
    while (this.pos < this.texto.length && this.esLetra(this.texto[this.pos])) {
      resultado += this.texto[this.pos];
      this.avanzar();
    }
    return resultado;
  }

  leerNumero() {
    let resultado = "";
    while (this.pos < this.texto.length && this.esNumero(this.texto[this.pos])) {
      resultado += this.texto[this.pos];
      this.avanzar();
    }
    return resultado;
  }

  esLetra(c) {
    return (c >= "A" && c <= "Z") || (c >= "a" && c <= "z") ||
           c === "Á" || c === "É" || c === "Í" || c === "Ó" || c === "Ú" || c === "Ñ" || c === "_";
  }

  esNumero(c) {
    return c >= "0" && c <= "9";
  }

  clasificarPalabra(palabra) {
    let reservadas = [
      "TORNEO","EQUIPOS","ELIMINACION","equipo","jugador","posicion","numero","edad",
      "partido","resultado","goleadores","goleador","minuto","vs","cuartos","semifinal",
      "final","nombre","sede","equipos"
    ];
    for (let i = 0; i < reservadas.length; i++) {
      if (palabra === reservadas[i]) {
        return "PALABRA_RESERVADA";
      }
    }
    return "IDENTIFICADOR";
  }
}
