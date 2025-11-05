
(function () {
  // Intercepta fetch en la página de Swagger UI
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    const resp = await originalFetch(input, init);

    try {
      const ct = (resp.headers && resp.headers.get("content-type")) || "";
      
      if (ct.startsWith("application/pdf")) {
        
        const cd = (resp.headers.get("content-disposition") || "");
        const m = cd.match(/filename="?([^"]+)"?/i);
        const filename = (m && m[1]) || "archivo.pdf";

       
        const buf = await resp.arrayBuffer();
        const blob = new Blob([buf], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        
        return new Response(new Blob(), {
          status: resp.status,
          statusText: resp.statusText,
          headers: resp.headers
        });
      }
    } catch (e) {
      console.warn("PDF interceptor error:", e);
    
    }

    return resp;
  };
})();
