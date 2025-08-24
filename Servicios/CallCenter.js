const fs = require("fs");
const path = require("path");
const CallRecord = require("../Modelos/CallRecord");
const Operador = require("../Modelos/Operador");
const Cliente = require("../Modelos/Cliente");

class CallCenter {
    constructor() {
        this.operadores = new Map();
        this.clientes = new Map();
        this.llamadas = [];
        this.archivoCargado = null;
    }

    limpiarDatos() {
        this.operadores.clear();
        this.clientes.clear();
        this.llamadas = [];
        this.archivoCargado = null;
    }

    parseLine(line) {
        const parts = line.split(",").map(p => p.trim());
        if (parts.length < 5) return null;

        const idOperador = parts[0];
        const nombreOperador = parts[1];
        const estrellasStr = parts[2];
        const idCliente = parts[3];
        const nombreCliente = parts[4];

        const estrellasArray = estrellasStr.split(";").map(e => e.trim().toLowerCase());
        const countX = estrellasArray.filter(e => e === "x").length;
        const estrellas = Math.max(0, Math.min(5, countX));

        return new CallRecord(idOperador, nombreOperador, estrellas, idCliente, nombreCliente, estrellasStr);
    }

    cargarArchivo(ruta) {

        try {
            const contenido = fs.readFileSync(ruta, "utf8");
            let lineas = contenido.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

            if (lineas[0]?.toLowerCase().startsWith("id_operador")) {
                lineas = lineas.slice(1);
            }

            if (lineas.length === 0) {
                console.log("El archivo está vacío.");
                return;
            }

            for (let linea of lineas) {
                const llamada = this.parseLine(linea);
                if (!llamada) {
                    console.warn("Línea con formato inválido:", linea);
                    continue;
                }
                this.llamadas.push(llamada);

                if (!this.operadores.has(llamada.idOperador)) {
                    this.operadores.set(llamada.idOperador, new Operador(llamada.idOperador, llamada.nombreOperador));
                }
                this.operadores.get(llamada.idOperador).agregarLlamada(llamada);

                if (!this.clientes.has(llamada.idCliente)) {
                    this.clientes.set(llamada.idCliente, new Cliente(llamada.idCliente, llamada.nombreCliente));
                }
            }
            this.archivoCargado = ruta;
            console.log(`Archivo "${ruta}" cargado. Registros procesados: ${this.llamadas.length}`);
        } catch (err) {
            console.error("Error al leer el archivo:", err.message);
        }
    }

    mostrarPorcentajeClasificacion() {
        const total = this.llamadas.length;
        if (total === 0) {
            console.log("No hay llamadas cargadas.");
            return;
        }
        const conteo = { Buena: 0, Media: 0, Mala: 0 };
        for (let l of this.llamadas) {
            conteo[l.getClasificacion()]++;
        }
        console.log("\n--------- Porcentaje de Clasificación de Llamadas ---------");
        for (let tipo of ["Buena", "Media", "Mala"]) {
            const pct = (conteo[tipo] / total) * 100;
            console.log(`${tipo}: ${conteo[tipo]} llamadas — ${pct.toFixed(2)}%`);
        }
    }

    mostrarCantidadPorEstrellas() {
        if (this.llamadas.length === 0) {
            console.log("No hay llamadas cargadas.");
            return;
        }
        const count = {0:0,1:0,2:0,3:0,4:0,5:0};
        for (let l of this.llamadas) {
            count[l.estrellas]++;
        }
        console.log("\n--------- Cantidad de llamadas por calificación (1..5) ---------");
        for (let i = 1; i <= 5; i++) {
            console.log(`${i} estrella(s): ${count[i]}`);
        }
        console.log(`0 estrellas: ${count[0]}`);
    }


    getLlamadas() { return this.llamadas; }
    getOperadores() { return this.operadores; }
    getClientes() { return this.clientes; }
    getTotalLlamadas() { return this.llamadas.length; }
    getarchivoCargado() { return this.archivoCargado; }
}

module.exports = CallCenter;
