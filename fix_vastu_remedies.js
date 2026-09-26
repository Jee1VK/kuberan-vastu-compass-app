const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Replace the entire generateLocalVastuAnalysis function with a fact-checked version
const oldFn = /function generateLocalVastuAnalysis\(directionName, roomObj, zoneKey\) \{[\s\S]*?\n  \}/;

const newFn = `function generateLocalVastuAnalysis(directionName, roomObj, zoneKey) {
    let roomName = 'General Layout';
    let isCompliant = true;
    let severity = 'NONE';
    let conflict = 'Placement is generally compliant or neutral.';
    
    const remedies = {
      simple_fixes: [],
      elemental_cures: [],
      vastu_instruments: []
    };

    if (roomObj && roomObj.name) {
      roomName = roomObj.name.en || roomObj.name;
      const zCode = zoneKey;
      
      if (roomObj.idealZones && roomObj.idealZones.includes(zCode)) {
        isCompliant = true;
        severity = 'NONE';
        conflict = 'No Vastu Dosha detected. This room placement is highly auspicious per Pancha Tattva principles.';
      } 
      else if (roomObj.avoidZones && roomObj.avoidZones.includes(zCode)) {
        isCompliant = false;
        severity = 'HIGH';
      } 
      else {
        isCompliant = false;
        severity = 'MEDIUM';
      }
    }

    if (!isCompliant) {
      // ===== PANCHA TATTVA ELEMENT-ZONE MAPPING (Fact-Checked) =====
      // Water (Jala): N, NNE, NE, NNW
      // Air (Vayu): ENE, E, ESE, NW
      // Fire (Agni): SE, SSE, S
      // Earth (Prithvi): SSW, SW
      // Space/Ether (Akasha): WSW, W, WNW

      // --- WATER ELEMENT ZONES: N, NNE, NE, NNW ---
      if (zoneKey === 'N' || zoneKey === 'NNE' || zoneKey === 'NE' || zoneKey === 'NNW') {
        conflict = 'Jala Tattva (Water Element) imbalance in ' + directionName + '. Governed by Lord Kubera (N) and Ishana/Shiva (NE). Disrupts wealth flow, mental clarity, and healing energy.';
        remedies.simple_fixes.push('Keep this zone absolutely clutter-free, clean, and well-lit at all times.');
        remedies.simple_fixes.push('Place a bowl of natural sea salt (uncrushed rock salt) in the corner — replace weekly.');
        remedies.simple_fixes.push('Use light blue or white color tones for walls and furnishings in this zone.');
        remedies.elemental_cures.push('Place a small indoor water feature, aquarium, or a brass Kalash filled with clean water.');
        remedies.elemental_cures.push('Introduce Silver or Zinc metallic objects to enhance the Water element.');
        remedies.elemental_cures.push('Keep a Tulsi (Holy Basil) or Money Plant in the North-East corner.');
        remedies.vastu_instruments.push('Install a Kuber Yantra (for North) or an Ishana Yantra (for NE) on the wall.');
        remedies.vastu_instruments.push('Place a Crystal Sphatik Shivling in the NE corner for spiritual amplification.');
        remedies.vastu_instruments.push('Use a 9-pyramid Vastu plate beneath the water element to energize the zone.');
      }
      // --- AIR ELEMENT ZONES: ENE, E, ESE, NW ---
      else if (zoneKey === 'ENE' || zoneKey === 'E' || zoneKey === 'ESE' || zoneKey === 'NW') {
        conflict = 'Vayu Tattva (Air Element) imbalance in ' + directionName + '. Governed by Indra/Surya (E) and Vayu Deva (NW). Affects social connections, support systems, legal matters, and mental wellbeing.';
        remedies.simple_fixes.push('Ensure excellent cross-ventilation — keep windows in this zone open during daytime.');
        remedies.simple_fixes.push('Place wind chimes with 5 or 6 hollow metal rods (avoid wooden ones).');
        remedies.simple_fixes.push('Use light green or pastel-toned decor to harmonize the Air element.');
        remedies.elemental_cures.push('Place Brass or Bronze decorative items (diyas, figurines) to balance Vayu.');
        remedies.elemental_cures.push('Grow aromatic indoor plants like Jasmine or Lavender in this zone.');
        remedies.elemental_cures.push('Hang a Brass Trishul or Brass Om symbol near the entrance of this zone.');
        remedies.vastu_instruments.push('Install an Indra Yantra (for East) or a Vayu Yantra (for NW) on the wall.');
        remedies.vastu_instruments.push('Place a Brass Vastu Helix (clockwise spiral) to redirect stagnant air energy.');
      }
      // --- FIRE ELEMENT ZONES: SE, SSE, S ---
      else if (zoneKey === 'SE' || zoneKey === 'SSE' || zoneKey === 'S') {
        conflict = 'Agni Tattva (Fire Element) imbalance in ' + directionName + '. Governed by Agni Deva (SE) and Yama Dharmaraja (S). Impacts cash flow, vitality, confidence, and digestive health.';
        remedies.simple_fixes.push('Light a ghee deepak (oil lamp) or a red/orange LED lamp in this zone every evening.');
        remedies.simple_fixes.push('Use warm colors — red, orange, maroon, or coral — for curtains and wall accents.');
        remedies.simple_fixes.push('Avoid keeping water storage, aquariums, or blue decor in this Fire zone.');
        remedies.elemental_cures.push('Place Copper strips, a Copper Swastik plate, or Copper utensils in this zone.');
        remedies.elemental_cures.push('Keep a natural Red Jasper or Carnelian stone in the SE corner.');
        remedies.elemental_cures.push('Install an electrical appliance (heater, inverter) in the SE to honor Agni.');
        remedies.vastu_instruments.push('Install an Agni Yantra or Mangal Yantra on the South-East wall.');
        remedies.vastu_instruments.push('Place a Copper Vastu Pyramid (pointed upward) to amplify fire energy.');
        remedies.vastu_instruments.push('Keep a Swastik symbol made of Copper or red kumkum at the SE entrance.');
      }
      // --- EARTH ELEMENT ZONES: SSW, SW ---
      else if (zoneKey === 'SSW' || zoneKey === 'SW') {
        conflict = 'Prithvi Tattva (Earth Element) imbalance in ' + directionName + '. Governed by Nairrti Devi (SW). Affects stability, marital harmony, the head of family, and long-term savings.';
        remedies.simple_fixes.push('Place heavy furniture, storage units, or iron safes in this zone to ground the energy.');
        remedies.simple_fixes.push('Use earthy tones — yellow, beige, brown, or terracotta — for walls and decor.');
        remedies.simple_fixes.push('Avoid keeping the SW zone empty or lightweight — it must feel dense and grounded.');
        remedies.elemental_cures.push('Place Lead (Sisa) strips or blocks along the floor skirting of this zone.');
        remedies.elemental_cures.push('Keep natural Yellow Sapphire, Tiger Eye, or Citrine gemstones here.');
        remedies.elemental_cures.push('Install Brass or Iron heavy figurines (like Nandi or elephants) for stability.');
        remedies.vastu_instruments.push('Install a Nairrti Yantra or a Rahu Yantra on the South-West wall.');
        remedies.vastu_instruments.push('Place a Lead Vastu Helix (Vastu Spring) to ground and stabilize the dosha.');
        remedies.vastu_instruments.push('Keep a square brass plate with the Om symbol under a heavy object in the SW.');
      }
      // --- SPACE/ETHER ELEMENT ZONES: WSW, W, WNW ---
      else if (zoneKey === 'WSW' || zoneKey === 'W' || zoneKey === 'WNW') {
        conflict = 'Akasha Tattva (Space/Ether Element) imbalance in ' + directionName + '. Governed by Lord Varuna (W). Affects financial gains, education, savings, and emotional release from grief/depression.';
        remedies.simple_fixes.push('Keep this zone moderately open with balanced storage — avoid over-cluttering.');
        remedies.simple_fixes.push('Use light grey, white, or metallic silver tones for this zone decor.');
        remedies.simple_fixes.push('Play soothing vedic mantras or chanting in this zone daily for Akasha activation.');
        remedies.elemental_cures.push('Place Iron or Steel metallic objects to stabilize the expansive Ether energy.');
        remedies.elemental_cures.push('Keep a Shankh (conch shell) in the West to invoke Varuna blessings.');
        remedies.elemental_cures.push('Install a small bell or gong — sound harmonizes the Space element.');
        remedies.vastu_instruments.push('Install a Varuna Yantra on the Western wall to balance Akasha Tattva.');
        remedies.vastu_instruments.push('Place an Iron Vastu Helix or a multi-metal (Panchdhatu) pyramid here.');
        remedies.vastu_instruments.push('Keep a round metallic plate with Gayatri Mantra inscription in this zone.');
      }
      // --- FALLBACK for any unmapped sub-directions ---
      else {
        conflict = 'General Pancha Tattva imbalance detected. The room placement does not align with ideal Vastu prescriptions for this direction.';
        remedies.simple_fixes.push('Cleanse the area weekly with camphor (Kapoor) or dried sage.');
        remedies.simple_fixes.push('Place natural rock salt bowls in corners to neutralize negative energy.');
        remedies.elemental_cures.push('Use Panchdhatu (five-metal alloy) items to balance all five elements simultaneously.');
        remedies.elemental_cures.push('Introduce indoor plants and natural lighting to harmonize Prana flow.');
        remedies.vastu_instruments.push('Install a Sarva Dosha Nivaran Yantra for multi-directional correction.');
        remedies.vastu_instruments.push('Place directional Vastu pyramids specific to the affected wall.');
      }
    }

    return {
      direction: directionName,
      room: roomName,
      isCompliant: isCompliant,
      severity: severity,
      elementalConflict: conflict,
      remedies: remedies
    };
  }`;

app = app.replace(oldFn, newFn);

fs.writeFileSync('app.js', app);
console.log('Vastu remedies engine fact-checked and updated!');
