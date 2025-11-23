// js/DnD_HexMapCore.js
// Rectangular flat-top grid (15x10), even-q offset (q=0..14, r=0..9).
// IDs are "000.000" .. "014.009".
// Uses:
//   - hexWildernessTerrain for terrain transitions
//   - hexInhabitation (Dense, maybe Special)
//   - hexFeatures for terrain-based features
//   - ruinsType / ruinsDecay / ruinsInhabitants for ruins
//   - specialInhabitation when "Special" appears in inhabitation

export class HexMapCore {
  constructor(svgEl, opts = {}) {
    if (!svgEl) throw new Error("HexMapCore: svgEl is required");
    this.svg = svgEl;

    // Grid settings
    this.cols = opts.cols ?? 15; // q: 0..14
    this.rows = opts.rows ?? 10; // r: 0..9
    this.hexSize = opts.hexSize ?? 28;
    this.startTerrain = opts.startTerrain ?? "Plain";

    // Data/state
    this.table = null;              // terrain
    this.inhabitation = null;       // hexInhabitation
    this.features = null;           // hexFeatures
    this.specialInhabitation = null;// special table
    this.ruinsType = null;
    this.ruinsDecay = null;
    this.ruinsInhabitants = null;

    this.seed = 0;
    this.grid = new Map();          // key "q,r" -> cell
    this.selectedKey = null;

    // Base terrains (Pond/Depression are modifiers)
    this.T = {
      Plain: 1,
      Scrub: 2,
      Forest: 3,
      Rough: 4,
      Desert: 5,
      Hills: 6,
      Mountains: 7,
      Marsh: 8
    };
    this.COLOR = {
      [this.T.Plain]: "#6caf5f",
      [this.T.Scrub]: "#8bbf71",
      [this.T.Forest]: "#2e7d32",
      [this.T.Rough]: "#7a6756",
      [this.T.Desert]: "#c9ab52",
      [this.T.Hills]: "#8a7e63",
      [this.T.Mountains]: "#9aa3a7",
      [this.T.Marsh]: "#4b7068"
    };

    // Feature thresholds / keys for hexFeatures
    this.FEATURE_THRESH = {
      Plain: 4,
      Forest: 8,
      Hills: 6,
      Mountains: 10,
      Marsh: 17,   // uses swampFeatures in JSON
      Desert: 9
    };
    this.FEATURE_KEYS = {
      Plain: "plainsFeatures",
      Forest: "forestFeatures",
      Hills: "hillsFeatures",
      Mountains: "mountainsFeatures",
      Marsh: "swampFeatures",
      Desert: "desertFeatures"
    };
  }

  setTables({
    terrain,
    inhabitation = null,
    features = null,
    special = null,
    ruinsType = null,
    ruinsDecay = null,
    ruinsInhabitants = null
  } = {}) {
    if (!terrain || typeof terrain !== "object") {
      throw new Error("HexMapCore.setTables: terrain missing or invalid");
    }
    this.table = terrain;
    this.inhabitation = inhabitation && typeof inhabitation === "object" ? inhabitation : null;
    this.features = features && typeof features === "object" ? features : null;
    this.specialInhabitation = special && typeof special === "object" ? special : null;
    this.ruinsType = ruinsType && typeof ruinsType === "object" ? ruinsType : null;
    this.ruinsDecay = ruinsDecay && typeof ruinsDecay === "object" ? ruinsDecay : null;
    this.ruinsInhabitants =
      ruinsInhabitants && typeof ruinsInhabitants === "object" ? ruinsInhabitants : null;
  }

  // --- generation (rectangular, row-major) ---
  generate(seed) {
    if (!this.table) throw new Error("HexMapCore.generate: call setTables() first");
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
        const next = this.#nextFromJSON(baseParent, d20);
        const child =
          next === "Pond"
            ? { baseName: baseParent, variant: "P" }
            : next === "Depression"
            ? { baseName: baseParent, variant: "D" }
            : { baseName: next, variant: null };

        this.#setCell(q, r, child);
        const cell = this.getCell(q, r);

        // Terrain-based hex features (1d30 vs threshold)
        this.#maybeAddFeature(cell, roll);

        // Inhabitation (Dense) & population / specials
        this.#maybeAddInhabitation(cell, roll);

        // If feature mentions ruins, roll ruins details
        this.#maybeAddRuinsDetails(cell, roll);
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
      if (c) filled.push(c.baseName);
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
    if (!this.features) return;
    const base = cell.baseName;
    const th = this.FEATURE_THRESH[base] ?? 0;
    if (th <= 0) return;

    const d30 = roll(30);
    if (d30 > th) return;

    const key = this.FEATURE_KEYS[base];
    const list = key && Array.isArray(this.features[key]) ? this.features[key] : null;
    if (!list || list.length === 0) return;

    const pick = list[roll(list.length) - 1];
    if (!pick) return;

    cell.feature = pick;
  }

  #maybeAddInhabitation(cell, roll) {
    if (!this.inhabitation) return;

    const denseTable = this.inhabitation.Dense ?? this.inhabitation.dense ?? null;
    if (!denseTable) return;

    // 1d3; on 1 → 1d30 on Dense
    if (roll(3) !== 1) return;

    const type = this.#lookupFromTable(denseTable, roll(30));
    if (!type) return;

    // Special handling
    if (/special/i.test(type)) {
      const specialTbl = this.specialInhabitation ?? this.inhabitation.Special ?? null;
      if (specialTbl) {
        const special = this.#lookupFromTable(specialTbl, roll(30));
        if (special) {
          cell.special = special; // we can display this under FEATURES
        }
      }
      return;
    }

    // Normal settlement
    cell.settlement = type;
    const category = this.#categoryFromType(type);
    if (category) {
      cell.settlementSize = this.#populationForCategory(category, roll);
    }
  }

  #maybeAddRuinsDetails(cell, roll) {
    const text = cell.feature ?? "";
    if (!text) return;
    if (!/\bruin/i.test(text)) return; // look for "ruin"/"ruins" in feature text

    if (!this.ruinsType && !this.ruinsDecay && !this.ruinsInhabitants) return;

    const type = this.ruinsType ? this.#lookupFromTable(this.ruinsType, roll(20)) : null;
    const decay = this.ruinsDecay ? this.#lookupFromTable(this.ruinsDecay, roll(20)) : null;
    const inhabitants = this.ruinsInhabitants
      ? this.#lookupFromTable(this.ruinsInhabitants, roll(20))
      : null;

    cell.ruins = {
      type: type ?? "—",
      decay: decay ?? "—",
      inhabitants: inhabitants ?? "—"
    };
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

    for (const cell of this.grid.values()) {
      const { x, y } = this.#offsetToPixel(cell.q, cell.r);

      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      poly.setAttribute("points", this.#hexPolygon(x, y, HEX - 1));
      poly.setAttribute("class", "hex");
      poly.setAttribute("fill", cell.fill);
      poly.dataset.key = this.#key(cell.q, cell.r);
      poly.addEventListener("click", () => this.select(cell.q, cell.r));
      frag.appendChild(poly);

      // Multi-line label: Terrain / Settlement (optional) / ID
      const labelGroup = document.createElementNS("http://www.w3.org/2000/svg", "text");
      labelGroup.setAttribute("x", x);
      labelGroup.setAttribute("y", y);
      labelGroup.setAttribute("class", "label");
      labelGroup.setAttribute("text-anchor", "middle");
      labelGroup.setAttribute("dominant-baseline", "middle");
      if (cell.variant === "P") labelGroup.classList.add("label-pond");
      if (cell.variant === "D") labelGroup.classList.add("label-depression");

      // Line 1: terrain
      const t1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      t1.textContent = cell.label;
      t1.setAttribute("x", x);
      t1.setAttribute("dy", "0");
      labelGroup.appendChild(t1);

      // Line 2: settlement (optional)
      if (cell.settlement) {
        const t2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        t2.textContent = cell.settlement;
        t2.setAttribute("x", x);
        t2.setAttribute("dy", "1.1em");
        labelGroup.appendChild(t2);
      }

      // Line 3: hex ID (always)
      const t3 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      t3.textContent = cell.id;
      t3.setAttribute("x", x);
      t3.setAttribute("dy", cell.settlement ? "1.1em" : "1.1em");
      t3.setAttribute("fill", "#aaa");
      labelGroup.appendChild(t3);

      frag.appendChild(labelGroup);

      // Tiny settlement marker (if any) near bottom of hex
      if (cell.settlement) {
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", x);
        dot.setAttribute("cy", y + HEX * 0.45);
        dot.setAttribute("r", Math.max(2, Math.floor(HEX * 0.12)));
        dot.setAttribute("fill", "#ddd");
        dot.setAttribute("opacity", "0.9");
        dot.setAttribute("pointer-events", "none");
        frag.appendChild(dot);
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
    c.settlement = settlement ?? null;
    c.settlementSize =
      settlement != null
        ? Number.isFinite(+settlementSize)
          ? Math.max(0, Math.floor(+settlementSize))
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
        baseName: c.baseName,
        variant: c.variant,
        label: c.label,
        feature: c.feature ?? null,
        special: c.special ?? null,
        ruins: c.ruins ?? null,
        settlement: c.settlement ?? null,
        settlementSize: c.settlementSize ?? null
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
      const code = this.T[c.baseName] ?? this.T.Plain;
      const fill = this.COLOR[code] || "#555";
      this.grid.set(this.#key(c.q, c.r), {
        q: c.q,
        r: c.r,
        id: c.id,
        baseName: c.baseName,
        variant: c.variant,
        label: c.label,
        code,
        fill,
        feature: c.feature ?? null,
        special: c.special ?? null,
        ruins: c.ruins ?? null,
        settlement: c.settlement ?? null,
        settlementSize: c.settlementSize ?? null
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

  #setCell(q, r, { baseName, variant }) {
    const code = this.T[baseName] ?? this.T.Plain;
    const fill = this.COLOR[code] || "#555";
    const id = this.#hexId(q, r);
    const label = variant ? `${baseName}-${variant}` : baseName;
    this.grid.set(this.#key(q, r), {
      q,
      r,
      id,
      baseName,
      variant,
      label,
      code,
      fill,
      feature: null,
      special: null,
      ruins: null,
      settlement: null,
      settlementSize: null
    });
  }

  #nextFromJSON(currentTerrainName, d20) {
    const col = this.table[currentTerrainName];
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
}
