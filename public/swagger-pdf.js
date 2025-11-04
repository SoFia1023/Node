// MODIFICACION ULTIMOOOO

(function () {
  // Intercepta fetch en la página de Swagger UI
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    const resp = await originalFetch(input, init);

    try {
      const ct = (resp.headers && resp.headers.get("content-type")) || "";
      // Solo actuamos si la respuesta es PDF (application/pdf)
      if (ct.startsWith("application/pdf")) {
        // 1) Tomar filename del Content-Disposition (si viene)
        const cd = (resp.headers.get("content-disposition") || "");
        const m = cd.match(/filename="?([^"]+)"?/i);
        const filename = (m && m[1]) || "archivo.pdf";

        // 2) Leer binario y crear Blob
        const buf = await resp.arrayBuffer();
        const blob = new Blob([buf], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        // 3) Forzar descarga con nombre correcto
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        // 4) Devolver respuesta vacía para que Swagger no renderice "texto"
        return new Response(new Blob(), {
          status: resp.status,
          statusText: resp.statusText,
          headers: resp.headers
        });
      }
    } catch (e) {
      console.warn("PDF interceptor error:", e);
      // Si algo falla, dejamos pasar la respuesta original
    }

    return resp;
  };
})();
