const fs = require('fs');

// Nombre del archivo .js
const archivo = './src/mapTask.js';

// Función para agrupar las llaves
function agruparLlaves(datos) {
    const grupos = [];
    let grupoActual = [];
    let llaveAnterior = null;
    let primerElementoAnterior = null;

    Object.entries(datos).forEach(([llave, contenido]) => {
        const llaveActual = parseInt(llave);
        const primerElementoActual = contenido[0];

        if (llaveAnterior === null) {
            grupoActual.push({llave: llaveActual, contenido: contenido});
        } else {
            const diferenciaLlaves = llaveActual - llaveAnterior;
            const diferenciaContenido = primerElementoActual - primerElementoAnterior;

            if (diferenciaLlaves > 5 || diferenciaContenido > 10) {
                grupos.push(grupoActual);
                grupoActual = [];
            }
            grupoActual.push({llave: llaveActual, contenido: contenido});
        }

        llaveAnterior = llaveActual;
        primerElementoAnterior = primerElementoActual;
    });

    if (grupoActual.length > 0) {
        grupos.push(grupoActual);
    }

    return grupos;
}

// Leer el archivo .js
fs.readFile(archivo, 'utf8', (err, data) => {
    if (err) {
        console.error("Error al leer el archivo:", err);
        return;
    }

    try {
        // Extraer el objeto JSON del contenido del archivo
        const contenidoJSON = data.replace(/^.*?=\s*/, '').replace(/;?\s*$/, '');

        // Parsear el contenido JSON
        const datos = JSON.parse(contenidoJSON);

        // Agrupar las llaves
        const gruposLlaves = agruparLlaves(datos);

        // Crear el nuevo JSON con llave, contenido y grupo
        const nuevoJSON = gruposLlaves.flatMap((grupo, index) =>
            grupo.map(({llave, contenido}) => ({
                llave,
                contenido,
                grupo: index + 1
            }))
        );

        // Guardar el nuevo JSON en un archivo
        fs.writeFile('result.json', JSON.stringify(nuevoJSON, null, 2), (err) => {
            if (err) {
                console.error("Error al escribir el archivo:", err);
                return;
            }
            console.log("El archivo result.json ha sido creado con éxito.");
        });

        // Mostrar un resumen
        console.log(`Se han creado ${gruposLlaves.length} grupos.`);
        console.log(`El nuevo JSON contiene ${nuevoJSON.length} elementos.`);

    } catch (error) {
        console.error("Error al procesar el archivo:", error);
    }
});