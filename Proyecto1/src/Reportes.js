import fs from "fs";

export class Reportes {
  static generarTokensHTML(tokens, rutaSalida) {
    let html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Reporte de Tokens</title>
<style>
table {border-collapse: collapse;width: 100%;font-family: Arial, sans-serif;}
th, td {border: 1px solid #999;padding: 8px;text-align: left;}
th {background-color: #f2f2f2;}
</style>
</head>
<body>
<h2>Reporte de Tokens</h2>
<table>
<tr>
<th>No.</th><th>Lexema</th><th>Tipo</th><th>Línea</th><th>Columna</th>
</tr>
`;

    tokens.forEach((t, i) => {
      html += `<tr>
<td>${i + 1}</td><td>${t.valor}</td><td>${t.tipo}</td><td>${t.linea}</td><td>${t.columna}</td>
</tr>`;
    });

    html += `
</table>
</body>
</html>`;

    fs.writeFileSync(rutaSalida, html, "utf8");
  }

  static generarErroresHTML(errores, rutaSalida) {
    let html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Reporte de Errores Léxicos</title>
<style>
table {border-collapse: collapse;width: 100%;font-family: Arial, sans-serif;}
th, td {border: 1px solid #999;padding: 8px;text-align: left;}
th {background-color: #f2f2f2;}
</style>
</head>
<body>
<h2>Reporte de Errores Léxicos</h2>
<table>
<tr>
<th>No.</th><th>Lexema</th><th>Tipo de Error</th><th>Descripción</th><th>Línea</th><th>Columna</th>
</tr>
`;

    errores.forEach((e, i) => {
      html += `<tr>
<td>${i + 1}</td><td>${e.lexema}</td><td>${e.tipo}</td><td>${e.descripcion}</td><td>${e.linea}</td><td>${e.columna}</td>
</tr>`;
    });

    html += `
</table>
</body>
</html>`;

    fs.writeFileSync(rutaSalida, html, "utf8");
  }
}
