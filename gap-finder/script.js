/**
 * GRILL PRO - FIXED MODEL & WORKSHOP THEME
 */

let scene, camera, renderer, modelGroup, controls;
let isRotating = false;

window.onload = () => {
    init3D();
    setupEventListeners();
    calculate();
};

async function init3D() {
    const container = document.getElementById('three-container');
    if (!container) return;

    // 1. Scene & Background
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // Pure White Background

    // 2. Camera
    camera = new THREE.PerspectiveCamera(35, container.offsetWidth / 450, 1, 10000);
    camera.position.set(1200, 1000, 1500);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, 450);
    container.appendChild(renderer.domElement);

    // 4. Lights (Crucial for Red-Oxide and Black contrast)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(1000, 1000, 1000);
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.5);
    fillLight.position.set(-1000, 500, 500);
    scene.add(fillLight);

    // 5. Grid Helper
    const grid = new THREE.GridHelper(2000, 20, 0xdddddd, 0xeeeeee);
    grid.position.y = -500;
    scene.add(grid);

    // 6. Load Controls & UI
    await loadOrbitControls();
    addControlUI();
    animate();
}

async function loadOrbitControls() {
    return new Promise((resolve) => {
        if (window.THREE && THREE.OrbitControls) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
        script.onload = () => {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            resolve();
        };
        document.head.appendChild(script);
    });
}

function addControlUI() {
    const container = document.getElementById('three-container');
    const wrap = document.createElement('div');
    wrap.style = "position:absolute; bottom:15px; left:15px; display:flex; gap:8px; z-index:100; flex-wrap:wrap;";
    
    const createBtn = (txt, fn) => {
        const b = document.createElement('button');
        b.innerHTML = txt;
        b.style = "background:#ffffff; color:#334155; border:2px solid #e2e8f0; padding:8px 12px; border-radius:8px; font-size:10px; font-weight:800; cursor:pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: all 0.2s;";
        b.onmouseover = () => b.style.borderColor = "#3b82f6";
        b.onmouseout = () => b.style.borderColor = "#e2e8f0";
        b.onclick = fn;
        return b;
    };

    const rotBtn = createBtn("▶ SPIN", () => {
        isRotating = !isRotating;
        rotBtn.innerHTML = isRotating ? "⏸ STOP" : "▶ SPIN";
    });

    wrap.appendChild(rotBtn);
    wrap.appendChild(createBtn("TOP", () => { camera.position.set(0, 2500, 0); camera.lookAt(0,0,0); }));
    wrap.appendChild(createBtn("SIDE", () => { camera.position.set(2500, 0, 0); camera.lookAt(0,0,0); }));
    wrap.appendChild(createBtn("FRONT", () => { camera.position.set(0, 0, 2500); camera.lookAt(0,0,0); }));
    
    container.appendChild(wrap);
}

function setupEventListeners() {
    const inputs = ['totalWidth', 'totalHeight', 'fFace', 'fDepth', 'barCount', 'barFace', 'barDepth', 'zOffset', 'unitSelect'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculate);
    });
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    document.getElementById('whatsappBtn').addEventListener('click', shareWhatsApp);
}

function step(id, val) {
    const el = document.getElementById(id);
    if (el) {
        el.value = (parseFloat(el.value) + val).toFixed(1);
        calculate();
    }
}

function calculate() {
    const unit = document.getElementById('unitSelect').value;
    const L = parseFloat(document.getElementById('totalWidth').value) || 0;
    const H = parseFloat(document.getElementById('totalHeight').value) || 0;
    const fF = parseFloat(document.getElementById('fFace').value) || 0;
    const fD = parseFloat(document.getElementById('fDepth').value) || 0;
    const bF = parseFloat(document.getElementById('barFace').value) || 0;
    const bD = parseFloat(document.getElementById('barDepth').value) || 0;
    const n = parseInt(document.getElementById('barCount').value) || 0;
    const zOff = parseFloat(document.getElementById('zOffset').value) || 0;

    const gap = (n > 0) ? (L - (n * bF)) / (n + 1) : L;
    const outerW = L + (fF * 2);
    const outerH = H + (fF * 2);
    const diag = Math.sqrt(Math.pow(outerW, 2) + Math.pow(outerH, 2));
    
    document.getElementById('gapRes').innerText = gap.toFixed(2) + unit;
    document.getElementById('spacerRes').innerText = gap.toFixed(2) + unit;
    document.getElementById('diagRes').innerText = diag.toFixed(1) + unit;
    document.getElementById('offsetVal').innerText = zOff + unit;

    let tableRows = "";
    let cur = gap;
    for(let i = 1; i <= n; i++) {
        tableRows += `<tr>
            <td class="p-4 text-slate-500 font-bold">ROD ${i}</td>
            <td class="p-4 text-emerald-600 font-black">${cur.toFixed(2)}</td>
            <td class="p-4 text-blue-600 font-black">${(cur + bF/2).toFixed(2)}</td>
            <td class="p-4 text-rose-600 font-black">${(cur + bF).toFixed(2)}</td>
        </tr>`;
        cur += (gap + bF);
    }
    document.getElementById('markTable').innerHTML = tableRows;
    updateModel(L, H, fF, fD, bF, bD, n, gap, zOff);
}

function updateModel(L, H, fF, fD, bF, bD, n, gap, zOff) {
    if (modelGroup) scene.remove(modelGroup);
    modelGroup = new THREE.Group();
    
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x922b21, roughness: 0.7 }); // Red Oxide
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }); // Black

    // Rods
    let startX = -(L/2) + gap + (bF/2);
    for(let i = 0; i < n; i++) {
        const rod = new THREE.Mesh(new THREE.BoxGeometry(bF, H, bD), rodMat);
        rod.position.set(startX, 0, zOff);
        modelGroup.add(rod);
        startX += (gap + bF);
    }
    
    // Frame
    const hGeo = new THREE.BoxGeometry(L + fF*2, fF, fD);
    const top = new THREE.Mesh(hGeo, frameMat); top.position.y = H/2 + fF/2;
    const bot = top.clone(); bot.position.y = -(H/2 + fF/2);
    
    const vGeo = new THREE.BoxGeometry(fF, H + fF*2, fD);
    const left = new THREE.Mesh(vGeo, frameMat); left.position.x = -(L/2 + fF/2);
    const right = left.clone(); right.position.x = (L/2 + fF/2);
    
    modelGroup.add(top, bot, left, right);
    scene.add(modelGroup);
}

function animate() {
    requestAnimationFrame(animate);
    if (isRotating && modelGroup) modelGroup.rotation.y += 0.005;
    if (controls) controls.update();
    renderer.render(scene, camera);
}

function resetForm() {
    location.reload(); // Simplest way to reset everything to default
}

function shareWhatsApp() {
    const unit = document.getElementById('unitSelect').value;
    let msg = `*GRILL SHOP REPORT [${unit.toUpperCase()}]*\n`;
    msg += `Clear Gap: ${document.getElementById('gapRes').innerText}\n`;
    msg += `--------------------------\n`;
    document.querySelectorAll("#markTable tr").forEach(row => {
        const cols = row.querySelectorAll("td");
        msg += `• ${cols[0].innerText}: ${cols[1].innerText} | ${cols[2].innerText} | ${cols[3].innerText}\n`;
    });
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}
