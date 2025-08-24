class CallRecord {
    constructor(idOperador, nombreOperador, estrellas, idCliente, nombreCliente, rawStarsStr) {
        this.idOperador = idOperador;
        this.nombreOperador = nombreOperador;
        this.estrellas = estrellas;
        this.idCliente = idCliente;
        this.nombreCliente = nombreCliente;
        this.rawStarsStr = rawStarsStr || "".padEnd(5, "0");
    }

    getClasificacion() {
        if (this.estrellas >= 4) return "Buena";
        if (this.estrellas >= 2) return "Media";
        return "Mala";
    }
}

module.exports = CallRecord;
