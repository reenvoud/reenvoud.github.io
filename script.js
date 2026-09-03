document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("dynamic-content");
    const fechaActual = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    
    container.textContent = `Sistema activo y actualizado al: ${fechaActual}`;
});
