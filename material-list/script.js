// NOTE: This script ASSUMES that DENSITIES, SHEET_SIZES, and MATERIAL_DATA
// have been loaded into the global scope from 'material-data.js'

// ====================================================================
// === ELEMENTS (Assumes corresponding HTML IDs exist) ===
// ====================================================================

const sizeInput = document.getElementById('item-size');
const sizeInputGroup = sizeInput.parentElement;
const lenInput = document.getElementById('item-length');
const lenGroup = document.getElementById('length-group');
const list = document.getElementById('material-list');
const matInput = document.getElementById('item-material');
const qtyInput = document.getElementById('item-quantity');
const wtDisplay = document.getElementById('weight-display');
const shapeInput = document.getElementById('item-shape');
const addButton = document.getElementById('add-button');
const customInputGroup = document.getElementById('custom-input-group');
const customDescriptionInput = document.getElementById('custom-description');
const customWeightInput = document.getElementById('custom-weight');
const customUnitInput = document.getElementById('custom-unit');
let selectedData = {};

// Placeholder assumption for weight/unit input container
const weightUnitGroup = customWeightInput.parentElement; 


// ====================================================================
// === DROPDOWN LOGIC (Handles Input Visibility) ===
// ====================================================================

function updateSizeDropdown() {
    const shape = shapeInput.value;
    const specs = MATERIAL_DATA[shape] || [];
    sizeInput.innerHTML = '';

    // Reset visibility of core input groups
    sizeInputGroup.style.display = 'flex';
    customInputGroup.style.display = 'none';
    lenGroup.style.display = 'flex';
    
    // Ensure weight/unit group is visible by default (for custom/standard mode)
    if (weightUnitGroup) weightUnitGroup.style.display = 'block';

    if (shape === 'custom') { 
        // Custom: Hide size/length, Show custom (with weight/unit)
        sizeInputGroup.style.display = 'none';
        lenGroup.style.display = 'none';
        customInputGroup.style.display = 'flex';
        
        customDescriptionInput.value = '';
        customWeightInput.value = '';
        customUnitInput.value = 'kg';
        
    } else if (shape === 'consumables') {
        // Consumables: Show size, Hide length, Show custom (HIDE weight/unit)
        lenGroup.style.display = 'none';
        customInputGroup.style.display = 'flex';
        if (weightUnitGroup) weightUnitGroup.style.display = 'none'; // HIDE WEIGHT/UNIT INPUTS
        
        // Populate dropdown with consumable labels
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
        // Flat Stock: Show size, Hide length, Hide custom
        lenGroup.style.display = 'none'; 
        
        // Populate size dropdown with T value + Sheet size (W x L)
        specs.forEach(spec => {
            SHEET_SIZES.forEach(sz => {
                const opt = document.createElement('option');
                opt.value = JSON.stringify({ ...spec, sheetW: sz.W, sheetL: sz.L, sizeLabel: sz.label });
                opt.text = `${spec.label} - ${sz.label}`;
                sizeInput.appendChild(opt);
            });
        });

    } else { 
        // Linear Stock (Rods, Angles, Flat Bars, Channels, Beams): Show size, Show length, Hide custom
        lenGroup.style.display = 'flex'; 
        
        // Populate size dropdown with specific H, W, T, or OD
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
        // Consumables are quantity-only
        totalWt = 0;
        unit = 'N/A';
    } else if (shape === 'custom') {
        // Custom uses manual weight input
        const customWeight = parseFloat(customWeightInput.value) || 0;
        unit = customUnitInput.value;
        totalWt = customWeight * qty;
    } else {
        // All metal stock calculations below
        if (!sizeInput.value) {
            wtDisplay.textContent = 'Approx. 0.00 kg';
            return { weight: 0, unit: 'kg' };
        }
        const data = JSON.parse(sizeInput.value);
        selectedData = data;
        const density = DENSITIES[matInput.value];
        let vol_m3 = 0;

        if (shape === 'sheet' || shape === 'plate') {
            // Flat Stock Volume = T * W * L
            vol_m3 = (data.T / 1000) * (data.sheetW / 1000) * (data.sheetL / 1000);
        } else {
            // Linear Stock Volume = Area * Length
            const len_m = parseFloat(lenInput.value) || 0;
            // Dimensions in meters
            const T = (data.T || 0) / 1000, H = (data.H || 0) / 1000, W = (data.W || 0) / 1000, OD = (data.OD || 0) / 1000;
            let area = 0;

            // Cross-sectional Area Calculation
            if (data.type === 'RoundRod') area = Math.PI * Math.pow(OD / 2, 2); // Solid Circle
            else if (data.type === 'Angle') area = (H * T) + ((W - T) * T); // L-Bar (Approximation)
            else if (data.type === 'Flat') area = H * T; // Flat Bar or Square Rod
            else if (data.type === 'Beam') area = (H * W) - ((H - 2 * T) * (W - 2 * T)); // C-Beam or I/H-Beam (Box Approximation)
            else if (data.type === 'Tube' ) area = (H * W) - ((H - 2 * T) * (W - 2 * T));
              else if (data.type === 'Pipe') area = Math.PI * (Math.pow(OD / 2, 2) - Math.pow((OD - 2 * T) / 2, 2)); // Hollow Round

            vol_m3 = area * len_m;
        }
        totalWt = vol_m3 * density * qty;
    }

    // Update the displayed weight
    const displayWtText = (shape === 'consumables' || unit === 'N/A') ? 'N/A' : `${totalWt.toFixed(2)} ${unit}`;
    wtDisplay.textContent = `Approx. ${displayWtText}`;
    
    return { weight: (shape === 'consumables' ? 'N/A' : totalWt.toFixed(2)), unit: unit };
}


// ====================================================================
// === ADD ITEM TO LIST ===
// ====================================================================

function addItemFromInput() {
    const shape = shapeInput.value;
    const mat = matInput.value;
    const qty = qtyInput.value;
    const calc = calculateTotalWeight();
    let name, spec, displayWt;

    if (shape === 'custom') {
        name = customDescriptionInput.value || 'Custom Item';
        const unit = customUnitInput.value;
        spec = `Weight: ${customWeightInput.value} ${unit}`;
        displayWt = unit === 'kg' ? calc.weight : 'N/A';
    } else if (shape === 'consumables') {
        name = customDescriptionInput.value || 'Consumable Item';
        spec = `Type: ${sizeInput.options[sizeInput.selectedIndex].text}`;
        displayWt = 'N/A';
    } else {
        if (!sizeInput.value) return;
        const data = JSON.parse(sizeInput.value);
        selectedData = data;
        if (shape === 'sheet' || shape === 'plate') {
            name = `${mat} ${data.type} ${data.label}`;
            spec = `${data.sizeLabel}`;
        } else {
            name = `${mat} ${data.type} ${data.label}`;
            spec = `Size: ${data.label} | Length: ${lenInput.value} m`;
        }
        displayWt = calc.weight;
    }

    const li = document.createElement('li');
    li.innerHTML = `
        <div class="item-name">${name}<span class="item-spec">${spec}</span></div>
        <div class="weight-col">${displayWt} kg</div>
        <div class="qty-col">${qty} nos</div>
        <div class="delete-button no-print">✖</div>
    `;
    list.appendChild(li);

    li.querySelector('.delete-button').addEventListener('click', function() {
        this.parentElement.remove();
    });
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
