class Operador {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        this.llamadas = [];
    }

    agregarLlamada(llamada) {
        this.llamadas.push(llamada);
    }

    cantidadLlamadas() {
        return this.llamadas.length;
    }
}

module.exports = Operador;
