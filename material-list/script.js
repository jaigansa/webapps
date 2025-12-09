// --- CONFIG ---
const DENSITIES = { 'MS': 7850, 'SS': 8000 };
const SHEET_SIZES = [
  { label: '8ft x 4ft (1220x2440mm)', W: 1220, L: 2440 },
  { label: '8ft x 5ft (1525x2440mm)', W: 1525, L: 2440 },
  { label: '10ft x 5ft (1525x3050mm)', W: 1525, L: 3050 }
];
const MATERIAL_DATA = {
  angle: [
    { label:'20x20x3', H:20, W:20, T:3, type:'Angle' },
    { label:'25x25x3', H:25, W:25, T:3, type:'Angle' },
    { label:'40x40x5', H:40, W:40, T:5, type:'Angle' },
    { label:'50x50x6', H:50, W:50, T:6, type:'Angle' },
    { label:'75x75x8', H:75, W:75, T:8, type:'Angle' },
    { label:'100x100x10', H:100, W:100, T:10, type:'Angle' }
  ],
  flat: [
    { label:'20x3', H:20, W:1000, T:3, type:'Flat' },
    { label:'25x3', H:25, W:1000, T:3, type:'Flat' },
    { label:'40x6', H:40, W:1000, T:6, type:'Flat' },
    { label:'50x8', H:50, W:1000, T:8, type:'Flat' },
    { label:'100x10', H:100, W:1000, T:10, type:'Flat' }
  ],
  tube: [
    { label:'20x40x2', H:20, W:40, T:2, type:'Tube' },
    { label:'25x50x2', H:25, W:50, T:2, type:'Tube' },
    { label:'50x100x3', H:50, W:100, T:3, type:'Tube' },
    { label:'40x40x2', H:40, W:40, T:2, type:'Tube' },
    { label:'50x50x2.5', H:50, W:50, T:2.5, type:'Tube' },
    { label:'100x50x3', H:100, W:50, T:3, type:'Tube' }
  ],
  pipe: [
    { label:'1.5 inch (48.3x3)', OD:48.3, T:3, type:'Pipe' },
    { label:'2.0 inch (60.3x3.6)', OD:60.3, T:3.6, type:'Pipe' },
    { label:'3.0 inch (88.9x4)', OD:88.9, T:4, type:'Pipe' }
  ],
  channel: [{ label:'100x50x5', H:100, W:50, T:5, type:'Channel' }],
  beam: [{ label:'150x75x6', H:150, W:75, T:6, type:'Beam' }],
  sheet: [
    { label:'1.0 mm (20 Gauge)', T:1.0, type:'Sheet' },
    { label:'1.6 mm (16 Gauge)', T:1.6, type:'Sheet' },
    { label:'2.0 mm (14 Gauge)', T:2.0, type:'Sheet' },
    { label:'3.0 mm (10 Gauge)', T:3.0, type:'Sheet' }
  ],
  plate: [
    { label:'6 mm', T:6, type:'Plate' },
    { label:'8 mm', T:8, type:'Plate' },
    { label:'10 mm', T:10, type:'Plate' },
    { label:'12 mm', T:12, type:'Plate' },
    { label:'16 mm', T:16, type:'Plate' }
  ],
  custom: []
};

// --- ELEMENTS ---
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

// --- DROPDOWN LOGIC ---
function updateSizeDropdown() {
  const shape = shapeInput.value;
  const specs = MATERIAL_DATA[shape] || [];
  sizeInput.innerHTML = '';

  if (shape === 'custom') {
    sizeInputGroup.style.display = 'none';
    lenGroup.style.display = 'none';
    customInputGroup.style.display = 'flex';
  } else {
    sizeInputGroup.style.display = 'flex';
    customInputGroup.style.display = 'none';
    if (shape === 'sheet' || shape === 'plate') {
      specs.forEach(spec => {
        SHEET_SIZES.forEach(sz => {
          const opt = document.createElement('option');
          opt.value = JSON.stringify({ ...spec, sheetW: sz.W, sheetL: sz.L, sizeLabel: sz.label });
          opt.text = `${spec.label} - ${sz.label}`;
          sizeInput.appendChild(opt);
        });
      });
      lenGroup.style.display = 'none';
    } else {
      specs.forEach(spec => {
        const opt = document.createElement('option');
        opt.value = JSON.stringify(spec);
        opt.text = spec.label;
        sizeInput.appendChild(opt);
      });
      lenGroup.style.display = 'flex';
    }
  }
  calculateTotalWeight();
}

// --- WEIGHT CALCULATION ---
function calculateTotalWeight() {
  const shape = shapeInput.value;
  const qty = parseFloat(qtyInput.value) || 0;
  let totalWt = 0;
  let unit = 'kg';

  if (shape === 'custom') {
    const customWeight = parseFloat(customWeightInput.value) || 0;
    unit = customUnitInput.value;
    totalWt = customWeight * qty;
    wtDisplay.textContent = `Approx. ${totalWt.toFixed(2)} ${unit}`;
    return { weight: totalWt.toFixed(2), unit: unit };
  } else {
    if (!sizeInput.value) {
      wtDisplay.textContent = 'Approx. 0.00 kg';
      return { weight: 0, unit: 'kg' };
    }
    const data = JSON.parse(sizeInput.value);
    selectedData = data;
    const density = DENSITIES[matInput.value];
    let vol_m3 = 0;

    if (shape === 'sheet' || shape === 'plate') {
      vol_m3 = (data.T / 1000) * (data.sheetW / 1000) * (data.sheetL / 1000);
    } else {
      const len_m = parseFloat(lenInput.value) || 0;
      const T = (data.T || 0) / 1000, H = (data.H || 0) / 1000, W = (data.W || 0) / 1000, OD = (data.OD || 0) / 1000;
      let area = 0;
      if (data.type === 'Angle' || data.type === 'Channel') area = (H * T) + ((W - T) * T);
      else if (data.type === 'Flat') area = H * T;
      else if (data.type === 'Tube' || data.type === 'Beam') area = (H * W) - ((H - 2 * T) * (W - 2 * T));
      else if (data.type === 'Pipe') area = Math.PI * (Math.pow(OD / 2, 2) - Math.pow((OD - 2 * T) / 2, 2));
      vol_m3 = area * len_m;
    }
    totalWt = vol_m3 * density * qty;
  }

  wtDisplay.textContent = `Approx. ${totalWt.toFixed(2)} kg`;
  return { weight: totalWt.toFixed(2), unit: 'kg' };
}

// --- ADD ITEM ---
function addItemFromInput() {
  const shape = shapeInput.value;
  const mat = matInput.value;
  const qty = qtyInput.value;
  const calc = calculateTotalWeight(); // Recalculate just to be safe
  let name, spec, displayWt;

  if (shape === 'custom') {
    name = customDescriptionInput.value || 'Custom Item';
    const unit = customUnitInput.value;
    spec = `Value: ${customWeightInput.value} ${unit}`;
    displayWt = unit === 'kg' ? calc.weight : 'N/A';
  } else {
    if (!sizeInput.value) return;
    const data = JSON.parse(sizeInput.value);
    selectedData = data;
    if (shape === 'sheet' || shape === 'plate') {
      name = `${mat} ${data.type} ${data.label}`;
      spec = `${data.sizeLabel}`;
    } else {
      name = `${mat} ${data.type} ${data.label}`;
      spec = `Length: ${lenInput.value} m`;
    }
    displayWt = calc.weight;
  }

  const li = document.createElement('li');
  li.innerHTML = `
    <div class="item-name">${name}<span class="item-spec">${spec}</span></div>
    <div class="weight-col">${displayWt}</div>
    <div class="qty-col">${qty}</div>
    <div class="delete-button no-print">✖</div>
  `;
  list.appendChild(li);

  li.querySelector('.delete-button').addEventListener('click', function() {
    this.parentElement.remove();
  });
}

// --- INITIALIZATION AND EVENT LISTENERS ---
shapeInput.addEventListener('change', updateSizeDropdown);
matInput.addEventListener('change', calculateTotalWeight);
sizeInput.addEventListener('change', calculateTotalWeight);
lenInput.addEventListener('input', calculateTotalWeight);
qtyInput.addEventListener('input', calculateTotalWeight);
customDescriptionInput.addEventListener('input', calculateTotalWeight);
customWeightInput.addEventListener('input', calculateTotalWeight);
customUnitInput.addEventListener('change', calculateTotalWeight);
addButton.addEventListener('click', addItemFromInput);

// Initial call to set up the dropdowns and calculation display on page load
updateSizeDropdown();
