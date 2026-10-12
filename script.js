const SUPABASE_URL = "https://jwkorzxsckcrpsdrvsfv.supabase.co";
const SUPABASE_KEY = "sb_publishable_t-MzMqmI7B_QUXmWrzDU-w_d_clAFeP";
const UPLOAD_URL = `${SUPABASE_URL}/functions/v1/storage-upload`;
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const boton = document.getElementById("seleccionar-archivos");
const selector = document.getElementById("archivos");
const estado = document.getElementById("estado-archivos");

boton.addEventListener("click", function () {
    selector.click();
});

selector.addEventListener("change", async function () {
    const archivos = Array.from(selector.files);

    estado.replaceChildren();

    if (archivos.length === 0) return;

    const resumen = document.createElement("p");
    resumen.textContent = `${archivos.length} archivo(s) seleccionado(s).`;
    estado.appendChild(resumen);

    for (const archivo of archivos) {
        const linea = document.createElement("p");
        linea.textContent = `Subiendo ${archivo.name}...`;
        estado.appendChild(linea);

        if (archivo.size === 0 || archivo.size > MAX_FILE_SIZE) {
            linea.textContent =
                `${archivo.name}: supera el límite permitido de 50 MB o está vacío.`;
            continue;
        }

        const formulario = new FormData();
        formulario.append("file", archivo);

        try {
            const respuesta = await fetch(UPLOAD_URL, {
                method: "POST",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                },
                body: formulario
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok || !resultado.success) {
                throw new Error(resultado.error || `Error HTTP ${respuesta.status}`);
            }

            linea.textContent = `✓ ${archivo.name}: subido correctamente.`;
        } catch (error) {
            console.error("Error al subir archivo:", error);
            linea.textContent =
                `✗ ${archivo.name}: no se pudo subir. ${error.message}`;
        }
    }

    selector.value = "";
});
