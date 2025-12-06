// list_data.js
const predefinedItems = [
    // --- தானியங்கள் & மாவுகள் (Grains & Flours) ---
    { name: "அரிசி (சாப்பாடு)", quantity: 5, unit: "kg" },     // Rice (for meals)
    { name: "இட்லி அரிசி", quantity: 3, unit: "kg" },           // Idli Rice
    { name: "பொங்கல் அரிசி", quantity: 1, unit: "kg" },         // Pongal Rice
    { name: "சாம்பா அரிசி", quantity: 1, unit: "kg" },          // Samba Rice (a variety)
    { name: "கோதுமை மாவு", quantity: 2, unit: "kg" },           // Wheat Flour
    { name: "ரவை", quantity: 500, unit: "g" },                  // Rava/Semolina
    { name: "மைதா", quantity: 250, unit: "g" },                 // Maida/All-purpose Flour
    { name: "ராகி மாவு", quantity: 500, unit: "g" },            // Ragi Flour

    // --- பருப்பு & பயறு வகைகள் (Pulses & Legumes) ---
    { name: "துவரம் பருப்பு", quantity: 500, unit: "g" },       // Toor Dal
    { name: "மசூர் பருப்பு", quantity: 500, unit: "g" },         // Masoor Dal
    { name: "மூங் டால் (பாசிப்பருப்பு)", quantity: 500, unit: "g" }, // Moong Dal
    { name: "கொண்டைக்கடலை (வெள்ளை)", quantity: 500, unit: "g" }, // Chickpeas (White)
    { name: "பச்சைப்பயறு", quantity: 500, unit: "g" },          // Green Gram
    { name: "வேர்க்கடலை", quantity: 500, unit: "g" },           // Groundnuts/Peanuts

    // --- எண்ணெய் & கொழுப்பு (Oil & Fat) ---
    { name: "சமையல் எண்ணெய் (சூரியகாந்தி)", quantity: 1, unit: "L" }, // Cooking Oil (Sunflower)
    { name: "எள்ளெண்ணெய் (நல்லெண்ணெய்)", quantity: 500, unit: "ml" }, // Sesame Oil
    { name: "தேங்காய் எண்ணெய்", quantity: 500, unit: "ml" },    // Coconut Oil
    { name: "நெய்", quantity: 200, unit: "g" },                 // Ghee

    // --- மசாலா & பொடி வகைகள் (Spices & Powders) ---
    { name: "மிளகாய் தூள்", quantity: 200, unit: "g" },         // Chili Powder
    { name: "மஞ்சள் தூள்", quantity: 100, unit: "g" },          // Turmeric Powder
    { name: "மிளகு", quantity: 100, unit: "g" },                // Black Pepper
    { name: "சீரகம்", quantity: 100, unit: "g" },               // Cumin Seeds
    { name: "பெருஞ்சீரகம் (சோம்பு)", quantity: 100, unit: "g" }, // Fennel Seeds
    { name: "கருவேப்பிலை உலர்", quantity: 1, unit: "pack" },    // Dry Curry Leaves
    { name: "இஞ்சி பூண்டு பேஸ்ட்", quantity: 1, unit: "nos" },  // Ginger Garlic Paste (jar)
    { name: "சாம்பார் பொடி", quantity: 250, unit: "g" },         // Sambar Powder
    { name: "ரசம் பொடி", quantity: 100, unit: "g" },            // Rasam Powder

    // --- அடிப்படை சமையல் பொருட்கள் (Basic Cooking Items) ---
    { name: "உப்பு (சமையல்)", quantity: 1, unit: "kg" },        // Salt (Cooking)
    { name: "சர்க்கரை", quantity: 1, unit: "kg" },              // Sugar
    { name: "வெல்லம்", quantity: 500, unit: "g" },              // Jaggery
    { name: "புளி", quantity: 250, unit: "g" },                 // Tamarind
    { name: "தேங்காய் (உலர்/துருவல்)", quantity: 1, unit: "pack" }, // Coconut (Dry/Grated)
    { name: "அப்பளம்", quantity: 1, unit: "pack" },             // Appalam/Papad
    { name: "ஊறுகாய்", quantity: 1, unit: "jar" },              // Pickle

    // --- பானங்கள் & மற்றவை (Beverages & Others) ---
    { name: "டீ தூள்", quantity: 250, unit: "g" },              // Tea Powder
    { name: "காபி தூள்", quantity: 200, unit: "g" },            // Coffee Powder
    { name: "பால் பொடி", quantity: 1, unit: "pack" },           // Milk Powder
    { name: "ஜாம்", quantity: 1, unit: "jar" },                 // Jam
    { name: "சாஸ் (தக்காளி)", quantity: 1, unit: "bottle" },     // Sauce (Tomato)

    // --- தூய்மை & வீட்டு பயன்பாடு (Cleaning & Household) ---
    { name: "குளியல் சோப்பு", quantity: 4, unit: "nos" },        // Bath Soap
    { name: "தூள் சோப்பு (துணி)", quantity: 1, unit: "kg" },     // Detergent Powder (Clothes)
    { name: "டிஷ் வாஷ் திரவம்", quantity: 500, unit: "ml" },    // Dish Wash Liquid
    { name: "தூய்மை தூரிகை (பிரஷ்)", quantity: 1, unit: "nos" }, // Cleaning Brush
    { name: "அழுக்கு மூட்டை (கழிவு பை)", quantity: 1, unit: "roll" } // Garbage Bag
];
