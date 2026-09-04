document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const sideMenu = document.getElementById("side-menu");
    const closeMenu = document.getElementById("close-menu");

    if (menuToggle && sideMenu) {
        menuToggle.addEventListener("click", () => sideMenu.classList.add("open"));
    }

    if (closeMenu && sideMenu) {
        closeMenu.addEventListener("click", () => sideMenu.classList.remove("open"));
    }

    document.addEventListener("click", (event) => {
        if (sideMenu && sideMenu.classList.contains("open")) {
            if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                sideMenu.classList.remove("open");
            }
        }
    });

    // Elementos del Constructor
    const addDeptBtn = document.getElementById("add-dept-btn");
    const newDeptInput = document.getElementById("new-dept-name");
    const departmentsList = document.getElementById("departments-list");

    const addBlockBtn = document.getElementById("add-block-btn");
    const blockTypeSelect = document.getElementById("block-type");
    const blockTitleInput = document.getElementById("block-title");
    const userBlocksContainer = document.getElementById("user-blocks-container");

    // Cargar datos guardados previamente en el navegador
    let savedDepts = JSON.parse(localStorage.getItem("reenvoud_depts")) || [];
    let savedBlocks = JSON.parse(localStorage.getItem("reenvoud_blocks")) || [];

    function renderSavedData() {
        // Renderizar Departamentos
        savedDepts.forEach(dept => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = `#${dept.toLowerCase().replace(/\s+/g, '-')}`;
            a.textContent = dept;
            li.appendChild(a);
            departmentsList.appendChild(li);
        });

        // Renderizar Bloques
        savedBlocks.forEach(block => {
            appendBlockToDOM(block.type, block.title);
        });
    }

    function appendBlockToDOM(type, title) {
        const blockDiv = document.createElement("div");
        blockDiv.className = "hero-block dynamic-card";
        
        let contentHTML = "";
        if (type === "video") {
            contentHTML = `<div class="media-container"><div class="media-placeholder"><p>🎬 [Video] ${title}</p></div></div>`;
        } else if (type === "card") {
            contentHTML = `<h3>📌 ${title}</h3><p>Módulo de tarjeta interactiva generado desde el panel de Reenvoud OS.</p>`;
        } else {
            contentHTML = `<h3>📝 ${title}</h3><p>Contenido de texto estructurado y modular.</p>`;
        }

        blockDiv.innerHTML = contentHTML;
        userBlocksContainer.appendChild(blockDiv);
    }

    renderSavedData();

    // Añadir Departamento
    if (addDeptBtn) {
        addDeptBtn.addEventListener("click", () => {
            const deptName = newDeptInput.value.trim();
            if (deptName) {
                savedDepts.push(deptName);
                localStorage.setItem("reenvoud_depts", JSON.stringify(savedDepts));

                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = `#${deptName.toLowerCase().replace(/\s+/g, '-')}`;
                a.textContent = deptName;
                li.appendChild(a);
                departmentsList.appendChild(li);
                
                newDeptInput.value = "";
                alert(`Departamento "${deptName}" creado y guardado.`);
            }
        });
    }

    // Añadir Bloque
    if (addBlockBtn) {
        addBlockBtn.addEventListener("click", () => {
            const type = blockTypeSelect.value;
            const title = blockTitleInput.value.trim() || "Nuevo Módulo";

            savedBlocks.push({ type, title });
            localStorage.setItem("reenvoud_blocks", JSON.stringify(savedBlocks));

            appendBlockToDOM(type, title);
            blockTitleInput.value = "";
            alert("Bloque añadido y sincronizado correctamente.");
        });
    }

    const container = document.getElementById("dynamic-content");
    const fechaActual = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    if (container) {
        container.textContent = `Reenvoud OS Activo - Fecha: ${fechaActual}`;
    }
});
