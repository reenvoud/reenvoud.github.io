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

    const addDeptBtn = document.getElementById("add-dept-btn");
    const newDeptInput = document.getElementById("new-dept-name");
    const departmentsList = document.getElementById("departments-list");

    const addBlockBtn = document.getElementById("add-block-btn");
    const blockTypeSelect = document.getElementById("block-type");
    const blockTitleInput = document.getElementById("block-title");
    const userBlocksContainer = document.getElementById("user-blocks-container");

    // Departamentos por defecto si está vacío
    let defaultDepts = ["Inicio / Principal", "Inteligencia Artificial", "Desarrollo de Software", "Arquitectura Modular"];
    let savedDepts = JSON.parse(localStorage.getItem("reenvoud_depts")) || defaultDepts;
    let savedBlocks = JSON.parse(localStorage.getItem("reenvoud_blocks")) || [];

    function renderDepartments() {
        departmentsList.innerHTML = "";
        savedDepts.forEach((dept, index) => {
            const li = document.createElement("li");
            
            const a = document.createElement("a");
            a.href = `#${dept.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
            a.textContent = dept;
            
            const delBtn = document.createElement("button");
            delBtn.innerHTML = "🗑️";
            delBtn.className = "delete-dept-btn";
            delBtn.title = "Borrar sección";
            
            delBtn.addEventListener("click", () => {
                savedDepts.splice(index, 1);
                localStorage.setItem("reenvoud_depts", JSON.stringify(savedDepts));
                renderDepartments();
            });

            li.appendChild(a);
            li.appendChild(delBtn);
            departmentsList.appendChild(li);
        });
    }

    function renderBlocks() {
        userBlocksContainer.innerHTML = "";
        savedBlocks.forEach((block, index) => {
            appendBlockToDOM(block.type, block.title, index);
        });
    }

    function appendBlockToDOM(type, title, index) {
        const blockDiv = document.createElement("div");
        blockDiv.className = "hero-block dynamic-card";
        
        let contentHTML = "";
        if (type === "video") {
            contentHTML = `<div class="media-container"><div class="media-placeholder"><p>🎬 [Video] ${title}</p></div></div>`;
        } else if (type === "card") {
            contentHTML = `<h3>📌 ${title}</h3><p>Módulo de tarjeta interactiva generado desde Reenvoud OS.</p>`;
        } else {
            contentHTML = `<h3>📝 ${title}</h3><p>Contenido de texto estructurado y modular.</p>`;
        }

        const delBlockBtn = document.createElement("button");
        delBlockBtn.textContent = "🗑️ Borrar Bloque";
        delBlockBtn.className = "builder-btn";
        delBlockBtn.style.backgroundColor = "#590000";
        delBlockBtn.style.marginTop = "10px";
        
        delBlockBtn.addEventListener("click", () => {
            savedBlocks.splice(index, 1);
            localStorage.setItem("reenvoud_blocks", JSON.stringify(savedBlocks));
            renderBlocks();
        });

        blockDiv.innerHTML = contentHTML;
        blockDiv.appendChild(delBlockBtn);
        userBlocksContainer.appendChild(blockDiv);
    }

    renderDepartments();
    renderBlocks();

    if (addDeptBtn) {
        addDeptBtn.addEventListener("click", () => {
            const deptName = newDeptInput.value.trim();
            if (deptName) {
                savedDepts.push(deptName);
                localStorage.setItem("reenvoud_depts", JSON.stringify(savedDepts));
                renderDepartments();
                newDeptInput.value = "";
            }
        });
    }

    if (addBlockBtn) {
        addBlockBtn.addEventListener("click", () => {
            const type = blockTypeSelect.value;
            const title = blockTitleInput.value.trim() || "Nuevo Módulo";

            savedBlocks.push({ type, title });
            localStorage.setItem("reenvoud_blocks", JSON.stringify(savedBlocks));
            renderBlocks();
            blockTitleInput.value = "";
        });
    }

    const container = document.getElementById("dynamic-content");
    const fechaActual = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    if (container) {
        container.textContent = `Reenvoud OS Activo - Fecha: ${fechaActual}`;
    }
});
