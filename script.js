const boton = document.getElementById("seleccionar-archivos");
const selector = document.getElementById("archivos");
const estado = document.getElementById("estado-archivos");

// Abrir el selector cuando el invitado pulse el botón.
boton.addEventListener("click", function () {
    selector.click();
});

// Mostrar los archivos que el invitado haya seleccionado.
selector.addEventListener("change", function () {
    const archivos = Array.from(selector.files);

    if (archivos.length === 0) {
        estado.textContent = "";
        return;
    }

    const totalBytes = archivos.reduce(function (total, archivo) {
        return total + archivo.size;
    }, 0);

    let tamano;

    if (totalBytes < 1024 * 1024) {
        tamano = Math.max(1, Math.round(totalBytes / 1024)) + " KB";
    } else {
        tamano = (totalBytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    estado.replaceChildren();

    const resumen = document.createElement("p");
    resumen.textContent =
        archivos.length + " archivo(s) seleccionado(s) · " + tamano;

    const aviso = document.createElement("p");
    aviso.textContent =
        "Vista de prueba: todavía no se han enviado ni guardado los archivos.";

    estado.appendChild(resumen);
    estado.appendChild(aviso);
});
