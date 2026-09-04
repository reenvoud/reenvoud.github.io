document.addEventListener("DOMContentLoaded", () => {
    // Lógica para abrir y cerrar el menú lateral
    const menuToggle = document.getElementById("menu-toggle");
    const sideMenu = document.getElementById("side-menu");
    const closeMenu = document.getElementById("close-menu");

    if (menuToggle && sideMenu && closeMenu) {
        menuToggle.addEventListener("click", () => {
            sideMenu.classList.add("open");
        });

        closeMenu.addEventListener("click", () => {
            sideMenu.classList.remove("open");
        });
    }

    // Funcionalidad dinámica del sistema en la sección principal
    const container = document.getElementById("dynamic-content");
    const fechaActual = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    
    if (container) {
        container.textContent = `Módulos de Reenvoud Corporation activos - Fecha: ${fechaActual}`;
    }
});

