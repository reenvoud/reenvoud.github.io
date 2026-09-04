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

    let savedDepts = JSON.parse(localStorage.getItem("reenvoud_depts")) || [];
    let savedBlocks = JSON.parse(localStorage.getItem("reenvoud_blocks")) || [];

    function renderSavedData() {
        // Renderizar departamentos guardados con su botón de borrar
        savedDepts.forEach((dept, index) => {
            appendDeptToDOM(dept, index);
        });

        // Renderizar bloques guardados con su botón de borrar
        savedBlocks.forEach((block, index) => {
            appendBlockToDOM(block.type, block.title, index);
        });
    }

    function appendDeptToDOM(deptName, index) {
        const li = document.createElement("li");
        
        const a = document.createElement("a");
        a.href = `#${deptName.toLowerCase().replace(/\s+/g, '-')}`;
        a.textContent = deptName;
        
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.className = "delete-btn";
        delBtn.title = "Borrar departamento";
        delBtn.addEventListener("click", () => {
            savedDepts.splice(index, 1);
            localStorage.setItem("reenvoud_depts", JSON.stringify(savedDepts));
            departmentsList.innerHTML = '';
            // Mantener los fijos por defecto
            departmentsList.innerHTML = `
                <li><a href="#inicio">Inicio / Principal</a></li>
                <li><a href="#ia">Inteligencia Artificial</a></li>
                <li><a href="#desarrollo">Desarrollo de Software</a></li>
                <li><a href="#arquitectura">Arquitectura Modular</a></li>
            `;
            savedDepts.forEach((d, i) => appendDeptToDOM(d, i));
        });

        li.appendChild(a);
        li.appendChild(delBtn);
        departmentsList.appendChild(li);
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
            userBlocksContainer.innerHTML = '';
            savedBlocks.forEach((b, i) => appendBlockToDOM(b.type, b.title, i));
        });

        blockDiv.innerHTML = contentHTML;
        blockDiv.appendChild(delBlockBtn);
        userBlocksContainer.appendChild(blockDiv);
    }

    renderSavedData();

    if (addDeptBtn) {
        addDeptBtn.addEventListener("click", () => {
            const deptName = newDeptInput.value.trim();
            if (deptName) {
                savedDepts.push(deptName);
                localStorage.setItem("reenvoud_depts", JSON.stringify(savedDepts));
                
                departmentsList.innerHTML = `
                    <li><a href="#inicio">Inicio / Principal</a></li>
                    <li><a href="#ia">Inteligencia Artificial</a></li>
                    <li><a href="#desarrollo">Desarrollo de Software</a></li>
                    <li><a href="#arquitectura">Arquitectura Modular</a></li>
                `;
                savedDepts.forEach((d, i) => appendDeptToDOM(d, i));
                
                newDeptInput.value = "";
                alert(`Departamento "${deptName}" creado.`);
            }
        });
    }

    if (addBlockBtn) {
        addBlockBtn.addEventListener("click", () => {
            const type = blockTypeSelect.value;
            const title = blockTitleInput.value.trim() || "Nuevo Módulo";

            savedBlocks.push({ type, title });
            localStorage.setItem("reenvoud_blocks", JSON.stringify(savedBlocks));

            userBlocksContainer.innerHTML = '';
            savedBlocks.forEach((b, i) => appendBlockToDOM(b.type, b.title, i));
            
            blockTitleInput.value = "";
            alert("Bloque añadido.");
        });
    }

    const container = document.getElementById("dynamic-content");
    const fechaActual = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    if (container) {
        container.textContent = `Reenvoud OS Activo - Fecha: ${fechaActual}`;
    }
});
