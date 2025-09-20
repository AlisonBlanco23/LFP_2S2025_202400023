class LexicalAnalyzer {
  constructor(input) {
    this.input = input || "";
    this.pos = 0;          
    this.line = 1;          
    this.col = 1;           
    this.tokens = [];      
    this.errors = [];       
    this.currentChar = '';  
  }

  advance() {
    if (this.pos >= this.input.length) return;
    this.currentChar = this.input.charAt(this.pos);
    this.pos++;
    this.col++;
    if (this.currentChar === '\n') {
      this.line++;
      this.col = 1;
    }
  }

  skipWhitespace() {
    while (this.pos < this.input.length && /\s/.test(this.input.charAt(this.pos))) {
      this.advance();
    }
  }

  addToken(type, lexeme) {
    this.tokens.push({
      number: this.tokens.length + 1,
      lexeme: lexeme,
      type: type,
      line: this.line,
      column: this.col - (lexeme.length || 1)
    });
  }

  addError(type, lexeme, description) {
    this.errors.push({
      number: this.errors.length + 1,
      lexeme: lexeme,
      type: type,
      description: description,
      line: this.line,
      column: this.col
    });
  }

  scanWord() {
    let start = this.pos - 1; 
    let word = '';
    while (this.pos < this.input.length && /[a-zA-Z]/.test(this.input.charAt(this.pos))) {
      word += this.input.charAt(this.pos);
      this.advance();
    }

    const keywordMap = {
      'TORNEO': 'Palabra Reservada',
      'EQUIPOS': 'Palabra Reservada',
      'ELIMINACION': 'Palabra Reservada',
      'equipo': 'Palabra Reservada',
      'jugador': 'Palabra Reservada',
      'partido': 'Palabra Reservada',
      'goleador': 'Palabra Reservada',
      'vs': 'Símbolo'
    };

    const attrMap = {
      'nombre': 'Atributo',
      'equipos': 'Atributo',
      'posicion': 'Atributo',
      'numero': 'Atributo',
      'edad': 'Atributo',
      'minuto': 'Atributo'
    };

    if (keywordMap[word]) {
      this.addToken(keywordMap[word], word);
    } else if (attrMap[word]) {
      this.addToken(attrMap[word], word);
    } else {
      this.addError('Token inválido', word, 'Palabra clave no reconocida');
    }
  }

  scanString() {
    this.advance(); 
    let str = '';
    while (this.pos < this.input.length && this.currentChar !== '"') {
      if (this.currentChar === '\n') {
        this.addError('Uso incorrecto de comillas', '"' + str + '"', 'Cadena sin cerrar');
        return;
      }
      str += this.currentChar;
      this.advance();
    }

    if (this.currentChar === '"') {
      this.advance(); 
      this.addToken('Cadena', '"' + str + '"');
    } else {
      this.addError('Falta de símbolo esperado', '"' + str, 'Corchete de cierre faltante');
    }
  }

  
  scanNumber() {
    let num = '';
    while (this.pos < this.input.length && /\d/.test(this.input.charAt(this.pos))) {
      num += this.input.charAt(this.pos);
      this.advance();
    }
    this.addToken('Número', num);
  }

  scanSymbol() {
    switch (this.currentChar) {
      case '{':
        this.addToken('Llave Izquierda', '{');
        break;
      case '}':
        this.addToken('Llave Derecha', '}');
        break;
      case '[':
        this.addToken('Corchete Izquierdo', '[');
        break;
      case ']':
        this.addToken('Corchete Derecho', ']');
        break;
      case ':':
        this.addToken('Dos Puntos', ':');
        break;
      case ',':
        this.addToken('Coma', ',');
        break;
      case '-':
        let next = this.input.charAt(this.pos + 1);
        if (next && /\d/.test(next)) {
          this.addToken('Guion', '-');
        } else {
          this.addError('Token inválido', '-', 'Símbolo no esperado');
        }
        break;
      default:
        this.addError('Token inválido', this.currentChar, 'Símbolo no reconocido');
    }
    this.advance();
  }

  scanResultado() {
    if (this.input.substring(this.pos, this.pos + 9) === 'Pendiente') {
      this.addToken('Resultado', 'Pendiente');
      this.pos += 9;
      this.col += 9;
      return;
    }

    let start = this.pos;
    let result = '';
    let hasDash = false;

    while (this.pos < this.input.length) {
      let ch = this.input.charAt(this.pos);
      if (/\d/.test(ch)) {
        result += ch;
        this.pos++;
        this.col++;
      } else if (ch === '-') {
        if (hasDash) break;
        result += '-';
        hasDash = true;
        this.pos++;
        this.col++;
      } else {
        break;
      }
    }

    if (result.match(/^\d+-\d+$/)) {
      this.addToken('Resultado', result);
    } else {
      this.addError('Formato incorrecto', result || this.currentChar, 'Resultado de partido incompleto');
    }
  }

  scan() {
    while (this.pos < this.input.length) {
      this.skipWhitespace();
      if (this.pos >= this.input.length) break;

      if (/[a-zA-Z]/.test(this.currentChar)) {
        this.scanWord();
      } else if (this.currentChar === '"') {
        this.scanString();
      } else if (/\d/.test(this.currentChar)) {
        this.scanNumber();
      } else if (['{', '}', '[', ']', ':', ',', '-'].includes(this.currentChar)) {
        this.scanSymbol();
      } else if (this.currentChar === 'P' && this.input.substring(this.pos, this.pos + 9) === 'Pendiente') {
        this.scanResultado();
      } else {
        // Caracter desconocido
        this.addError('Token inválido', this.currentChar, 'Carácter no reconocido');
        this.advance();
      }
    }
  }
}

function analizar() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor carga un archivo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;

    const analyzer = new LexicalAnalyzer(content);
    analyzer.scan();

    // Mostrar tokens
    mostrarTokens(analyzer.tokens);
    mostrarErrores(analyzer.errors);

    console.log("Análisis completado");
  };
  reader.readAsText(file);
}

function mostrarTokens(tokens) {
  const tableHtml = `
    <h3>Tokens Válidos</h3>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr><th>No.</th><th>Lexema</th><th>Tipo</th><th>Línea</th><th>Columna</th></tr>
      </thead>
      <tbody>
        ${tokens.map(t => `
          <tr>
            <td>${t.number}</td>
            <td>${escapeHtml(t.lexeme)}</td>
            <td>${t.type}</td>
            <td>${t.line}</td>
            <td>${t.column}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  document.getElementById('tokensTable').innerHTML = tableHtml;
}

function mostrarErrores(errors) {
  if (errors.length === 0) {
    document.getElementById('errorsTable').innerHTML = '<h3>No hay errores léxicos</h3>';
    return;
  }

  const tableHtml = `
    <h3>Errores Léxicos</h3>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr><th>No.</th><th>Lexema</th><th>Tipo de Error</th><th>Descripción</th><th>Línea</th><th>Columna</th></tr>
      </thead>
      <tbody>
        ${errors.map(e => `
          <tr>
            <td>${e.number}</td>
            <td>${escapeHtml(e.lexeme)}</td>
            <td>${e.type}</td>
            <td>${e.description}</td>
            <td>${e.line}</td>
            <td>${e.column}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  document.getElementById('errorsTable').innerHTML = tableHtml;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '<',
    '>': '>',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fileInput').addEventListener('change', analizar);
});