const fs = require("fs");
const path = require("path");

class Reportes {
    constructor(callCenter) {
        this.callCenter = callCenter;
    }

    asegurarCarpetaReportes() {
        const dir = path.join(process.cwd(), "Reportes"); 
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        return dir;
    }

    exportarHistorialHTML(filename = "Historial_Llamadas.html") {
        const llamadas = this.callCenter.getLlamadas();
        if (llamadas.length === 0) {
            console.log("No hay llamadas para exportar.");
            return;
        }

        const rows = llamadas.map(l => `
<tr>
<td>${l.idOperador}</td>
<td>${l.nombreOperador}</td>
<td>${l.idCliente}</td>
<td>${l.nombreCliente}</td>
<td>${"x".repeat(l.estrellas)} (${l.estrellas})</td>
<td>${l.getClasificacion()}</td>
</tr>`).join("");

        const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Historial de Llamadas</title>
<style>
table { width:100%; border-collapse:collapse }
th, td { border:1px solid #444; padding:6px; text-align:left }
th { background:#eee }
</style>
</head>
<body>
<h1>Historial de Llamadas</h1>
<p>Archivo origen: ${this.callCenter.getarchivoCargado() || "N/A"}</p>
<table>
<thead>
<tr>
<th>ID Operador</th>
<th>Nombre Operador</th>
<th>ID Cliente</th>
<th>Nombre Cliente</th>
<th>Estrellas</th>
<th>Calificación</th>
</tr>
</thead>
<tbody>
${rows}
</tbody>
</table>
</body>
</html>`;

        const dir = this.asegurarCarpetaReportes();
        const fullPath = path.join(dir, filename);
        fs.writeFileSync(fullPath, html, "utf8");
        console.log("Historial exportado a:", fullPath);
    }

    exportarOperadoresHTML(filename = "Listado_Operadores.html") {
        const operadores = Array.from(this.callCenter.getOperadores().values());
        if (operadores.length === 0) {
            console.log("No hay operadores cargados.");
            return;
        }

        const rows = operadores.map(op => `
<tr>
<td>${op.id}</td>
<td>${op.nombre}</td>
</tr>`).join("");

        const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Listado de Operadores</title>
<style>
table { width:100%; border-collapse:collapse }
th, td { border:1px solid #444; padding:6px }
th { background:#eee }
</style>
</head>
<body>
<h1>Listado de Operadores</h1>
<table>
<thead><tr><th>ID</th><th>Nombre</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
</body>
</html>`;

        const dir = this.asegurarCarpetaReportes();
        const fullPath = path.join(dir, filename);
        fs.writeFileSync(fullPath, html, "utf8");
        console.log("Listado de operadores exportado a:", fullPath);
    }

    exportarClientesHTML(filename = "Listado_Clientes.html") {
        const clientes = Array.from(this.callCenter.getClientes().values());
        if (clientes.length === 0) {
            console.log("No hay clientes cargados.");
            return;
        }

        const rows = clientes.map(c => `
<tr>
<td>${c.id}</td>
<td>${c.nombre}</td>
</tr>`).join("");

        const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Listado de Clientes</title>
<style>
table { width:100%; border-collapse:collapse }
th, td { border:1px solid #444; padding:6px }
th { background:#eee }
</style>
</head>
<body>
<h1>Listado de Clientes</h1>
<table>
<thead><tr><th>ID</th><th>Nombre</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
</body>
</html>`;

        const dir = this.asegurarCarpetaReportes();
        const fullPath = path.join(dir, filename);
        fs.writeFileSync(fullPath, html, "utf8");
        console.log("Listado de clientes exportado a:", fullPath);
    }

    exportarRendimientoHTML(filename = "Rendimiento_Operadores.html") {
        const operadores = Array.from(this.callCenter.getOperadores().values());
        const total = this.callCenter.getTotalLlamadas();
        if (operadores.length === 0 || total === 0) {
            console.log("No hay datos para calcular rendimiento.");
            return;
        }

        const operadoresOrdenados = operadores.sort((a, b) => b.cantidadLlamadas() - a.cantidadLlamadas());

        const rows = operadoresOrdenados.map(op => {
            const cant = op.cantidadLlamadas();
            const pct = (cant / total) * 100;
            return `
<tr>
<td>${op.id}</td>
<td>${op.nombre}</td>
<td>${cant}</td>
<td>${pct.toFixed(2)}%</td>
</tr>`;
        }).join("");

        const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Rendimiento de Operadores</title>
<style>
table { width:100%; border-collapse:collapse }
th, td { border:1px solid #444; padding:6px }
th { background:#eee }
</style>
</head>
<body>
<h1>Rendimiento de Operadores</h1>
<p>Total de llamadas: ${total}</p>
<table>
<thead>
<tr>
<th>ID</th>
<th>Nombre</th>
<th>Cantidad Llamadas</th>
<th>Porcentaje de Atención</th>
</tr>
</thead>
<tbody>
${rows}
</tbody>
</table>
</body>
</html>`;

        const dir = this.asegurarCarpetaReportes();
        const fullPath = path.join(dir, filename);
        fs.writeFileSync(fullPath, html, "utf8");
        console.log("Rendimiento de operadores exportado a:", fullPath);
    }

    exportAllReports() {
        this.exportarHistorialHTML();
        this.exportarOperadoresHTML();
        this.exportarClientesHTML();
        this.exportarRendimientoHTML();
    }
}

module.exports = Reportes;
