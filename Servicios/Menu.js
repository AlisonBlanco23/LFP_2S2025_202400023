const readline = require("readline");
const CallCenter = require("./CallCenter");
const Reportes = require("./Reportes");

class Menu {
    constructor() {
        this.callCenter = new CallCenter();
        this.reportes = new Reportes(this.callCenter);
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    Iniciar() {
        console.log("==================================================================");
        console.log("Simulador de CallCenter — JavaScript (Consola)");
        this.mostrarMenu();
    }

    mostrarMenu() {
        console.log("\n========================= MENÚ PRINCIPAL =========================");
        console.log("1. Cargar registros de llamadas");
        console.log("2. Exportar Historial de Llamadas");
        console.log("3. Exportar Listado de Operadores");
        console.log("4. Exportar Listado de Clientes");
        console.log("5. Exportar Rendimiento de Operadores");
        console.log("6. Exportar TODOS los reportes");
        console.log("7. Mostrar Porcentaje de Clasificación de Llamadas");
        console.log("8. Mostrar Cantidad de Llamadas por Calificación");
        console.log("9. Limpiar datos cargados");
        console.log("0. Salir");

        console.log("==================================================================");
        
        this.rl.question("Seleccione una opción: ", (opt) => {
            this.manejarOpcion(opt.trim());
        });
    } 

    manejarOpcion(opt) {
        console.log("==================================================================");

        switch (opt) {
            case "1":
                this.rl.question("Ingrese la ruta del archivo que se cargará (ej: Data/ArchivoN.csv): ", (ruta) => {
                    
                    this.callCenter.cargarArchivo(ruta.trim());
                    this.mostrarMenu();
                });
                break;

            case "2":
                this.reportes.exportarHistorialHTML();
                this.mostrarMenu();
                break;

            case "3":
                this.reportes.exportarOperadoresHTML();
                this.mostrarMenu();
                break;

            case "4":
                this.reportes.exportarClientesHTML();
                this.mostrarMenu();
                break;

            case "5":
                this.reportes.exportarRendimientoHTML();
                this.mostrarMenu();
                break;

            case "6":
                this.reportes.exportAllReports();
                this.mostrarMenu();
                break;

            case "7":
                this.callCenter.mostrarPorcentajeClasificacion();
                this.mostrarMenu();
                break;

            case "8":
                this.callCenter.mostrarCantidadPorEstrellas();
                this.mostrarMenu();
                break;

            case "9":
                this.rl.question("¿Seguro que desea limpiar todos los datos cargados? (s/n): ", (resp) => {
                    if (resp.trim().toLowerCase() === "s") {
                        this.callCenter.limpiarDatos();
                        console.log("==================================================================");
                        console.log("Datos limpiados.");
                    } else {
                        console.log("==================================================================");
                        console.log("Operación cancelada.");
                    }
                    this.mostrarMenu();
                });
                break;

            case "0":
                console.log("Gracias por su visita, vuelva pronto.");
                console.log("==================================================================");
                this.rl.close();
                break;

            default:
                console.log("Opción inválida.");
                this.mostrarMenu();
        }
    }
}

module.exports = Menu;
