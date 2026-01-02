// NOTE: This script ASSUMES that DENSITIES, SHEET_SIZES, and MATERIAL_DATA
// have been loaded into the global scope from 'material-data.js'

// ====================================================================
// === ELEMENTS (Assumes corresponding HTML IDs exist) ===
// ====================================================================

const sizeInput = document.getElementById('item-size');
const sizeInputGroup = sizeInput.parentElement.parentElement; // Adjust for new layout if needed, though simple parentElement is safer usually. Wait, in HTML sizeInput is in .input-group.
// Actually, let's just stick to element references.
const sizeInputGroupDiv = document.getElementById('item-size').parentElement; 
const lenInput = document.getElementById('item-length');
const lenGroup = document.getElementById('length-group');
const list = document.getElementById('material-list');
const matInput = document.getElementById('item-material');
const qtyInput = document.getElementById('item-quantity');
const priceInput = document.getElementById('item-price'); // New
const wtDisplay = document.getElementById('weight-display');
const shapeInput = document.getElementById('item-shape');
const shapeIconContainer = document.getElementById('shape-icon'); // New
const addButton = document.getElementById('add-button');
const customInputGroup = document.getElementById('custom-input-group');
const customDescriptionInput = document.getElementById('custom-description');
const customWeightInput = document.getElementById('custom-weight');
const customUnitInput = document.getElementById('custom-unit');

// Dashboard Elements
const totalWeightVal = document.getElementById('total-weight-val');
const totalItemsVal = document.getElementById('total-items-val');
const totalCostVal = document.getElementById('total-cost-val');

// Action Buttons
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const clearBtn = document.getElementById('clear-btn');
const whatsappBtn = document.getElementById('whatsapp-btn');


let selectedData = {};
// Placeholder assumption for weight/unit input container
const weightUnitGroup = customWeightInput.parentElement; 

// --- K-FACTORS (Geometric Correction) ---
const K_FACTORS = {
    'Angle': 1.02,   
    'Channel': 1.04, 
    'IBeam': 1.03,   
    'SquareRod': 1.0,
    'FlatBar': 1.0,
    'RoundRod': 1.0,
    'Tube': 1.0,
    'Pipe': 1.0
};


// ====================================================================
// === VISUALS & DROPDOWN LOGIC ===
// ====================================================================

function updateShapeIcon() {
    const shape = shapeInput.value;
    const iconName = shape === 'custom' ? 'custom' : 
                     shape === 'consumables' ? 'consumables' : 
                     shape; // Map value to filename
    
    // Simple fetch or inject. Since we are local, we can just set innerHTML 
    // but ideally we'd use <img src> or fetch(). 
    // Let's use <img src> for simplicity and caching.
    shapeIconContainer.innerHTML = `<img src="icons/${iconName}.svg" style="width:100%; height:100%;" alt="${shape}">`;
}

function updateSizeDropdown() {
    const shape = shapeInput.value;
    const specs = MATERIAL_DATA[shape] || [];
    sizeInput.innerHTML = '';

    // Update Icon
    updateShapeIcon();

    // Reset visibility of core input groups
    sizeInputGroupDiv.style.display = 'flex';
    customInputGroup.style.display = 'none';
    lenGroup.style.display = 'flex';
    
    // Ensure weight/unit group is visible by default (for custom/standard mode)
    if (weightUnitGroup) weightUnitGroup.style.display = 'block';

    if (shape === 'custom') { 
        sizeInputGroupDiv.style.display = 'none';
        lenGroup.style.display = 'none';
        customInputGroup.style.display = 'flex';
        
        customDescriptionInput.value = '';
        customWeightInput.value = '';
        customUnitInput.value = 'kg';
        
    } else if (shape === 'consumables') {
        lenGroup.style.display = 'none';
        customInputGroup.style.display = 'flex';
        if (weightUnitGroup) weightUnitGroup.style.display = 'none'; 
        
        specs.forEach(spec => {
            const opt = document.createElement('option');
            opt.value = JSON.stringify(spec);
            opt.text = spec.label;
            sizeInput.appendChild(opt);
        });

        customDescriptionInput.value = '';
        customWeightInput.value = '';
        customUnitInput.value = 'nos';
        
    } else if (shape === 'sheet' || shape === 'plate') {
        lenGroup.style.display = 'none'; 
        
        specs.forEach(spec => {
            SHEET_SIZES.forEach(sz => {
                const opt = document.createElement('option');
                opt.value = JSON.stringify({ ...spec, sheetW: sz.W, sheetL: sz.L, sizeLabel: sz.label });
                opt.text = `${spec.label} - ${sz.label}`;
                sizeInput.appendChild(opt);
            });
        });

    } else { 
        lenGroup.style.display = 'flex'; 
        
        specs.forEach(spec => {
            const opt = document.createElement('option');
            opt.value = JSON.stringify(spec);
            opt.text = spec.label;
            sizeInput.appendChild(opt);
        });
    }
    
    calculateTotalWeight();
}


// ====================================================================
// === WEIGHT CALCULATION ===
// ====================================================================

function calculateTotalWeight() {
    const shape = shapeInput.value;
    const qty = parseFloat(qtyInput.value) || 0;
    let totalWt = 0;
    let unit = 'kg';

    if (shape === 'consumables') { 
        totalWt = 0;
        unit = 'N/A';
    } else if (shape === 'custom') {
        const customWeight = parseFloat(customWeightInput.value) || 0;
        unit = customUnitInput.value;
        totalWt = customWeight * qty;
    } else {
        if (!sizeInput.value) {
            wtDisplay.textContent = 'Approx. 0.00 kg';
            return { weight: 0, unit: 'kg' };
        }
        const data = JSON.parse(sizeInput.value);
        selectedData = data;
        const density = DENSITIES[matInput.value];
        const msDensity = DENSITIES['Mild_Steel']; 

        if (data.weight && shape !== 'sheet' && shape !== 'plate') {
            const len_m = parseFloat(lenInput.value) || 0;
            const baseWeight = data.weight * len_m; 
            totalWt = baseWeight * (density / msDensity) * qty;
        } else {
            let vol_m3 = 0;

            if (shape === 'sheet' || shape === 'plate') {
                vol_m3 = (data.T / 1000) * (data.sheetW / 1000) * (data.sheetL / 1000);
            } else {
                const len_m = parseFloat(lenInput.value) || 0;
                const T = (data.T || 0) / 1000, H = (data.H || 0) / 1000, W = (data.W || 0) / 1000, OD = (data.OD || 0) / 1000;
                let area = 0;

                if (data.type === 'RoundRod') area = Math.PI * Math.pow(OD / 2, 2); 
                else if (data.type === 'Angle') area = (H * T) + ((W - T) * T); 
                else if (data.type === 'FlatBar' || data.type === 'SquareRod' || data.type === 'Flat') area = H * T; 
                else if (data.type === 'Tube') area = (H * W) - ((H - 2 * T) * (W - 2 * T)); 
                else if (data.type === 'Pipe') area = Math.PI * (Math.pow(OD / 2, 2) - Math.pow((OD - 2 * T) / 2, 2)); 
                else if (data.type === 'Channel') area = (H * T) + 2 * (W - T) * T; 
                else if (data.type === 'IBeam') area = (H - 2 * T) * T + 2 * W * T; 

                const kFactor = K_FACTORS[data.type] || 1.0;
                area = area * kFactor;

                vol_m3 = area * len_m;
            }
            totalWt = vol_m3 * density * qty;
        }
    }

    const displayWtText = (shape === 'consumables' || unit === 'N/A') ? 'N/A' : `${totalWt.toFixed(2)} ${unit}`;
    wtDisplay.textContent = `Approx. ${displayWtText}`;
    
    return { weight: (shape === 'consumables' ? 'N/A' : totalWt.toFixed(2)), unit: unit };
}


// ====================================================================
// === DASHBOARD & LIST MANAGEMENT ===
// ====================================================================

function updateDashboard() {
    let totalW = 0;
    let totalC = 0;
    let count = 0;
    const items = list.querySelectorAll('li');
    
    items.forEach(item => {
        count++;
        // Extract stored numeric data attributes if available, else parse text
        const w = parseFloat(item.dataset.weight || 0);
        const c = parseFloat(item.dataset.cost || 0);
        totalW += w;
        totalC += c;
    });

    totalWeightVal.textContent = totalW.toFixed(2) + ' kg';
    totalItemsVal.textContent = count;
    totalCostVal.textContent = totalC.toFixed(2);
}

function addItemFromInput() {
    const shape = shapeInput.value;
    const mat = matInput.value;
    const qty = parseFloat(qtyInput.value) || 1;
    const price = parseFloat(priceInput.value) || 0;
    const calc = calculateTotalWeight();
    
    let name, spec, displayWt, numericWeight;

    if (shape === 'custom') {
        name = customDescriptionInput.value || 'Custom Item';
        const unit = customUnitInput.value;
        spec = `Weight: ${customWeightInput.value} ${unit}`;
        numericWeight = (unit === 'kg') ? calc.weight : 0;
        displayWt = unit === 'kg' ? calc.weight : 'N/A';
    } else if (shape === 'consumables') {
        name = customDescriptionInput.value || 'Consumable Item';
        spec = `Type: ${sizeInput.options[sizeInput.selectedIndex].text}`;
        displayWt = 'N/A';
        numericWeight = 0;
    } else {
        if (!sizeInput.value) return;
        const data = JSON.parse(sizeInput.value);
        if (shape === 'sheet' || shape === 'plate') {
            name = `${mat} ${data.type} ${data.label}`;
            spec = `${data.sizeLabel}`;
        } else {
            name = `${mat} ${data.type} ${data.label}`;
            spec = `Size: ${data.label} | Length: ${lenInput.value} m`;
        }
        displayWt = calc.weight;
        numericWeight = parseFloat(calc.weight);
    }
    
    const cost = (price > 0) ? (price * qty) : 0; // Simple Price * Qty (Assumption: Price is per Unit)
    // OR if Price is per Kg, we should calculate that. 
    // Let's assume Price is Per UNIT/NOS for simplicity as per label "Price/Unit".
    
    const li = document.createElement('li');
    li.dataset.weight = numericWeight; // Store raw number for summation
    li.dataset.cost = cost;

    li.innerHTML = `
        <div class="item-name">${name}<span class="item-spec">${spec}</span></div>
        <div class="weight-col">${displayWt} kg<br><span style="font-size:0.8em; color:#2e7d32;">${cost > 0 ? '₹'+cost.toFixed(2) : ''}</span></div>
        <div class="qty-col">${qty} nos</div>
        <div class="delete-button no-print" title="Remove Item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
    `;
    list.appendChild(li);

    li.querySelector('.delete-button').addEventListener('click', function() {
        this.parentElement.remove();
        updateDashboard();
    });
    
    updateDashboard();
}

// ====================================================================
// === STORAGE & SHARING ===
// ====================================================================

// Modal Elements
const loadModal = document.getElementById('load-modal');
const alertModal = document.getElementById('alert-modal'); // New Alert Modal
const alertMessage = document.getElementById('alert-message');
const alertOkBtn = document.getElementById('alert-ok-btn');
const savedProjectsList = document.getElementById('saved-projects-list');
const closeModalBtn = document.getElementById('close-modal-btn');
const closeModalX = document.querySelector('.close-modal');

function showAlert(msg) {
    alertMessage.textContent = msg;
    alertModal.style.display = 'flex';
}

function closeAlert() {
    alertModal.style.display = 'none';
}

alertOkBtn.addEventListener('click', closeAlert);

function openModal() {
    loadModal.style.display = 'flex';
    renderSavedProjects();
}

function closeModal() {
    loadModal.style.display = 'none';
}

// Close modal event listeners
closeModalBtn.addEventListener('click', closeModal);
closeModalX.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target == loadModal) closeModal();
    if (event.target == alertModal) closeAlert();
});


function saveList() {
    const items = [];
    if (list.children.length === 0) {
        showAlert("The material list is empty! Add items before saving.");
        return;
    }

    list.querySelectorAll('li').forEach(li => {
        items.push(li.innerHTML); 
    });

    let projectName = prompt("Enter a name for this project:", "My Project");
    if (projectName) {
        // Get existing projects
        const projects = JSON.parse(localStorage.getItem('matList_projects') || '{}');
        
        // Check for overwrite
        if (projects[projectName] && !confirm(`Project "${projectName}" already exists. Overwrite?`)) {
            return;
        }

        projects[projectName] = items;
        localStorage.setItem('matList_projects', JSON.stringify(projects));
        showAlert(`Project "${projectName}" saved successfully!`);
    }
}

function renderSavedProjects() {
    const projects = JSON.parse(localStorage.getItem('matList_projects') || '{}');
    savedProjectsList.innerHTML = '';
    const names = Object.keys(projects);

    if (names.length === 0) {
        savedProjectsList.innerHTML = '<li style="justify-content:center; color:#888;">No saved projects found.</li>';
        return;
    }

    names.forEach(name => {
        const li = document.createElement('li');
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'project-name';
        nameSpan.textContent = name;
        nameSpan.onclick = () => loadProject(name); // Load on click

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-project-btn';
        delBtn.textContent = 'Delete';
        delBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent loading when deleting
            deleteProject(name);
        };

        li.appendChild(nameSpan);
        li.appendChild(delBtn);
        savedProjectsList.appendChild(li);
    });
}

function loadProject(name) {
    if(!confirm(`Load project "${name}"? Current unsaved list will be replaced.`)) return;

    const projects = JSON.parse(localStorage.getItem('matList_projects') || '{}');
    const data = projects[name];

    if (data) {
        list.innerHTML = '';
        data.forEach(html => {
            const li = document.createElement('li');
            li.innerHTML = html;
            
            // Re-attach listeners
            li.querySelector('.delete-button').addEventListener('click', function() {
                this.parentElement.remove();
                updateDashboard();
            });
            list.appendChild(li);
        });
        
        updateDashboard();
        closeModal();
    }
}

function deleteProject(name) {
    if(confirm(`Permanently delete project "${name}"?`)) {
        const projects = JSON.parse(localStorage.getItem('matList_projects') || '{}');
        delete projects[name];
        localStorage.setItem('matList_projects', JSON.stringify(projects));
        renderSavedProjects(); // Refresh list
    }
}


function loadList() {
    const projects = JSON.parse(localStorage.getItem('matList_projects') || '{}');
    if (Object.keys(projects).length === 0) {
        showAlert("No saved projects found.");
        return;
    }
    openModal();
}

function clearList() {
    if(confirm('Clear current list?')) {
        list.innerHTML = '';
        updateDashboard();
    }
}

function shareWhatsApp() {
    let text = "*Material List Request*\n\n";
    let totalW = 0;
    
    list.querySelectorAll('li').forEach(li => {
        // Parse text content for cleaner sharing
        const name = li.querySelector('.item-name').innerText.split('\n')[0]; // Name only
        const spec = li.querySelector('.item-spec').innerText;
        const qty = li.querySelector('.qty-col').innerText;
        const wt = li.querySelector('.weight-col').innerText.split('\n')[0]; // Weight only
        
        text += `• ${name} (${qty})\n  ${spec} - ${wt}\n`;
    });
    
    text += `\n*Total Items:* ${totalItemsVal.textContent}`;
    text += `\n*Total Weight:* ${totalWeightVal.textContent}`;
    text += `\n*Est. Cost:* ₹${totalCostVal.textContent}`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}


// ====================================================================
// === INITIALIZATION AND EVENT LISTENERS ===
// ====================================================================

// Standard listeners
shapeInput.addEventListener('change', updateSizeDropdown);
matInput.addEventListener('change', calculateTotalWeight);
sizeInput.addEventListener('change', calculateTotalWeight);
lenInput.addEventListener('input', calculateTotalWeight);
qtyInput.addEventListener('input', calculateTotalWeight);
customDescriptionInput.addEventListener('input', calculateTotalWeight);
customWeightInput.addEventListener('input', calculateTotalWeight);
customUnitInput.addEventListener('change', calculateTotalWeight);
addButton.addEventListener('click', addItemFromInput);

saveBtn.addEventListener('click', saveList);
loadBtn.addEventListener('click', loadList);
clearBtn.addEventListener('click', clearList);
whatsappBtn.addEventListener('click', shareWhatsApp);

// Listener for consumables change (updates description and clears weight)
sizeInput.addEventListener('change', function() {
    if (shapeInput.value === 'consumables' && sizeInput.value) {
        const data = JSON.parse(sizeInput.value);
        customDescriptionInput.value = data.customDescription || data.label;
        customWeightInput.value = ''; 
        customUnitInput.value = 'nos'; 
        calculateTotalWeight();
    }
});


// Initial call to set up the dropdowns and calculation display on page load
updateSizeDropdown();
