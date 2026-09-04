
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

    // Estructura de departamentos con sus sub-bloques (páginas/blogs profesionales)
    let defaultStructure = [
        {
            name: "Inteligencia Artificial",
            blocks: [
                { type: "article", title: "Introducción a Modelos LLM" },
                { type: "project", title: "Entorno Ollama v3" }
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

    function renderSystem() {
        departmentsList.innerHTML = "";
        targetDeptSelect.innerHTML = "";
        departmentsContentContainer.innerHTML = "";

        reenvoudData.forEach((dept, deptIndex) => {
            // 1. Llenar menú lateral de áreas
            const li = document.createElement("li");
            const a = document.createElement("a");
            const deptId = `dept-${deptIndex}`;
            a.href = `#${deptId}`;
            a.textContent = dept.name;
            
            const delDeptBtn = document.createElement("button");
            delDeptBtn.innerHTML = "🗑️";
            delDeptBtn.className = "delete-dept-btn";
            delDeptBtn.title = "Borrar área completa";
            delDeptBtn.addEventListener("click", () => {
                reenvoudData.splice(deptIndex, 1);
                saveData();
                renderSystem();
            });

            li.appendChild(a);
            li.appendChild(delDeptBtn);
            departmentsList.appendChild(li);

            // 2. Llenar selector del panel administrador
            const option = document.createElement("option");
            option.value = deptIndex;
            option.textContent = dept.name;
            targetDeptSelect.appendChild(option);

            // 3. Renderizar contenedor visual del departamento en la página principal
            const deptSection = document.createElement("section");
            deptSection.className = "department-section";
            deptSection.id = deptId;

            let subBlocksHTML = "";
            dept.blocks.forEach((block, blockIndex) => {
                let badge = block.type === 'article' ? '📝 [Artículo / Blog]' : (block.type === 'multimedia' ? '🎬 [Multimedia]' : '📌 [Proyecto]');
                subBlocksHTML += `
                    <div class="sub-block-item">
                        <h4>${badge} ${block.title}</h4>
                        <p>Contenido profesional estructurado para la sección ${dept.name}. Listo para desarrollo avanzado.</p>
                        <button class="delete-sub-btn" data-dept="${deptIndex}" data-block="${blockIndex}">🗑️ Borrar Subsección</button>
                    </div>
                `;
            });

            deptSection.innerHTML = `
                <div class="department-header">
                    <h2>📁 ${dept.name}</h2>
                </div>
                <div class="sub-blocks-grid">
                    ${subBlocksHTML || '<p style="color:#777;">Sin subsecciones creadas todavía en esta área.</p>'}
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
            });
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
                alert(`Área "${name}" creada con éxito.`);
            }
        });
    }

    // Añadir subsección profesional o página al departamento seleccionado
    if (addBlockBtn) {
        addBlockBtn.addEventListener("click", () => {
            const selectedDeptIndex = targetDeptSelect.value;
            const type = blockTypeSelect.value;
            const title = blockTitleInput.value.trim() || "Nueva Página Profesional";

            if (selectedDeptIndex !== "" && reenvoudData[selectedDeptIndex]) {
                reenvoudData[selectedDeptIndex].blocks.push({ type, title });
                saveData();
                renderSystem();
                blockTitleInput.value = "";
                alert("Subsección añadida correctamente al área.");
            } else {
                alert("Selecciona un departamento válido primero.");
            }
        });
    }

    const container = document.getElementById("dynamic-content");
    const fechaActual = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    if (container) {
        container.textContent = `Reenvoud OS Panel Pro Activo - Fecha: ${fechaActual}`;
    }
});
