
Corrigelodocument.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const sideMenu = document.getElementById("side-menu");
    const closeMenu = document.getElementById("close-menu");
    const backBtn = document.getElementById("back-btn");

    if (menuToggle && sideMenu) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            sideMenu.classList.toggle("open");
        });
    }

    if (closeMenu && sideMenu) {
        closeMenu.addEventListener("click", () => {
            sideMenu.classList.remove("open");
        });
    }

    document.addEventListener("click", (event) => {
        if (sideMenu && sideMenu.classList.contains("open")) {
            if (!sideMenu.contains(event.target) && (!menuToggle || !menuToggle.contains(event.target))) {
                sideMenu.classList.remove("open");
            }
        }
    });

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            if (window.location.hash && window.location.hash !== "#inicio") {
                history.back();
            } else {
                switchView("inicio", true);
            }
        });
    }
 Comoleto