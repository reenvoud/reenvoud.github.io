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
    const targetDeptSelect = document.getElementById("target-dept-select");

    const addBlockBtn = document.getElementById("add-block-btn");
    const blockTypeSelect = document.getElementById("block-type");
    const blockTitleInput = document.getElementById("block-title");
    const departmentsContentContainer = document.getElementById("departments-content-container");

    let defaultStructure = [
        {
            name: "Inteligencia Artificial",
            blocks: [
                { type: "article", title: "Introducción a Modelos LLM" }
            ]
        },
        {
            name: "Desarrollo de Software",
            blocks: [
                { type: "multimedia", title: "Arquitectura Modular Reenvoud" }
            ]
        }
    ];

    let reenvoudData = JSON.parse(localStorage.getItem("reenvoud_system_data")) || defaultStructure;

    function saveData() {
        localStorage.setItem("reenvoud_system_data", JSON.stringify(reenvoudData));
    }

    function switchView(targetId) {
        // Ocultar TODO (tanto el inicio como todos los departamentos)
        document.querySelectorAll(".view-section").forEach(sec => {
            sec.classList.remove("active-view");
        });
        
        // Mostrar únicamente la vista seleccionada
        const selected = document.getElementById(targetId);
        if (selected) {
            selected.classList.add("active-view");
        }
    }

    function renderSystem() {
        departmentsList.innerHTML = "";
        targetDeptSelect.innerHTML = "";
        departmentsContentContainer.innerHTML = "";

        if (reenvoudData.length === 0) {
            targetDeptSelect.innerHTML = '<option value="">No hay áreas creadas</option>';
        }

        reenvoudData.forEach((dept, deptIndex) => {
            const deptId = `dept-${deptIndex}`;

            // 1. Elemento en el menú lateral
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = `#${deptId}`;
            a.textContent = dept.name;
            
            a.addEventListener("click", (e) => {
                e.preventDefault();
                switchView(deptId);
                if (sideMenu) sideMenu.classList.remove("open");
            });
            
            const delDeptBtn = document.createElement("button");
            delDeptBtn.innerHTML = "🗑️";
            delDeptBtn.className = "delete-dept-btn";
            delDeptBtn.title = "Borrar área completa";
            delDeptBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                reenvoudData.splice(deptIndex, 1);
                saveData();
                renderSystem();
                switchView("inicio");
            });

            li.appendChild(a);
            li.appendChild(delDeptBtn);
            departmentsList.appendChild(li);

            // 2. Selector del panel administrador
            const option = document.createElement("option");
            option.value = deptIndex;
            option.textContent = dept.name;
            targetDeptSelect.appendChild(option);

            // 3. Contenedor de vista independiente para este departamento
            const deptSection = document.createElement("section");
            deptSection.className = "view-section"; // Sin active-view por defecto para que esté oculto
            deptSection.id = deptId;

            let subBlocksHTML = "";
            if (dept.blocks && dept.blocks.length > 0) {
                dept.blocks.forEach((block, blockIndex) => {
                    let badge = block.type === 'article' ? '📝 [Artículo / Blog]' : (block.type === 'multimedia' ? '🎬 [Multimedia]' : '📌 [Proyecto]');
                    subBlocksHTML += `
                        <div class="sub-block-item">
                            <h4>${badge} ${block.title}</h4>
                            <p>Contenido exclusivo de la sección ${dept.name}.</p>
                            <button class="delete-sub-btn" data-dept="${deptIndex}" data-block="${blockIndex}">🗑️ Borrar Subsección</button>
                        </div>
                    `;
                });
            } else {
                subBlocksHTML = '<p style="color:#777; text-align: center; padding: 20px;">Este departamento está vacío. Añade subsecciones o bloques desde el panel gestor.</p>';
            }

            deptSection.innerHTML = `
                <div class="department-header">
                    <h2>📁 ${dept.name}</h2>
                </div>
                <div class="sub-blocks-grid">
                    ${subBlocksHTML}
                </div>
            `;
            departmentsContentContainer.appendChild(deptSection);
        });

        // Activar eventos de borrado de subsecciones
        document.querySelectorAll(".delete-sub-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const dIdx = e.target.getAttribute("data-dept");
                const bIdx = e.target.getAttribute("data-block");
                reenvoudData[dIdx].blocks.splice(bIdx, 1);
                saveData();
                renderSystem();
                const activeSec = document.querySelector(".view-section.active-view");
                if (activeSec) switchView(activeSec.id);
            });
        });
    }

    // Enlace de Inicio en el menú lateral
    const inicioLink = document.getElementById("nav-inicio-link");
    if (inicioLink) {
        inicioLink.addEventListener("click", (e) => {
            e.preventDefault();
            switchView("inicio");
            if (sideMenu) sideMenu.classList.remove("open");
        });
    }

    renderSystem();

    // Crear nuevo departamento principal
    if (addDeptBtn) {
        addDeptBtn.addEventListener("click", () => {
            const name = newDeptInput.value.trim();
            if (name) {
                reenvoudData.push({ name: name, blocks: [] });
                saveData();
                renderSystem();
                newDeptInput.value = "";
                // Entrar directamente al departamento nuevo (vacío o listo para sus bloques)
                switchView(`dept-${reenvoudData.length - 1}`);
                if (sideMenu) sideMenu.classList.remove("open");
            } else {
                alert("Escribe un nombre para el área.");
            }
        });
    }

    // Añadir subsección o bloque al departamento seleccionado
    if (addBlockBtn) {
        addBlockBtn.addEventListener("click", () => {
            const selectedDeptIndex = targetDeptSelect.value;
            const type = blockTypeSelect.value;
            const title = blockTitleInput.value.trim() || "Nueva Página Profesional";

            if (selectedDeptIndex !== "" && reenvoudData[selectedDeptIndex]) {
                if (!reenvoudData[selectedDeptIndex].blocks) {
                    reenvoudData[selectedDeptIndex].blocks = [];
                }
                reenvoudData[selectedDeptIndex].blocks.push({ type, title });
                saveData();
                renderSystem();
                blockTitleInput.value = "";
                // Mostrar el departamento actualizado con su nuevo bloque
                switchView(`dept-${selectedDeptIndex}`);
                if (sideMenu) sideMenu.classList.remove("open");
            } else {
                alert("Selecciona un departamento válido en el desplegable.");
            }
        });
    }

    const container = document.getElementById("dynamic-content");
    const fechaActual = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    if (container) {
        container.textContent = `Reenvoud OS Panel Pro Activo - Fecha: ${fechaActual}`;
    }
});
