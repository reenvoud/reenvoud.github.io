document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const sideMenu = document.getElementById("side-menu");
    const closeMenu = document.getElementById("close-menu");

    if (menuToggle && sideMenu) {
        menuToggle.addEventListener("click", () => {
            sideMenu.classList.add("open");
        });
    }

    if (closeMenu && sideMenu) {
        closeMenu.addEventListener("click", () => {
            sideMenu.classList.remove("open");
        });
    }

    document.addEventListener("click", (event) => {
        if (sideMenu && sideMenu.classList.contains("open")) {
            if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                sideMenu.classList.remove("open");
            }
        }
    });

    const container = document.getElementById("dynamic-content");
    const fechaActual = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    
    if (container) {
        container.textContent = `Módulos de Reenvoud Corporation activos - Fecha: ${fechaActual}`;
    }
});
