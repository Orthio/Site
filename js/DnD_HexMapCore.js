// js/DnD_HexMapCore.js
// Rectangular flat-top grid (15x10), even-q offset (q=0..14, r=0..9).
// IDs are "000.000" .. "014.009".
// Uses:
//   - hexTerrain for terrain transitions, Plains etc
//   - terrainFeature for terrain-based features, Gulch etc
//   - wildernessRollsTable for encounters found in the hex
//   - hexInhabitation (Dense, maybe Special)
//   - ruinsType / ruinsDecay / ruinsInhabitants for ruins

/**
 * @typedef {Object} HexCell
 * @property {number} q // 3
 * @property {number} r  // 3
 * @property {string} id  // 003.003
 * @property {number} code // 12
 * @property {string} terrain // Lake
 * @property {string} fill // #5ab3ff
 * @property {string} lostChance // 1-in-6
 * 
 * @property {string|null} terrainFeature // Marsh gas
 * @property {[string,string,string,boolean]|null} wildFeatures  // Hazard, Consider a, 6-6, False
 * @property {string|null} wildFeatures[0]  // Hazard/Resource, Consider a, 6-6, false
 * @property {string|null} wildFeatures[1]  // Consider a
 * @property {string|null} wildFeatures[2]  // 6-6
 * @property {boolean} wildFeatures[3] // false
 * 
 * @property {[string, number]|null} settlement, settlementSize  // Small town, 900
 * @property {number|null} settlementSize  // 900
 * @property {string|null} settlementText  // Small town, pop.900
 * @property {string|null} ruins  
 * 
 * @property {string|null} regionName // 01 Green hill zone
 * @property {string|null} regionNameText // Green hill zone
 *
 * @property {[string,string]|null} encounterFeatures1  // O-Swimmer, Fish, swordfish
 * @property {[string,string]|null} encounterFeatures2  // O-Swimmer, Fish, swordfish
 * @property {[string,string]|null} encounterFeatures3  // O-Swimmer, Fish, swordfish
*
* @property {[number, number]} nFeatures  // 2, 1
* @property {[string,string,string,boolean]|null} obviousFeature1  //  bx procedure like wildFeatures: Hazard, Consider a, 6-6, False
* @property {string|null} obviousFeature2  //  sandbox gen procedure
* @property {string|null} obviousFeature3  //  wilderness feat or filling feat
* @property {[string,string,string,boolean]|null} hiddenFeature1  // bx procedure or sandbox gen

*/


export class HexMapCore {

  static async load() {
    const res = await fetch("json/DnD_Hexmap.json");

    if (!res.ok) {
      throw new Error(
        `Failed to load json/DnD_Hexmap.json: ${res.status} ${res.statusText}`
      );
    }

    return await res.json();
  }

  constructor(svgEl, opts = {}) {
    if (!svgEl) throw new Error("HexMapCore: svgEl is required");
    this.svg = svgEl;

    this.tables = {};

    // Grid settings
    this.cols = opts.cols ?? 15; // q: 0..14
    this.rows = opts.rows ?? 10; // r: 0..9
    this.hexSize = opts.hexSize ?? 28;
    this.startTerrain = opts.startTerrain ?? "Plain";
    this.labelMode = "default"; // "default" | "encounters"

    // Data/state
    this.terrainFeature = null;
    this.lostChance = null;
    this.encFeatures1 = null;
    this.encFeatures2 = null;
    this.encFeatures3 = null;
    this.wildernessRolls = null;
    this.wildernessFeatureChance = null;
    this.inhabitation = null;       // hexInhabitation
    this.ruinsDecay = null;
    this.ruinsType = null;
    this.ruinsInhabitants = null;

    this.seed = 0;
    this.grid = new Map();          // key "q,r" -> cell
    this.selectedKey = null;

  }

  setTables(data = {}) {
    if (!data.hexWildernessTerrain || typeof data.hexWildernessTerrain !== "object") {
      throw new Error("HexMapCore.setTables: terrain missing or invalid");
    }

    this.tables = {
      terrainTable: data.hexWildernessTerrain ?? null,
      terrainFeaturesTable: data.terrainFeature ?? null,
      inhabitationTable: data.hexInhabitation ?? null,
      wildernessRollsTable: data.wildernessRollsTable ?? null,
      wildernessFeatureChance: data.wildernessFeatureChance ?? null,
      wildernessEncountersTable: data.wildernessEncountersTable ?? null,
      specificEncountersTable: data.specificEncountersTable ?? null,
      wildernessFeaturesTable: data.wildernessFeaturesTable ?? null,
      wildFeaturesWithSuppArray: data.wildFeaturesWithSuppArray ?? null,
      specialInhabitationTable: data.specialInhabitation ?? null,
      ruinsTypeTable: data.ruinsType ?? null,
      ruinsDecayTable: data.ruinsDecay ?? null,
      ruinsInhabitantsTable: data.ruinsInhabitants ?? null,
      sandboxGenFeatureTable: data.sandboxGenFeatureTable ?? null,
      sandboxGenSettlementTable: data.sandboxGenSettlementTable ?? null,
      sandboxGenLandmarkStartingTable: data.sandboxGenLandmarkStartingTable ?? null,
      sandboxGenLandmarkNaturalTable: data.sandboxGenLandmarkNaturalTable ?? null,
      sandboxGenLandmarkArtificialTable: data.sandboxGenLandmarkArtificialTable ?? null,
      sandboxGenLandmarkMagicTable: data.sandboxGenLandmarkMagicTable ?? null,
      sandboxGenLandmarkContentTable: data.sandboxGenLandmarkContentTable ?? null,
      sandboxGenHazardTable: data.sandboxGenHazardTable ?? null,
      sandboxGenEmptyTable: data.sandboxGenEmptyTable ?? null,
      sandboxGenSpecialStartTable: data.sandboxGenSpecialStartTable ?? null,
      fillingFeatureTable: data.fillingFeatureTable ?? null,
      sandboxGenSpecialDisputeTable: data.sandboxGenSpecialDisputeTable ?? null,
      wildHexMatchingTable: data.wildHexMatchingTable ?? null,
      forestWildHexTable: data.forestWildHexTable ?? null,
      mountainWildHexTable: data.mountainWildHexTable ?? null,
      desertWildHexTable: data.desertWildHexTable ?? null,
      swampWildHexTable: data.swampWildHexTable ?? null,
      oceanWildHexTable: data.oceanWildHexTable ?? null,
      lostChanceTable: data.lostChanceTable ?? null,
      colourTable: data.colourTable ?? null,
      baseTerrainTable: data.baseTerrainTable ?? null,
      featureThresholdTable: data.featureThresholdTable ?? null,
      terrainAddThreshTable: data.terrainAddThreshTable ?? null,
      // Thesholds for forests becoming forest with hills, mountains having a pass
      featureKeysTable: data.featureKeysTable ?? null,
      encounterFeatureKeysTable: data.encounterFeatureKeysTable ?? null,
      // Points to the right part of encFeaturesTable on json

    };
  }

  // --- generation (rectangular, row-major) ---
  generate(seed) {
    if (!this.tables.terrainTable) throw new Error("HexMapCore.generate: call setTables() first");
    this.seed = seed >>> 0;
    this.rng = this.#mulberry32(this.seed);
    // const roll = (n) => 1 + Math.floor(rng() * n); // 1..n

    this.grid.clear();

    for (let q = 0; q < this.cols; q++) {
      for (let r = 0; r < this.rows; r++) {
        const parentName = this.#parentTerrainMajority(q, r);
        const baseParent = parentName ?? this.startTerrain;

        // Terrain via Appendix B from chosen parent
        const d20 = this.#roll(20);
        let next;
        let isSame = false
        if (parentName && this.#roll(10) == 1) {
          isSame = true;
          next = parentName;
        } else {
          isSame = false;
          next = this.#nextFromJSON(baseParent, d20);
        }

        let child = { inputTerrain: next };

        this.#setCell(q, r, child);
        const cell = this.getCell(q, r);

        // First: maybe upgrade terrain (Forest → ForestWithHills, Mountains → MountainsWithPass)
        this.#maybeAddTerrainExtra(cell);

        // Now roll features using possibly-upgraded terrain
        this.#maybeAddFeature(cell);

        // Inhabitation (Dense) & population / specials
        this.#maybeAddInhabitation(cell);

        // If feature mentions ruins, roll ruins details
        this.#maybeAddRuinsDetails(cell);

        // Check for encounters 1 to 3
        this.#maybeAddEncounterFeatures(cell);

        // Check for obvious and hidden features
        this.#maybeAddObviousFeatures(cell);

        // Check for lost chance
        this.#checkLostChance(cell);
      }
    }
  }

  // Majority of already-filled neighbors (even-q offsets). Tie → deterministic pick.
  #parentTerrainMajority(q, r) {
    const filled = [];
    for (const [dq, dr] of this.#neighborsOffsetEvenQ(q)) {
      const Q = q + dq;
      const R = r + dr;
      if (Q < 0 || Q >= this.cols || R < 0 || R >= this.rows) continue;
      const c = this.grid.get(this.#key(Q, R));
      if (c) filled.push(c.terrain);
    }
    if (filled.length === 0) return null;

    const counts = new Map();
    for (const name of filled) counts.set(name, (counts.get(name) || 0) + 1);

    let bestN = -1;
    const bestNames = [];
    for (const [name, n] of counts) {
      if (n > bestN) {
        bestN = n;
        bestNames.length = 0;
        bestNames.push(name);
      } else if (n === bestN) {
        bestNames.push(name);
      }
    }

    if (bestNames.length === 1) return bestNames[0];

    const t = Math.abs(this.#hash2(q, r, this.seed)) % bestNames.length;
    return bestNames[t];
  }

  // --- helpers for generation: features / inhabitation / ruins ---

  #maybeAddFeature(cell) {
    if (!this.tables) return;
    const checkingTerrain = cell.terrain;
    // const th = this.tables.featureThresholdTable[checkingTerrain] ?? 0;
    // if (th <= 0) return;
    // const d30 = this.#roll(30);
    // if (d30 > th) return;

    const key = this.tables.featureKeysTable[checkingTerrain];

    const list = key && Array.isArray(this.tables.terrainFeaturesTable[key]) ? this.tables.terrainFeaturesTable[key] : null;
    if (!list || list.length === 0) return;

    const pick = list[this.#roll(list.length) - 1];
    if (!pick) return;

    cell.terrainFeature = pick;
  }

  #maybeAddTerrainExtra(cell) {
    const checkingTerrain = cell.terrain;

    let upgraded = null;
    if (checkingTerrain === "Forest") {
      upgraded = "ForestWithHills";
    } else if (checkingTerrain === "Mountains") {
      upgraded = "MountainsWithPass";
    } else {
      return;
    }

    const th = this.tables.terrainAddThreshTable[checkingTerrain] ?? 0;
    if (th <= 0) return;
    if (this.#roll(20) > th) return;

    cell.terrain = upgraded;

  }


  #maybeAddInhabitation(cell) {
    if (!this.tables.inhabitationTable) return;

    const denseTable = this.tables.inhabitationTable.Dense ?? null;
    if (!denseTable) return;

    // 1d3; on 1 → 1d30 on Dense
    if (this.#roll(3) !== 1) return;

    const type = this.#lookupFromTable(denseTable, this.#roll(30));
    if (!type) return;

    // Special handling
    if (/special/i.test(type)) {
      const specialTbl = this.tables.specialInhabitationTable ?? null;
      if (cell.terrain === "Hills" || cell.terrain === "Mountains") {
        cell.settlement = ["Mine", null];
      }
      else if (specialTbl) {
        const special = this.#lookupFromTable(specialTbl, this.#roll(30));
        if (special) {
          cell.settlement = [special, null]; // we can display this under FEATURES
        }
      }
      return;
    }

    // Normal settlement
    cell.settlement[0] = type;
    const category = this.#categoryFromType(type);
    if (category) {
      cell.settlement[1] = this.#populationForCategory(category);
    }
    cell.settlementText = null;
    cell.settlement?.[1] != null
      ? cell.settlementText = cell.settlement?.[0] + ", pop." + cell.settlement?.[1]
      : (cell.settlementText = cell.settlement?.[0] ?? [null, null]);
  }

  #maybeAddRuinsDetails(cell) {
    const text = cell.settlement[0] ?? "";
    if (!text) return;
    if (!/\bruin/i.test(text)) return; // look for "ruin"/"ruins" in feature text

    if (!this.ruinsType && !this.ruinsDecay && !this.ruinsInhabitants) return;

    const type = this.ruinsType ? this.#lookupFromTable(this.ruinsType, this.#roll(24)) : null;
    const decay = this.ruinsDecay ? this.#lookupFromTable(this.ruinsDecay, this.#roll(6)) : null;
    const inhabitants = this.ruinsInhabitants
      ? this.#lookupFromTable(this.ruinsInhabitants, this.#roll(10))
      : null;

    cell.ruins = {
      type: type ?? "—",
      decay: decay ?? "—",
      inhabitants: inhabitants ?? "—"
    };
  }

  #maybeAddEncounterFeatures(cell) {
    if (!this.tables.wildernessEncountersTable) return;
    if (!this.tables.wildernessRollsTable) return;
    if (!this.tables.specificEncountersTable) return;
    if (!this.tables.wildernessFeaturesTable) return;


    const terrainCheck = cell.terrain;

    const rolls = this.tables.wildernessRollsTable[terrainCheck] ?? 0;            // e.g. Forest -> 2
    if (rolls <= 0) return;

    // which column of encFeaturesTable to use for this terrain
    const tableKey = this.tables.encounterFeatureKeysTable[terrainCheck];
    const col = tableKey && typeof this.tables.wildernessEncountersTable[tableKey] === "object"
      ? this.tables.wildernessEncountersTable[tableKey]
      : null;
    if (!col) return;

    // clear previous results (so rerolls don't keep old ones)
    cell.encounterFeatures1 = null;
    cell.encounterFeatures2 = null;
    cell.encounterFeatures3 = null;
    cell.wildFeatures = null;

    for (let i = 1; i <= Math.min(3, rolls); i++) {

      // d8 on the column
      const categoryPick = col[String(this.#roll(8))] ?? null;
      if (!categoryPick) continue;

      // d20 on the type
      const subTableColumn = this.tables.specificEncountersTable[categoryPick];
      const animalPick = subTableColumn[String(this.#roll(20))] ?? null;

      const villageTypes = ["Village", "Small Town", "Large Town", "City"];

      if (!villageTypes.includes(cell.settlement[0])) {
        cell[`encounterFeatures${i}`] = [categoryPick, animalPick];
      }
    }

    if (this.#roll(2) > 1) {
      const wildFeaturesRoll = String(this.#roll(36));
      cell.wildFeatures = [null, null, null, null];
      cell.wildFeatures[0] = this.tables.wildernessFeaturesTable[wildFeaturesRoll][0] ?? null;
      cell.wildFeatures[1] = this.tables.wildernessFeaturesTable[wildFeaturesRoll][1] ?? null;
      cell.wildFeatures[2] = this.tables.wildernessFeaturesTable[wildFeaturesRoll][2] ?? null;
      cell.wildFeatures[3] = this.tables.wildFeaturesWithSuppArray?.includes(cell.wildFeatures[2]) ?? false;
    } else {
      cell.wildFeatures = null;
    }

    if (cell.terrain === "Lake") {
      cell.wildFeatures = null;
    }
    if (cell.settlement?.[0] != null) {
      cell.wildFeatures = null;
    }

  }

  #maybeAddObviousFeatures(cell) {
    const addWildernessFeature = (cell, cellPart) => {
      const feature = this.#lookupFromTable(this.tables.wildernessFeaturesTable);

      if (!feature) {
        cell[cellPart] = null;
        return;
      }

      cell[cellPart] = `${feature[0] ?? ""}: ${feature[1] ?? ""} ${feature[2] ?? ""}`.trim();
    };

    const addSandboxGenFeature = (cell, cellPart) => {
      const sFTable = this.tables.sandboxGenFeatureTable;
      let sandboxFeaturePick = this.#lookupFromTable(sFTable);

      switch (sandboxFeaturePick) {
        case "Landmark":
          const startEntry = this.#lookupFromTable(this.tables.sandboxGenLandmarkStartingTable);
          const subTableName = startEntry[1];
          const subTable = this.tables[subTableName];
          const sandboxLandmarkPick = this.#lookupFromTable(subTable);
          cell[cellPart] = sandboxLandmarkPick;

          let sandboxContentPick = this.tables.sandboxGenLandmarkContentTable[this.#roll(6)];
          switch (sandboxContentPick) {
            case "Hazard":
              const hTable = this.tables.sandboxGenHazardTable;
              let hazardPick = this.#lookupFromTable(hTable);
              cell[cellPart] += (", " + hazardPick);
              break;
            case "Empty":
              const eTable = this.tables.sandboxGenEmptyTable;
              let emptyPick = this.#lookupFromTable(eTable);
              cell[cellPart] += (", " + emptyPick);
              break;
            case "Special":
              const sTable = this.tables.sandboxGenSpecialStartTable;
              let specialPick = this.#lookupFromTable(sTable);
              cell[cellPart] += (", " + specialPick);
              if (specialPick == "Arbitrate a dispute") {
                const dTable = this.tables.sandboxGenSpecialDisputeTable;
                let dispute = this.#lookupFromTable(dTable);
                cell[cellPart] += (", " + dispute);
              }
              break;
            case "Monsters":
              cell[cellPart] += (", " + "Monsters")
              break;
            default:
              console.log("sandbox content error");
          }
          break;
        case "Settlement":
          const sTable = this.tables.sandboxGenSettlementTable;
          let sandboxSettlementPick = this.#lookupFromTable(sTable);
          cell[cellPart] = sandboxSettlementPick;
          break;
        case "Lair":
          cell[cellPart] = "Lair";
          break;
        case "Dungeon":
          cell[cellPart] = "Dungeon";
          break;
        default:
          cell[cellPart] = null;
          console.log("sandbox error");
      }
    }

    const addCaltropFeature = (cell, cellPart) => {
      const thisTerrain = cell.terrain;
      const hexMatchingWhichTable = this.tables.wildHexMatchingTable[thisTerrain];
      const hexMatchingWhichTable2 = this.tables[hexMatchingWhichTable];
      const keys = Object.keys(hexMatchingWhichTable2);
      // Grabs an array like [81, 82]
      const featRoll = String(this.#roll(20 - 1));
      const keyPick = keys[featRoll];
      const hexMatchingPick = "Caltrop" + keyPick + ": " + hexMatchingWhichTable2[keyPick];

      cell[cellPart] = hexMatchingPick;
    }

    const addFillingFeature = (cell, cellPart) => {
      const fTable = this.tables.fillingFeatureTable;
      const fillingF = this.#lookupFromTable(fTable);
      cell[cellPart] = "Filling: " + fillingF;
    };

    cell.nFeatures = [this.#roll(3), this.#roll(2) - 1];

    if (cell.nFeatures[0] >= 1) {
      addWildernessFeature(cell, "obviousFeature1");
    } else {
      cell.obviousFeature1 = null;
    }

    if (cell.nFeatures[0] >= 2) {
      addSandboxGenFeature(cell, "obviousFeature2");
    } else {
      cell.obviousFeature2 = null;
    }

    if (cell.nFeatures[0] >= 3) {
      let O3roll = this.#roll(2);
      if (O3roll == 2) {
        addFillingFeature(cell, "obviousFeature3");
      } else {
        addCaltropFeature(cell, "obviousFeature3");
      }
    } else {
      cell.obviousFeature3 = null;
    }

    if (cell.nFeatures[1] >= 1) {
      let Hroll = this.#roll(2);
      if (Hroll = 2) {
        addWildernessFeature(cell, "hiddenFeature1");
      } else {
        addSandboxGenFeature(cell, "hiddenFeature1");
      }
    } else {
      cell.hiddenFeature1 = null;
    }
  }

  #checkLostChance(cell) {
    const lostTable = this.tables.lostChanceTable;
    const lostTerrain = cell.terrain;
    cell.lostChance = lostTable[lostTerrain] + "-in-6";
  }



  // Reroll feature + encounter features for a single hex, keeping same terrain
  rerollAllFeaturesAndEncounters() {
    const batchSeed = (Date.now() ^ ((Math.random() * 0xFFFFFFFF) >>> 0)) >>> 0;

    for (const cell of this.grid.values()) {
      const rng = this.#mulberry32(
        (batchSeed ^ ((cell.q + 1) * 2654435761) ^ ((cell.r + 1) * 1597334677)) >>> 0
      );
      const roll = (sides) => 1 + Math.floor(rng() * sides);

      // Clear only the fields you want to reroll
      cell.terrainFeature = null;
      cell.ruins = null;
      cell.encounterFeatures1 = null;
      cell.encounterFeatures2 = null;
      cell.encounterFeatures3 = null;
      cell.wildFeatures[0] = null;
      cell.wildFeatures[1] = null;
      cell.wildFeatures[2] = null;
      cell.wildFeatures[3] = null;
      cell.noFeatures = null;
      cell.obviousFeature1 = null;
      cell.obviousFeature2 = null;
      cell.obviousFeature3 = null;
      cell.hiddenFeature1 = null;


      // Rebuild
      this.#maybeAddFeature(cell);
      this.#maybeAddEncounterFeatures(cell);
      this.#maybeAddObviousFeatures(cell);
    }
  }


  // --- rendering ---
  render() {
    const HEX = this.hexSize;
    if (this.grid.size === 0) return;

    let minX = +Infinity,
      maxX = -Infinity,
      minY = +Infinity,
      maxY = -Infinity;
    for (const c of this.grid.values()) {
      const { x, y } = this.#offsetToPixel(c.q, c.r);
      minX = Math.min(minX, x - HEX);
      maxX = Math.max(maxX, x + HEX);
      minY = Math.min(minY, y - HEX);
      maxY = Math.max(maxY, y + HEX);
    }
    const pad = HEX * 1.5;
    this.svg.setAttribute(
      "viewBox",
      `${Math.floor(minX - pad)} ${Math.floor(minY - pad)} ${Math.ceil(
        maxX - minX + pad * 1.5
      )} ${Math.ceil(maxY - minY + pad * 1.5)}`
    );

    const frag = document.createDocumentFragment();

    const hexLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    hexLayer.setAttribute("id", "hexLayer");

    const markerLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    markerLayer.setAttribute("id", "markerLayer");

    const labelLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    labelLayer.setAttribute("id", "labelLayer");

    // Labels should not block clicking the hex polygons
    labelLayer.setAttribute("pointer-events", "none");

    // Order matters: hexes at bottom, then markers, then labels on top
    frag.appendChild(hexLayer);
    frag.appendChild(markerLayer);
    frag.appendChild(labelLayer);

    for (const cell of this.grid.values()) {

      const { x, y } = this.#offsetToPixel(cell.q, cell.r);

      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      poly.setAttribute("points", this.#hexPolygon(x, y, HEX - 1));
      poly.setAttribute("class", "hex");
      poly.setAttribute("fill", cell.fill);
      poly.dataset.key = this.#key(cell.q, cell.r);
      poly.addEventListener("click", () => this.select(cell.q, cell.r));
      hexLayer.appendChild(poly);
      const labelGroup = document.createElementNS("http://www.w3.org/2000/svg", "text");
      labelGroup.setAttribute("x", x);
      labelGroup.setAttribute("y", y);
      labelGroup.setAttribute("class", "label");
      labelGroup.setAttribute("text-anchor", "middle");
      labelGroup.setAttribute("dominant-baseline", "middle");

      const labelColor = cell.wildFeatures?.[3] || cell.obviousFeatures1?.[3] || cell.hiddenFeatures1?.[3]
        ? "#ff44f3"
        : "#000000"; labelGroup.style.fill = labelColor;

      // base size you currently use (example: 12px)
      const baseSize = 12;
      const size = (this.labelMode === "encounters" || this.labelMode === "wildStocking") ? (baseSize - 2) : baseSize;
      const baseStrokeSize = 2;
      const newStrokeSize = (this.labelMode === "encounters" || this.labelMode === "wildStocking") ? (baseStrokeSize - 0.4) : baseStrokeSize;

      labelGroup.setAttribute("font-size", `${size}px`);
      labelGroup.setAttribute("stroke-width", `${newStrokeSize}px`);

      const lineHeightEm = (this.labelMode === "encounters" || this.labelMode === "wildStocking") ? 1.0 : 1.1;

      let lines = [];

      if (this.labelMode === "encounters") {
        // Up to 3 encounter lines, then settlement and id
        if (cell.encounterFeatures1) lines.push(cell.encounterFeatures1[1]);
        if (cell.encounterFeatures2) lines.push(cell.encounterFeatures2[1]);
        if (cell.encounterFeatures3) lines.push(cell.encounterFeatures3[1]);

        if (cell.settlement?.[0] != null) lines.push(cell.settlement[0]);

        // If none exist, show a dash (optional but helps readability)
        if (lines.length === 0) lines.push("—");

        lines.push(cell.id);
      } else if (this.labelMode === "wildStocking") {
        // The wilderness stocking, then settlement and id
        if (cell.wildFeatures[0]) lines.push(cell.wildFeatures[0]);
        if (cell.wildFeatures[2]) lines.push(cell.wildFeatures[2]);

        if (cell.settlement?.[0] != null) lines.push(cell.settlement[0]);

        if (lines.length === 0) lines.push("—");

        lines.push(cell.id);

      } else {
        // Your existing default behaviour
        lines.push(cell.terrain);

        if (cell.settlement?.[0] != null) lines.push(cell.settlement[0]);

        lines.push(cell.id);
      }

      // Render tspans
      // Start vertically so the whole block is centered
      const startDy = -((lines.length - 1) * lineHeightEm) / 2;

      lines.forEach((text, idx) => {
        const t = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        t.textContent = text;
        t.setAttribute("x", x);

        // First line sets the initial dy from the text element's y,
        // subsequent lines step down
        t.setAttribute("dy", `${idx === 0 ? startDy : lineHeightEm}em`);

        // Make ID a lighter colour (last line is always id)
        if (idx === lines.length - 1) t.setAttribute("fill", "#aaa");

        labelGroup.appendChild(t);
      });

      labelLayer.appendChild(labelGroup);

      // Tiny settlement marker (if any) near bottom of hex
      if (cell.settlement?.[0] != null) {
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", x);
        dot.setAttribute("cy", y + HEX * 0.45);
        dot.setAttribute("r", Math.max(2, Math.floor(HEX * 0.12)));
        dot.setAttribute("fill", "#ddd");
        dot.setAttribute("opacity", "0.9");
        dot.setAttribute("pointer-events", "none");
        labelLayer.appendChild(dot);
      }
    }

    this.svg.innerHTML = "";
    this.svg.appendChild(frag);
  }

  // --- selection & edit ---
  select(q, r) {
    const k = this.#key(q, r);
    const cell = this.grid.get(k);
    if (!cell) return null;
    this.selectedKey = k;
    this.svg.dispatchEvent(new CustomEvent("hexmap:select", { detail: { cell } }));
    return cell;
  }

  getCell(q, r) {
    return this.grid.get(this.#key(q, r)) ?? null;
  }

  setSettlement(q, r, settlement, settlementSize = null) {
    const c = this.getCell(q, r);
    if (!c) return false;
    c.settlement = settlement ?? [null, null];
    c.settlement[1] =
      settlement[0] != null
        ? Number.isFinite(+settlement[1])
          ? Math.max(0, Math.floor(+settlement[1]))
          : null
        : null;
    return true;
  }

  toJSON() {
    return {
      meta: {
        cols: this.cols,
        rows: this.rows,
        hexSize: this.hexSize,
        startTerrain: this.startTerrain,
        seed: this.seed
      },
      cells: [...this.grid.values()].map(c => this.#serializeCell(c))
    };
  }

  fromJSON(snapshot) {
    if (!snapshot || !Array.isArray(snapshot.cells)) {
      throw new Error("HexMapCore.fromJSON: bad payload");
    }

    this.grid.clear();
    this.cols = snapshot.meta?.cols ?? this.cols;
    this.rows = snapshot.meta?.rows ?? this.rows;
    this.hexSize = snapshot.meta?.hexSize ?? this.hexSize;
    this.startTerrain = snapshot.meta?.startTerrain ?? this.startTerrain;
    this.seed = snapshot.meta?.seed ?? this.seed;

    for (const c of snapshot.cells) {
      const terrainStr = c.terrain ?? this.startTerrain;

      // Colour using terrain
      const bTable = this.tables.baseTerrainTable
      const code = Object.keys(bTable)[terrainStr];
      const fill = this.tables.colourTable[terrainStr] || "#555";

      this.grid.set(this.#key(c.q, c.r), {
        q: c.q,
        r: c.r,
        id: c.id ?? this.#hexId(c.q, c.r),
        code,
        terrain: c.terrain,
        fill,

        terrainFeature: c.terrainFeature ?? null,
        lostChance: this.tables.lostChanceTable?.[c.terrain]
          ? `${this.tables.lostChanceTable[c.terrain]}-in-6`
          : null,
        wildFeatures: this.#checkWildFeatureBoolean(c.wildFeatures) ?? null,

        settlement: c.settlement ?? [null, null],
        settlementText: c.settlement?.[0] ? (c.settlement?.[1] ?
          (c.settlement?.[0] + ", pop." + c.settlement?.[1]) : c.settlement?.[0]) : null,
        // settlementSize: c.settlementSize ?? null,

        regionName: c.regionName ?? null,
        regionNameText: c.regionName ? this.#extractRegionNameText(c.regionName) : null,

        encounterFeatures1: c.encounterFeatures1 ?? null,
        encounterFeatures2: c.encounterFeatures2 ?? null,
        encounterFeatures3: c.encounterFeatures3 ?? null,

        nFeatures: c.nFeatures ? this.#extractnFeatures(c.obviousFeature1, c.obviousFeature2, c.obviousFeature3, c.hiddenFeature1) : null,
        obviousFeature1: c.obviousFeature1 ?? null,
        obviousFeature2: c.obviousFeature2 ?? null,
        obviousFeature3: c.obviousFeature3 ?? null,
        hiddenFeature1: c.hiddenFeature1 ?? null,

        rerollSeed: c.rerollSeed ?? null,
      });
    }

  }

  exportSelectedRegionJSON() {
    if (!this.selectedKey) {
      throw new Error("No hex selected.");
    }

    const selectedCell = this.grid.get(this.selectedKey);
    if (!selectedCell) {
      throw new Error("Selected hex not found.");
    }

    const regionName = selectedCell.regionName ?? null;
    if (!regionName) {
      throw new Error("Selected hex has no regionName.");
    }

    return {
      meta: {
        cols: this.cols,
        rows: this.rows,
        hexSize: this.hexSize,
        startTerrain: this.startTerrain,
        seed: this.seed,
        exportedRegionName: regionName
      },
      cells: [...this.grid.values()]
        .filter(c => c.regionName === regionName)
        .map(c => this.#serializeCell(c))
    };
  }

  getSelectedRegionName() {
    if (!this.selectedKey) return null;
    return this.grid.get(this.selectedKey)?.regionName ?? null;
  }

  getSelectedRegionFilename() {
    const regionName = this.getSelectedRegionName();
    if (!regionName) return "hexmap-region.json";

    const safeName = String(regionName)
      .trim()
      .toLowerCase()
      .replace(/[\\/:"*?<>|]+/g, "")
      .replace(/\s+/g, " ");

    return `hexmap-${safeName}.json`;
  }

  // ---------- private helpers ----------
  #key(q, r) {
    return `${q},${r}`;
  }
  #pad3(n) {
    return n.toString().padStart(3, "0");
  }
  #hexId(q, r) {
    return `${this.#pad3(q)}.${this.#pad3(r)}`;
  }

  #setCell(q, r, { inputTerrain }) {
    const terrain = inputTerrain;
    const bTable = this.tables.baseTerrainTable;
    const code = bTable[terrain];

    const id = this.#hexId(q, r);

    // Base colour from main terrain
    const cTable = this.tables.colourTable;
    // const cKey = cTable[Object.keys[terrain]];
    let fill = cTable[terrain] || "#555";

    this.grid.set(this.#key(q, r), {
      q,
      r,
      id,
      terrain,
      code,
      fill,
      terrainFeature: null,
      // special: null,
      ruins: null,
      settlement: [null, null],
      // settlementSize: null,
      settlementText: null,
    });
  }

  #serializeCell(c) {
    return {
      q: c.q,
      r: c.r,
      id: c.id,
      terrain: c.terrain,
      terrainFeature: c.terrainFeature ?? null,
      lostChance: c.lostChance ?? null,
      encounterFeatures1: c.encounterFeatures1 ?? [null, null],
      encounterFeatures2: c.encounterFeatures2 ?? [null, null],
      encounterFeatures3: c.encounterFeatures3 ?? [null, null],
      wildFeatures: c.wildFeatures ?? null,

      ruins: c.ruins ?? null,
      settlement: c.settlement ?? null,

      regionName: c.regionName ?? null,

      nFeatures: c.nFeatures ?? null,
      obviousFeature1: c.obviousFeature1 ?? null,
      obviousFeature2: c.obviousFeature2 ?? null,
      obviousFeature3: c.obviousFeature3 ?? null,
      hiddenFeature1: c.hiddenFeature1 ?? null,

      rerollSeed: c.rerollSeed ?? null,
    };
  }

  #nextFromJSON(currentTerrainName, d20) {
    const col = this.tables.terrainTable[currentTerrainName];
    if (!col) return currentTerrainName;
    const exact = col[String(d20)];
    if (exact) return exact;
    for (const [rng, res] of Object.entries(col)) {
      if (!rng.includes("-")) continue;
      const [a, b] = rng.split("-").map(Number);
      if (d20 >= a && d20 <= b) return res;
    }
    return currentTerrainName;
  }

  #checkWildFeatureBoolean(wFeat) {
    if (!Array.isArray(wFeat)) return null;

    const out = [...wFeat];
    out[3] = this.tables.wildFeaturesWithSuppArray?.includes(out[2]) ?? false;
    return out;
  }

  #lookupFromTable(table, roll = null) {
    if (!table) return null;

    if (Array.isArray(table)) {
      const index = roll ?? this.#roll(table.length);
      return table[index - 1] ?? null;
    }

    if (typeof table === "object") {
      const actualRoll = roll ?? this.#roll(Object.keys(table).length);

      if (table[String(actualRoll)] !== undefined) {
        return table[String(actualRoll)];
      }

      for (const [rng, res] of Object.entries(table)) {
        if (!rng.includes("-")) continue;
        const [a, b] = rng.split("-").map(Number);
        if (actualRoll >= a && actualRoll <= b) return res;
      }

      return null;
    }

    console.log("Table is not an object or array");
    return null;
  }

  #categoryFromType(typeStr) {
    if (!typeStr) return null;
    const s = String(typeStr).toLowerCase();
    if (s.includes("city")) return "City";
    if (s.includes("large town") || s.includes("town (large)")) return "LargeTown";
    if (s.includes("small town") || s.includes("town (small)")) return "SmallTown";
    if (s.includes("village") || s.includes("hamlet")) return "Village";
    return null;
  }

  // Option A table-friendly dice (uses provided this.#roll(n): 1..n)
  #populationForCategory(category, roll) {
    switch (category) {
      case "Village": {
        let pop = 50 * this.#roll(20); // 50–1000
        if (pop === 1000) pop -= this.#roll(20); // keep ≤ 999
        return Math.max(50, pop);
      }
      case "SmallTown": {
        const twoD20 = this.#roll(20) + this.#roll(20); // 2–40
        return 100 * (twoD20 + 8); // 1000–4800
      }
      case "LargeTown": {
        let pop = 500 * (10 + this.#roll(20)); // 5000–15000
        if (pop === 15000) pop -= this.#roll(500); // cap ≤ 14999
        return Math.max(5000, pop);
      }
      case "City": {
        const twoD6 = this.#roll(6) + this.#roll(6); // 2–12
        return 15000 + 1000 * (twoD6 - 2); // 15000–25000
      }
      default:
        return null;
    }
  }

  // even-q neighbors (flat-top, from Red Blob Games)
  #neighborsOffsetEvenQ(q) {
    const even = [
      [+1, 0],
      [+1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [0, +1]
    ];
    const odd = [
      [+1, +1],
      [+1, 0],
      [0, -1],
      [-1, 0],
      [-1, +1],
      [0, +1]
    ];
    return q % 2 === 0 ? even : odd;
  }

  // offset -> axial -> pixel (flat-top)
  #offsetToAxial(q, r) {
    return { aq: q, ar: r - Math.floor(q / 2) }; // even-q
  }
  #axialToPixel(aq, ar) {
    const x = this.hexSize * 1.5 * aq;
    const y = this.hexSize * Math.sqrt(3) * (ar + aq / 2);
    return { x, y };
  }
  #offsetToPixel(q, r) {
    const { aq, ar } = this.#offsetToAxial(q, r);
    return this.#axialToPixel(aq, ar);
  }
  #hexPolygon(x, y, size) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const ang = (Math.PI / 180) * (60 * i); // 0,60,... flat-top
      pts.push([x + size * Math.cos(ang), y + size * Math.sin(ang)]);
    }
    return pts.map((p) => p.join(",")).join(" ");
  }

  // RNG & tiny util
  #mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  #hash2(a, b, seed = 0) {
    let h = 2166136261 ^ seed;
    h = Math.imul(h ^ a, 16777619);
    h = Math.imul(h ^ b, 16777619);
    return h | 0;
  }

  //  get the region name text
  #extractRegionNameText(entryText) {
    let text = entryText.slice(3);
    return text;
  }

  // get the number of obvious features
  #extractnFeatures(obv1, obv2, obv3, hid1) {
    let a = 0;
    let b = 0
    if (obv1 != null) a++;
    if (obv2 != null) a++;
    if (obv3 != null) a++;
    if (hid1 != null) b++;
    const nFeat = [a, b];
    return nFeat
  }

  // roll a sided dice
  #roll(sides) {
    return 1 + Math.floor(this.rng() * sides);
  }

  // Put values to a cell ready for a markdown
  #serializeMarkdownCell(c) {
    return `---
Title: 
Terrain: ${c.terrain ?? ""}
Lost/Encounter Chance: ${c.lostChance ?? ""}
Region Name: ${c.regionName ?? ""}
---`;
  }

  #getMarkdownFilename(c) {
    const safeId = String(c.id ?? "unknown").trim();
    return `${safeId}.md`;
  }

  exportMarkdown() {
    return [...this.grid.values()].map(c => ({
      filename: this.#getMarkdownFilename(c),
      content: this.#serializeMarkdownCell(c)
    }));
  }

}
