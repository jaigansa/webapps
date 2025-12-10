// --- CONFIGURATION DATA ---
const DENSITIES = {
    "Mild_Steel": 7850,
    "Aluminum_6061": 2700,
    "Stainless_304": 7980
};

const SHEET_SIZES = [
    { label: '4 ft x 8 ft', W: 1219, L: 2438 },
    { label: '5 ft x 10 ft', W: 1524, L: 3048 }
];

// --- MATERIAL AND SIZE DATA ---
const MATERIAL_DATA = {
    // --- FLAT STOCK ---
    sheet: [
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

    // --- RODS ---
    rod_round: [
        { label:'5 mm Dia', OD: 5, type:'RoundRod' },
        { label:'8 mm Dia', OD: 8, type:'RoundRod' },
        { label:'12 mm Dia', OD: 12, type:'RoundRod' },
        { label:'20 mm Dia', OD: 20, type:'RoundRod' },
        { label:'30 mm Dia', OD: 30, type:'RoundRod' },
        { label:'50 mm Dia', OD: 50, type:'RoundRod' }
    ],
    rod_square: [
        { label:'5 mm Sq', H: 5, T: 5, type:'Flat' },
        { label:'10 mm Sq', H: 10, T: 10, type:'Flat' },
        { label:'20 mm Sq', H: 20, T: 20, type:'Flat' },
        { label:'30 mm Sq', H: 30, T: 30, type:'Flat' },
        { label:'50 mm Sq', H: 50, T: 50, type:'Flat' }
    ],
    
    // --- FLAT BAR ---
    flat: [
        // Thickness (T) x Width (H)
        { label: '3 x 12 mm', H: 12, T: 3, type: 'Flat' },
        { label: '3 x 20 mm', H: 20, T: 3, type: 'Flat' },
        { label: '3 x 30 mm', H: 30, T: 3, type: 'Flat' },
        { label: '3 x 40 mm', H: 40, T: 3, type: 'Flat' },
        { label: '3 x 50 mm', H: 50, T: 3, type: 'Flat' },
        { label: '5 x 20 mm', H: 20, T: 5, type: 'Flat' },
        { label: '5 x 30 mm', H: 30, T: 5, type: 'Flat' },
        { label: '5 x 40 mm', H: 40, T: 5, type: 'Flat' },
        { label: '5 x 50 mm', H: 50, T: 5, type: 'Flat' },
        { label: '6 x 30 mm', H: 30, T: 6, type: 'Flat' },
        { label: '6 x 50 mm', H: 50, T: 6, type: 'Flat' },
        { label: '6 x 75 mm', H: 75, T: 6, type: 'Flat' },
        { label: '6 x 100 mm', H: 100, T: 6, type: 'Flat' },
        { label: '10 x 50 mm', H: 50, T: 10, type: 'Flat' },
        { label: '10 x 100 mm', H: 100, T: 10, type: 'Flat' }
    ],

// --- Angle (L-Bar) (Area = (H*T) + ((W-T)*T)) ---
angle: [
    // === Equal Leg Angles ===
    { label: '20 x 20 x 3 mm', H: 20, W: 20, T: 3, type: 'Angle' },
    { label: '25 x 25 x 3 mm', H: 25, W: 25, T: 3, type: 'Angle' },
    { label: '30 x 30 x 3 mm', H: 30, W: 30, T: 3, type: 'Angle' },
    { label: '30 x 30 x 5 mm', H: 30, W: 30, T: 5, type: 'Angle' },
    { label: '40 x 40 x 3 mm', H: 40, W: 40, T: 3, type: 'Angle' },
    { label: '40 x 40 x 5 mm', H: 40, W: 40, T: 5, type: 'Angle' },
    { label: '50 x 50 x 5 mm', H: 50, W: 50, T: 5, type: 'Angle' },
    { label: '50 x 50 x 6 mm', H: 50, W: 50, T: 6, type: 'Angle' },
    { label: '65 x 65 x 6 mm', H: 65, W: 65, T: 6, type: 'Angle' },
    { label: '75 x 75 x 6 mm', H: 75, W: 75, T: 6, type: 'Angle' },
    { label: '75 x 75 x 8 mm', H: 75, W: 75, T: 8, type: 'Angle' },
    { label: '90 x 90 x 8 mm', H: 90, W: 90, T: 8, type: 'Angle' },
    { label: '100 x 100 x 8 mm', H: 100, W: 100, T: 8, type: 'Angle' },
    { label: '100 x 100 x 10 mm', H: 100, W: 100, T: 10, type: 'Angle' },
    { label: '150 x 150 x 12 mm', H: 150, W: 150, T: 12, type: 'Angle' },

    // === Unequal Leg Angles ===
    { label: '60 x 40 x 5 mm', H: 60, W: 40, T: 5, type: 'Angle' },
    { label: '75 x 50 x 6 mm', H: 75, W: 50, T: 6, type: 'Angle' },
    { label: '100 x 50 x 6 mm', H: 100, W: 50, T: 6, type: 'Angle' },
    { label: '100 x 75 x 8 mm', H: 100, W: 75, T: 8, type: 'Angle' },
    { label: '120 x 80 x 10 mm', H: 120, W: 80, T: 10, type: 'Angle' },
    { label: '150 x 100 x 10 mm', H: 150, W: 100, T: 10, type: 'Angle' }
],

  // --- Square and Rectangular Tubes (type: 'Tube') ---
tube: [
    // Square Tubes (H=W)
    { label: '20 x 20 x 1.5 mm', H: 20, W: 20, T: 1.5, type: 'Tube' },
    { label: '25 x 25 x 1.5 mm', H: 25, W: 25, T: 1.5, type: 'Tube' },
    { label: '30 x 30 x 2 mm', H: 30, W: 30, T: 2, type: 'Tube' },
    { label: '40 x 40 x 3 mm', H: 40, W: 40, T: 3, type: 'Tube' },
    { label: '50 x 50 x 3 mm', H: 50, W: 50, T: 3, type: 'Tube' },
    { label: '75 x 75 x 5 mm', H: 75, W: 75, T: 5, type: 'Tube' },
    { label: '100 x 100 x 5 mm', H: 100, W: 100, T: 5, type: 'Tube' },

    // Rectangular Tubes (H ≠ W)
    { label: '50 x 25 x 2 mm', H: 50, W: 25, T: 2, type: 'Tube' },
    { label: '60 x 40 x 3 mm', H: 60, W: 40, T: 3, type: 'Tube' },
    { label: '80 x 40 x 3 mm', H: 80, W: 40, T: 3, type: 'Tube' },
    { label: '100 x 50 x 4 mm', H: 100, W: 50, T: 4, type: 'Tube' },
    { label: '120 x 60 x 5 mm', H: 120, W: 60, T: 5, type: 'Tube' }
],

// --- Round Pipes (Uses OD and T, type: 'Pipe') ---
pipe: [
    // Nominal Bore (NB) sizes are used here, with approximated OD and T for calculation
    // NOTE: True Pipe calculations often use Nominal Pipe Size (NPS) and Schedule (SCH)
    { label: '1/2" Pipe (21.3 mm OD x 2.77 mm T)', OD: 21.3, T: 2.77, type: 'Pipe' },
    { label: '3/4" Pipe (26.9 mm OD x 2.87 mm T)', OD: 26.9, T: 2.87, type: 'Pipe' },
    { label: '1" Pipe (33.7 mm OD x 3.38 mm T)', OD: 33.7, T: 3.38, type: 'Pipe' },
    { label: '1 1/2" Pipe (48.3 mm OD x 3.68 mm T)', OD: 48.3, T: 3.68, type: 'Pipe' },
    { label: '2" Pipe (60.3 mm OD x 3.91 mm T)', OD: 60.3, T: 3.91, type: 'Pipe' },
    { label: '3" Pipe (88.9 mm OD x 5.49 mm T)', OD: 88.9, T: 5.49, type: 'Pipe' },
    { label: '4" Pipe (114.3 mm OD x 6.02 mm T)', OD: 114.3, T: 6.02, type: 'Pipe' }
],
    channel: [ // NEW
        { label: 'C 100 x 50 x 5 mm', H: 100, W: 50, T: 5, type: 'Beam' },
        { label: 'C 150 x 60 x 6 mm', H: 150, W: 60, T: 6, type: 'Beam' },
        { label: 'C 200 x 75 x 8 mm', H: 200, W: 75, T: 8, type: 'Beam' }
    ],
    beam: [ // NEW
        { label: 'I/H 100 x 100 x 6 mm', H: 100, W: 100, T: 6, type: 'Beam' },
        { label: 'I/H 150 x 150 x 8 mm', H: 150, W: 150, T: 8, type: 'Beam' },
        { label: 'I/H 200 x 200 x 10 mm', H: 200, W: 200, T: 10, type: 'Beam' }
    ],

    // --- CONSUMABLES / CUSTOM ---
  consumables: [
        { label: 'Welding Rod (E6010)', customDescription: 'E6010 Welding Rod Box', type: 'Custom' },
        { label: 'Grinding Wheel (4.5")', customDescription: '4.5" Grinding Wheel', type: 'Custom' },
        { label: 'Cutting Disc (7")', customDescription: '7" Cutting Disc', type: 'Custom' },
        { label: 'Sanding Disc', customDescription: 'Sanding Disc', type: 'Custom' },
        { label: 'Gloves (Pair)', customDescription: 'Safety Gloves', type: 'Custom' }
    ],
    custom: []
};
