 document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const sideMenu = document.getElementById("side-menu");
    const closeMenu = document.getElementById("close-menu");
    const backBtn = document.getElementById("back-btn");

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

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            if (window.location.hash && window.location.hash !== "#inicio") {
                history.back();
            } else {
                switchView("inicio", true);
            }
        });
    }

    const addDeptBtn = document.getElementById("add-dept-btn");
    const newDeptInput = document.getElementById("new-dept-name");
    const departmentsList = document.getElementById("departments-list");
    const targetDeptSelect = document.getElementById("target-dept-select");

    const addBlockBtn = document.getElementById("add-block-btn");
    const blockTypeSelect = document.getElementById("block-type");
    const blockFileInput = document.getElementById("block-file");
    const blockTitleInput = document.getElementById("block-title");
    const departmentsContentContainer = document.getElementById("departments-content-container");

    let defaultStructure = [
        {
            name: "Inteligencia Artificial",
            blocks: [
                { type: "article", title: "Introducción a Modelos LLM", mediaUrl: "", mediaType: "" }
            ]
        },
        {
            name: "Desarrollo de Software",
            blocks: [
                { type: "multimedia", title: "Arquitectura Modular Reenvoud", mediaUrl: "", mediaType: "" }
            ]
        }
    ];

    let reenvoudData = JSON.parse(localStorage.getItem("reenvoud_system_data")) || defaultStructure;

    function saveData() {
        localStorage.setItem("reenvoud_system_data", JSON.stringify(reenvoudData));
    }

    function switchView(targetId, updateHistory = true) {
        document.querySelectorAll(".view-section").forEach(sec => {
            sec.classList.remove("active-view");
        });
        
        const selected = document.getElementById(targetId);
        if (selected) {
            selected.classList.add("active-view");
        }

        if (updateHistory) {
            const newUrl = `#${targetId}`;
            history.pushState({ view: targetId }, "", newUrl);
        }
    }

    window.addEventListener("popstate", (event) => {
        if (event.state && event.state.view) {
            switchView(event.state.view, false);
        } else {
            switchView("inicio", false);
        }
    });

    function renderSystem() {
        departmentsList.innerHTML = "";
        targetDeptSelect.innerHTML = "";
        departmentsContentContainer.innerHTML = "";

        if (reenvoudData.length === 0) {
            targetDeptSelect.innerHTML = '<option value="">No hay áreas creadas</option>';
        }

        reenvoudData.forEach((dept, deptIndex) => {
            const deptId = `dept-${deptIndex}`;

            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = `#${deptId}`;
            a.textContent = dept.name;
            
            a.addEventListener("click", (e) => {
                e.preventDefault();
                switchView(deptId, true);
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
                switchView("inicio", true);
            });

            li.appendChild(a);
            li.appendChild(delDeptBtn);
            departmentsList.appendChild(li);

            const option = document.createElement("option");
            option.value = deptIndex;
            option.textContent = dept.name;
            targetDeptSelect.appendChild(option);

            const deptSection = document.createElement("section");
            deptSection.className = "view-section";
            deptSection.id = deptId;

            let subBlocksHTML = "";
            if (dept.blocks && dept.blocks.length > 0) {
                dept.blocks.forEach((block, blockIndex) => {
                    let badge = block.type === 'article' ? '📝 [Artículo / Blog]' : (block.type === 'multimedia' ? '🎬 [Multimedia]' : '📌 [Proyecto]');
                    
                    let mediaElementHTML = '';
                    if (block.mediaUrl) {
                        if (block.mediaType && block.mediaType.startsWith("video")) {
                            mediaElementHTML = `
                                <div style="margin: 12px 0;">
                                    <video controls style="width: 100%; max-height: 350px; border-radius: 8px; border: 1px solid #7a0000; background: #000;">
                                        <source src="${block.mediaUrl}" type="${block.mediaType}">
                                        Tu navegador no soporta la reproducción de video.
                                    </video>
                                </div>
                            `;
                        } else if (block.mediaType && block.mediaType.startsWith("image")) {
                            mediaElementHTML = `
                                <div style="margin: 12px 0;">
                                    <img src="${block.mediaUrl}" alt="${block.title}" style="width: 100%; height: auto; max-height: 350px; object-fit: contain; border-radius: 8px; border: 1px solid #7a0000; background: #000;">
                                </div>
                            `;
                        }
                    }

                    subBlocksHTML += `
                        <div class="sub-block-item">
                            <h4>${badge} ${block.title}</h4>
                            ${mediaElementHTML}
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

        document.querySelectorAll(".delete-sub-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const dIdx = e.target.getAttribute("data-dept");
                const bIdx = e.target.getAttribute("data-block");
                reenvoudData[dIdx].blocks.splice(bIdx, 1);
                saveData();
                renderSystem();
                const activeSec = document.querySelector(".view-section.active-view");
                if (activeSec) switchView(activeSec.id, false);
            });
        });
    }

    const inicioLink = document.getElementById("nav-inicio-link");
    if (inicioLink) {
        inicioLink.addEventListener("click", (e) => {
            e.preventDefault();
            switchView("inicio", true);
            if (sideMenu) sideMenu.classList.remove("open");
        });
    }

    renderSystem();

    if (window.location.hash) {
        const initialView = window.location.hash.substring(1);
        if (document.getElementById(initialView)) {
            switchView(initialView, false);
        }
    }

    if (addDeptBtn) {
        addDeptBtn.addEventListener("click", () => {
            const name = newDeptInput.value.trim();
            if (name) {
                reenvoudData.push({ name: name, blocks: [] });
                saveData();
                renderSystem();
                newDeptInput.value = "";
                switchView(`dept-${reenvoudData.length - 1}`, true);
                if (sideMenu) sideMenu.classList.remove("open");
            } else {
                alert("Escribe un nombre para el área.");
            }
        });
    }

    if (addBlockBtn) {
        addBlockBtn.addEventListener("click", () => {
            const selectedDeptIndex = targetDeptSelect.value;
            const type = blockTypeSelect.value;
            const title = blockTitleInput.value.trim() || "Nueva Página Profesional";
            const file = blockFileInput.files[0];

            if (selectedDeptIndex !== "" && reenvoudData[selectedDeptIndex]) {
                if (!reenvoudData[selectedDeptIndex].blocks) {
                    reenvoudData[selectedDeptIndex].blocks = [];
                }

                let newBlock = { type, title, mediaUrl: "", mediaType: "" };

                if (file) {
                    newBlock.mediaUrl = URL.createObjectURL(file);
                    newBlock.mediaType = file.type; // Captura cualquier formato automáticamente (video/mp4, image/png, video/mkv, etc.)
                }

                reenvoudData[selectedDeptIndex].blocks.push(newBlock);
                saveData();
                renderSystem();
                
                blockTitleInput.value = "";
                blockFileInput.value = "";
                switchView(`dept-${selectedDeptIndex}`, true);
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
