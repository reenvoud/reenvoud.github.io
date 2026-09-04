document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const sideMenu = document.getElementById("side-menu");
    const closeMenu = document.getElementById("close-menu");
    const backBtn = document.getElementById("back-btn");

    if (menuToggle && sideMenu) {
        menuToggle.addEventListener("click", () => {
            sideMenu.classList.toggle("open");
        });
    }

    if (closeMenu && sideMenu) {
        closeMenu.addEventListener("click", () => {
            sideMenu.classList.remove("open");
        });
    }

    document.addEventListener("click", (e) => {
        if (sideMenu && sideMenu.classList.contains("open")) {
            if (!sideMenu.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
                sideMenu.classList.remove("open");
            }
        }
    });

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            history.back();
        });
    }

    // Control de vistas por hash
    const links = document.querySelectorAll(".menu-links a, nav a");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            if (targetId && targetId.startsWith("#")) {
                e.preventDefault();
                const section = document.querySelector(targetId);
                if (section) {
                    document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active-view"));
                    section.classList.add("active-view");
                    if (sideMenu) sideMenu.classList.remove("open");
                    history.pushState(null, "", targetId);
                }
            }
        });
    });
});
