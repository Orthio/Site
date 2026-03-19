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
 * 
 * @property {string|null} terrainFeature // Marsh gas
 * @property {string|null} wildFeaturesType  // Hazard/Resource
 * @property {string|null} wildFeaturesDescription  // Consider a
 * @property {string|null} wildFeaturesIndex  // 6-6
 * @property {boolean} wildFeaturesHighlight // false
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
* @property {[number, number]} noFeatures  // 2, 1 
* @property {string|null} hexFeatureObvious1
* @property {string|null} hexFeatureObvious2
* @property {string|null} hexFeatureObvious3
* @property {string|null} hexFeatureHidden1
* @property {string|null} hexFeatureHidden2

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

    this.tables2 = {};

    // Base terrains
    this.tables2.T = {
      Plain: 1,
      Scrub: 2,
      Forest: 3,
      ForestWithHills: 4,
      Rough: 5,
      Desert: 6,
      Hills: 7,
      Mountains: 8,
      MountainsWithPass: 9,
      Marsh: 10,
      Lake: 11,
      Valley: 12,
    };
    this.COLOR = {
      [this.tables2.T.Plain]: "#9bfe03",
      [this.tables2.T.Scrub]: "#8bbf71",
      [this.tables2.T.Forest]: "#14d000",
      [this.tables2.T.ForestWithHills]: "#14d000",
      [this.tables2.T.Rough]: "#977926",
      [this.tables2.T.Desert]: "#f7d77d",
      [this.tables2.T.Hills]: "#be9006",
      [this.tables2.T.Mountains]: "#845704",
      [this.tables2.T.MountainsWithPass]: "#845704",
      [this.tables2.T.Marsh]: "#74a8a6",
      [this.tables2.T.Lake]: "#5ab3ff",
      [this.tables2.T.Valley]: "#b08bff"

    };


    // Thresholds for terrain having descriptive features such as gulch
    this.FEATURE_THRESH = {
      Plain: 4,
      Scrub: 20,
      Forest: 8,
      ForestWithHills: 8,
      Rough: 20,
      Desert: 9,
      Hills: 6,
      Mountains: 10,
      MountainsWithPass: 10,
      Marsh: 17,   // uses swampFeatures in JSON
      Lake: 20,
      Valley: 20
    };
    // Thesholds for forests becoming forest with hills, mountains having a pass
    this.tables2.TERRAIN_ADD_THRESH = {
      Plain: 20,
      Forest: 2,
      Hills: 2,
      Mountains: 1,
      Marsh: 20,
      Desert: 20
    };
    this.FEATURE_KEYS = {
      Plain: "plainsFeatures",
      Scrub: "plainsFeatures",
      Forest: "forestFeatures",
      ForestWithHills: "forestWithHillsFeatures",
      Rough: "plainsFeatures",
      Desert: "desertFeatures",
      Hills: "hillsFeatures",
      Mountains: "mountainsFeatures",
      MountainsWithPass: "mountainsFeatures",
      Marsh: "swampFeatures",
      Lake: "swampFeatures",
      Valley: "hillsFeatures"
    };
    this.ENCOUNTER_FEATURE_KEYS = {
      // Points to the right part of encFeaturesTable on json
      Plain: "Clear",
      Scrub: "Clear",
      Forest: "Forest",
      ForestWithHills: "Forest",
      Rough: "Hills",
      Desert: "Desert",
      Hills: "Hills",
      Mountains: "Hills",
      MountainsWithPass: "Hills",
      Marsh: "Swamp",
      Lake: "Ocean",
      Valley: "Desert"
    };
  }

  setTables({
    terrainTable = null,
    terrainFeaturesTable = null,
    inhabitationTable = null,
    wildernessRollsTable = null,
    wildernessFeatureChance = null,
    wildernessEncountersTable = null,
    specificEncountersTable = null,
    wildernessFeaturesTable = null,
    wildFeaturesWithSuppArray = null,
    specialInhabitationTable = null,
    ruinsTypeTable = null,
    ruinsDecayTable = null,
    ruinsInhabitantsTable = null,
    sandboxGenLandmarkStartingTable = null,
    sandboxGenLandmarkNaturalTable = null,
    sandboxGenLandmarkArtificialTable = null,
    sandboxGenLandmarkMagicTable = null,
    sandboxGenHazardTable = null,
    sandboxGenEmptyTable = null,
    sandboxGenSpecialStartTable = null,


  } = {}) {
    if (!terrainTable || typeof terrainTable !== "object") {
      throw new Error("HexMapCore.setTables: terrain missing or invalid");
    }
    this.tables.terrainTable = terrainTable;
    this.tables.terrainFeaturesTable = terrainFeaturesTable && typeof terrainFeaturesTable === "object" ? terrainFeaturesTable : null;
    this.tables.inhabitationTable = inhabitationTable && typeof inhabitationTable === "object" ? inhabitationTable : null;
    this.tables.wildernessRollsTable = wildernessRollsTable && typeof wildernessRollsTable === "object" ? wildernessRollsTable : null;
    this.tables.wildernessFeatureChance = wildernessFeatureChance && typeof wildernessFeatureChance === "object" ? wildernessFeatureChance : null;
    this.tables.wildernessEncountersTable = wildernessEncountersTable && typeof wildernessEncountersTable === "object" ? wildernessEncountersTable : null;
    this.tables.specificEncountersTable = specificEncountersTable && typeof specificEncountersTable === "object" ? specificEncountersTable : null;
    this.tables.wildernessFeaturesTable = wildernessFeaturesTable && typeof wildernessFeaturesTable === "object" ? wildernessFeaturesTable : null;
    this.tables.wildFeaturesWithSuppArray = wildFeaturesWithSuppArray && typeof wildFeaturesWithSuppArray === "object" ? wildFeaturesWithSuppArray : null;
    this.tables.specialInhabitationTable = specialInhabitationTable && typeof specialInhabitationTable === "object" ? specialInhabitationTable : null;
    this.tables.ruinsTypeTable = ruinsTypeTable && typeof ruinsTypeTable === "object" ? ruinsTypeTable : null;
    this.tables.ruinsDecayTable = ruinsDecayTable && typeof ruinsDecayTable === "object" ? ruinsDecayTable : null;
    this.tables.ruinsInhabitantsTable =
      ruinsInhabitantsTable && typeof ruinsInhabitantsTable === "object" ? ruinsInhabitantsTable : null;
    this.tables.sandboxGenLandmarkStartingTable = sandboxGenLandmarkStartingTable;
    this.tables.sandboxGenLandmarkNaturalTable = sandboxGenLandmarkNaturalTable;
    this.tables.sandboxGenLandmarkArtificialTable = sandboxGenLandmarkArtificialTable;
    this.tables.sandboxGenLandmarkMagicTable = sandboxGenLandmarkMagicTable;
    this.tables.sandboxGenHazardTable = sandboxGenHazardTable;
    this.tables.sandboxGenEmptyTable = sandboxGenEmptyTable;
    this.tables.sandboxGenSpecialStartTable = sandboxGenSpecialStartTable;

  }

  // --- generation (rectangular, row-major) ---
  generate(seed) {
    if (!this.tables.terrainTable) throw new Error("HexMapCore.generate: call setTables() first");
    this.seed = seed >>> 0;
    const rng = this.#mulberry32(this.seed);
    const roll = (n) => 1 + Math.floor(rng() * n); // 1..n
    const rollD20 = () => roll(20);

    this.grid.clear();

    for (let q = 0; q < this.cols; q++) {
      for (let r = 0; r < this.rows; r++) {
        const parentName = this.#parentTerrainMajority(q, r);
        const baseParent = parentName ?? this.startTerrain;

        // Terrain via Appendix B from chosen parent
        const d20 = rollD20();
        let next;
        let isSame = false
        if (parentName && roll(10) == 1) {
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
        this.#maybeAddTerrainExtra(cell, roll);

        // Now roll features using possibly-upgraded terrain
        this.#maybeAddFeature(cell, roll);

        // Inhabitation (Dense) & population / specials
        this.#maybeAddInhabitation(cell, roll);

        // If feature mentions ruins, roll ruins details
        this.#maybeAddRuinsDetails(cell, roll);

        // Check for encounters 1 to 3
        this.#maybeAddEncounterFeatures(cell, roll);
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

  #maybeAddFeature(cell, roll) {
    if (!this.tables.terrainFeaturesTable) return;
    const checkingTerrain = cell.terrain;
    const th = this.FEATURE_THRESH[checkingTerrain] ?? 0;
    if (th <= 0) return;

    const d30 = roll(30);
    if (d30 > th) return;

    const key = this.FEATURE_KEYS[checkingTerrain];


    const list = key && Array.isArray(this.tables.terrainFeaturesTable[key]) ? this.tables.terrainFeaturesTable[key] : null;
    if (!list || list.length === 0) return;

    const pick = list[roll(list.length) - 1];
    if (!pick) return;

    cell.terrainFeature = pick;
  }

  #maybeAddTerrainExtra(cell, roll) {
    const checkingTerrain = cell.terrain;

    let upgraded = null;
    if (checkingTerrain === "Forest") {
      upgraded = "ForestWithHills";
    } else if (checkingTerrain === "Mountains") {
      upgraded = "MountainsWithPass";
    } else {
      return;
    }

    const th = this.tables2.TERRAIN_ADD_THRESH[checkingTerrain] ?? 0;
    if (th <= 0) return;
    if (roll(20) > th) return;

    cell.terrain = upgraded;

    // NOTE: we *don't* touch colour here; #setCell already computed fill,
    // and our color mapping ensures upgraded names map back to the right base.
  }


  #maybeAddInhabitation(cell, roll) {
    if (!this.tables.inhabitationTable) return;

    const denseTable = this.tables.inhabitationTable.Dense ?? null;
    if (!denseTable) return;

    // 1d3; on 1 → 1d30 on Dense
    if (roll(3) !== 1) return;

    const type = this.#lookupFromTable(denseTable, roll(30));
    if (!type) return;

    // Special handling
    if (/special/i.test(type)) {
      const specialTbl = this.tables.specialInhabitationTable ?? null;
      if (cell.terrain === "Hills" || cell.terrain === "Mountains") {
        cell.settlement = ["Mine", null];
      }
      else if (specialTbl) {
        const special = this.#lookupFromTable(specialTbl, roll(30));
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
      cell.settlement[1] = this.#populationForCategory(category, roll);
    }
    cell.settlementText = null;
    cell.settlement?.[1] != null
      ? cell.settlementText = cell.settlement?.[0] + ", pop." + cell.settlement?.[1]
      : (cell.settlementText = cell.settlement?.[0] ?? [null, null]);
  }

  #maybeAddRuinsDetails(cell, roll) {
    const text = cell.settlement[0] ?? "";
    if (!text) return;
    if (!/\bruin/i.test(text)) return; // look for "ruin"/"ruins" in feature text

    if (!this.ruinsType && !this.ruinsDecay && !this.ruinsInhabitants) return;

    const type = this.ruinsType ? this.#lookupFromTable(this.ruinsType, roll(24)) : null;
    const decay = this.ruinsDecay ? this.#lookupFromTable(this.ruinsDecay, roll(6)) : null;
    const inhabitants = this.ruinsInhabitants
      ? this.#lookupFromTable(this.ruinsInhabitants, roll(10))
      : null;

    cell.ruins = {
      type: type ?? "—",
      decay: decay ?? "—",
      inhabitants: inhabitants ?? "—"
    };
  }

  #maybeAddEncounterFeatures(cell, roll) {
    if (!this.tables.wildernessEncountersTable) return;
    if (!this.tables.wildernessRollsTable) return;
    if (!this.tables.specificEncountersTable) return;
    if (!this.tables.wildernessFeaturesTable) return;


    const terrainCheck = cell.terrain;

    const rolls = this.tables.wildernessRollsTable[terrainCheck] ?? 0;            // e.g. Forest -> 2
    if (rolls <= 0) return;

    // which column of encFeaturesTable to use for this terrain
    const tableKey = this.ENCOUNTER_FEATURE_KEYS[terrainCheck];
    const col = tableKey && typeof this.tables.wildernessEncountersTable[tableKey] === "object"
      ? this.tables.wildernessEncountersTable[tableKey]
      : null;
    if (!col) return;

    // clear previous results (so rerolls don't keep old ones)
    cell.encounterFeatures1 = null;
    cell.encounterFeatures2 = null;
    cell.encounterFeatures3 = null;
    cell.wildFeaturesType = null;
    cell.wildFeaturesDescription = null;
    cell.wildFeaturesIndex = null;
    cell.wildFeaturesHighlight = null;

    for (let i = 1; i <= Math.min(3, rolls); i++) {

      // d8 on the column
      const categoryPick = col[String(roll(8))] ?? null;
      if (!categoryPick) continue;

      // d20 on the type
      const subTableColumn = this.tables.specificEncountersTable[categoryPick];
      const animalPick = subTableColumn[String(roll(20))] ?? null;

      const villageTypes = ["Village", "Small Town", "Large Town", "City"];

      if (!villageTypes.includes(cell.settlement[0])) {
        cell[`encounterFeatures${i}`] = [categoryPick, animalPick];
      }
    }

    if (roll(2) > 1) {
      const wildFeaturesRoll = String(roll(36));
      cell.wildFeaturesType = this.tables.wildernessFeaturesTable[wildFeaturesRoll][0] ?? null;
      cell.wildFeaturesDescription = this.tables.wildernessFeaturesTable[wildFeaturesRoll][1] ?? null;
      cell.wildFeaturesIndex = this.tables.wildernessFeaturesTable[wildFeaturesRoll][2] ?? null;
      cell.wildFeaturesHighlight = this.tables.wildFeaturesWithSuppArray?.includes(cell.wildFeaturesIndex) ?? false;
    } else {
      cell.wildFeaturesType = null;
      cell.wildFeaturesDescription = null;
      cell.wildFeaturesIndex = null;
      cell.wildFeaturesHighlight = null;
    }

    if (cell.terrain === "Lake") {
      cell.wildFeaturesType = null;
      cell.wildFeaturesDescription = null;
      cell.wildFeaturesIndex = null;
      cell.wildFeaturesHighlight = null;
    }
    if (cell.settlement?.[0] != null) {
      cell.wildFeaturesType = null;
      cell.wildFeaturesDescription = null;
      cell.wildFeaturesIndex = null;
      cell.wildFeaturesHighlight = null;
    }

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
      cell.ruins = null;
      cell.encounterFeatures1 = null;
      cell.encounterFeatures2 = null;
      cell.encounterFeatures3 = null;
      cell.wildFeaturesType = null;
      cell.wildFeaturesDescription = null;
      cell.wildFeaturesIndex = null;
      cell.wildFeaturesHighlight = null;


      // Rebuild
      this.#maybeAddFeature(cell, roll);
      this.#maybeAddEncounterFeatures(cell, roll);
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
        maxX - minX + pad * 2
      )} ${Math.ceil(maxY - minY + pad * 2)}`
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

      // console.log(cell.id, cell.wildFeaturesIndex, cell.wildFeaturesHighlight);

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

      const labelColor = cell.wildFeaturesHighlight ? "#ff44f3" : "#000000";
      labelGroup.style.fill = labelColor;

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
        if (cell.wildFeaturesType) lines.push(cell.wildFeaturesType);
        if (cell.wildFeaturesIndex) lines.push(cell.wildFeaturesIndex);

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
      cells: [...this.grid.values()].map((c) => ({
        q: c.q,
        r: c.r,
        id: c.id,
        terrain: c.terrain,
        terrainFeature: c.terrainFeature ?? null,
        encounterFeatures1: c.encounterFeatures1 ?? [null, null],
        encounterFeatures2: c.encounterFeatures2 ?? [null, null],
        encounterFeatures3: c.encounterFeatures3 ?? [null, null],
        wildFeatures: [c.wildFeaturesType, c.wildFeaturesDescription, c.wildFeaturesIndex] ?? null,

        ruins: c.ruins ?? null,
        settlement: c.settlement ?? null,
        // settlementSize: c.settlementSize ?? null,

        regionName: c.regionName ?? null,

        hexFeatureObvious1: c.hexFeatureObvious1 ?? null,
        hexFeatureObvious2: c.hexFeatureObvious2 ?? null,
        hexFeatureObvious3: c.hexFeatureObvious3 ?? null,
        hexFeatureHidden1: c.hexFeatureHidden1 ?? null,
        hexFeatureHidden2: c.hexFeatureHidden2 ?? null,

        rerollSeed: c.rerollSeed ?? null,

      }))
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
      const code = this.tables2.T[terrainStr] ?? this.tables2.T.Plain;
      const fill = this.COLOR[code] || "#555";

      this.grid.set(this.#key(c.q, c.r), {
        q: c.q,
        r: c.r,
        id: c.id ?? this.#hexId(c.q, c.r),
        code,
        terrain: c.terrain,
        fill,

        terrainFeature: c.terrainFeature ?? null,
        wildFeaturesType: c.wildFeatures?.[0] ?? null,
        wildFeaturesDescription: c.wildFeatures?.[1] ?? null,
        wildFeaturesIndex: c.wildFeatures?.[2] ?? null,
        wildFeaturesHighlight: this.wildFeaturesWithSuppArray?.includes(c.wildFeatures?.[2]) ?? false,

        settlement: c.settlement ?? null,
        settlementText: c.settlement?.[0] ? (c.settlement?.[1] ?
          (c.settlement?.[0] + ", pop." + c.settlement?.[1]) : c.settlement?.[0]) : null,
        // settlementSize: c.settlementSize ?? null,

        regionName: c.regionName ?? null,
        regionNameText: c.regionName ? this.#extractRegionNameText(c.regionName) : null,

        encounterFeatures1: c.encounterFeatures1 ?? null,
        encounterFeatures2: c.encounterFeatures2 ?? null,
        encounterFeatures3: c.encounterFeatures3 ?? null,

        hexFeatureObvious1: c.hexFeatureObvious1 ?? null,
        hexFeatureObvious2: c.hexFeatureObvious2 ?? null,
        hexFeatureObvious3: c.hexFeatureObvious3 ?? null,
        hexFeatureHidden1: c.hexFeatureHidden1 ?? null,
        hexFeatureHidden2: c.hexFeatureHidden2 ?? null,

        rerollSeed: c.rerollSeed ?? null,


      });

    }


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
    // Use special mapping for colour if this is a composite terrain
    const code = this.tables2.T[inputTerrain] ?? this.tables2.T.Plain;

    const id = this.#hexId(q, r);
    const terrain = inputTerrain;

    // Base colour from main terrain
    let fill = this.COLOR[code] || "#555";

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
      settlement: [null,null],
      // settlementSize: null,
      settlementText: null,
    });
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

  #lookupFromTable(tableObj, roll) {
    if (!tableObj) return null;
    if (tableObj[String(roll)]) return tableObj[String(roll)];
    for (const [rng, res] of Object.entries(tableObj)) {
      if (!rng.includes("-")) continue;
      const [a, b] = rng.split("-").map(Number);
      if (roll >= a && roll <= b) return res;
    }
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

  // Option A table-friendly dice (uses provided roll(n): 1..n)
  #populationForCategory(category, roll) {
    switch (category) {
      case "Village": {
        let pop = 50 * roll(20); // 50–1000
        if (pop === 1000) pop -= roll(20); // keep ≤ 999
        return Math.max(50, pop);
      }
      case "SmallTown": {
        const twoD20 = roll(20) + roll(20); // 2–40
        return 100 * (twoD20 + 8); // 1000–4800
      }
      case "LargeTown": {
        let pop = 500 * (10 + roll(20)); // 5000–15000
        if (pop === 15000) pop -= roll(500); // cap ≤ 14999
        return Math.max(5000, pop);
      }
      case "City": {
        const twoD6 = roll(6) + roll(6); // 2–12
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
}
