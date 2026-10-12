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

    let exitosos = 0;
    let fallidos = 0;

    // Panel de progreso
    const panel = document.createElement("div");
    panel.style.cssText = `
        margin: 24px auto;
        padding: 24px;
        max-width: 520px;
        background: #fffaf5;
        border: 1px solid #ead8c7;
        border-radius: 14px;
        text-align: center;
        color: #49382e;
        font-family: inherit;
        box-sizing: border-box;
    `;

    const titulo = document.createElement("h3");
    titulo.textContent = "Estamos guardando tus recuerdos ❤️";
    titulo.style.cssText = `
        margin: 0 0 12px;
        font-size: 21px;
        line-height: 1.4;
    `;

    const mensaje = document.createElement("p");
    mensaje.textContent = "Preparando tus archivos...";
    mensaje.style.cssText = `
        margin: 0 0 16px;
        font-size: 16px;
        line-height: 1.5;
    `;

    const barraFondo = document.createElement("div");
    barraFondo.style.cssText = `
        width: 100%;
        height: 10px;
        background: #eadfd5;
        border-radius: 20px;
        overflow: hidden;
        margin-bottom: 12px;
    `;

    const barra = document.createElement("div");
    barra.style.cssText = `
        width: 0%;
        height: 100%;
        background: #94745d;
        border-radius: 20px;
        transition: width 0.3s ease;
    `;

    barraFondo.appendChild(barra);

    const contador = document.createElement("p");
    contador.textContent = `0 de ${archivos.length} archivos completados`;
    contador.style.cssText = `
        margin: 0 0 16px;
        font-size: 14px;
    `;

    const lista = document.createElement("div");
    lista.style.cssText = `
        margin-top: 16px;
        text-align: left;
        overflow-wrap: anywhere;
    `;

    panel.append(titulo, mensaje, barraFondo, contador, lista);
    estado.appendChild(panel);

    // Evita que se inicie otra selección mientras se suben archivos.
    boton.disabled = true;
    selector.disabled = true;

    try {
        for (let i = 0; i < archivos.length; i++) {
            const archivo = archivos[i];

            const linea = document.createElement("p");
            linea.style.cssText = `
                margin: 8px 0;
                font-size: 14px;
                line-height: 1.5;
            `;

            linea.textContent = `⏳ ${archivo.name}: pendiente`;
            lista.appendChild(linea);

            mensaje.textContent =
                `Subiendo archivo ${i + 1} de ${archivos.length}...`;

            if (archivo.size === 0 || archivo.size > MAX_FILE_SIZE) {
                fallidos++;
                linea.textContent =
                    `✗ ${archivo.name}: está vacío o supera el límite de 50 MB.`;
                linea.style.color = "#a32626";
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

                let resultado;

                try {
                    resultado = await respuesta.json();
                } catch {
                    throw new Error("El servidor no devolvió una respuesta válida.");
                }

                if (!respuesta.ok || !resultado.success) {
                    throw new Error(
                        resultado.error || `Error HTTP ${respuesta.status}`
                    );
                }

                exitosos++;

                linea.textContent = `✓ ${archivo.name}: guardado correctamente`;
                linea.style.color = "#28633b";

            } catch (error) {
                console.error("Error al subir archivo:", error);

                fallidos++;

                linea.textContent =
                    `✗ ${archivo.name}: no se pudo subir. Inténtalo de nuevo.`;
                linea.style.color = "#a32626";
            }

            const completados = exitosos + fallidos;
            const porcentaje = Math.round(
                (completados / archivos.length) * 100
            );

            barra.style.width = `${porcentaje}%`;
            contador.textContent =
                `${completados} de ${archivos.length} archivos procesados`;
        }

        barra.style.width = "100%";

        if (fallidos === 0) {
            titulo.textContent = "¡Tus recuerdos se guardaron con éxito! ❤️";
            mensaje.textContent =
                `¡Listo! Los ${exitosos} archivo(s) se subieron correctamente.`;
            contador.textContent = "✓ Carga completada";
            barra.style.background = "#3d8050";
        } else if (exitosos === 0) {
            titulo.textContent = "No se pudieron subir tus archivos";
            mensaje.textContent =
                "No se guardó ningún archivo. Comprueba los mensajes e inténtalo de nuevo.";
            barra.style.background = "#b33b3b";
        } else {
            titulo.textContent = "La subida terminó con algunos problemas";
            mensaje.textContent =
                `Se guardaron ${exitosos} archivo(s), pero ${fallidos} no se pudieron subir. Revisa los mensajes anteriores.`;
            barra.style.background = "#b47a32";
        }

    } finally {
        boton.disabled = false;
        selector.disabled = false;
        selector.value = "";
    }
});
