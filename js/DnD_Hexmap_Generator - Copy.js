// js/DnD_Hexmap_Generator.js

// ---- Config you can tweak ----
const JSON_PATH = "json/DnD_Hexmap.json";

// Adjust these two to change density/coverage. With 1920x1080 screens,
// HEX_SIZE 26–30 and RADIUS 14–18 usually fill the viewport nicely.
const HEX_SIZE = 56;    // radius of a hex in pixels
const RADIUS = 7;    // number of rings out from center

const SEED = 12345;     // change to re-seed

const STARTING_TERRAIN = "Plain";

// --- Seed helpers ---
function getSeedFromURL() {
    const sp = new URLSearchParams(location.search);
    const s = sp.get("seed");
    if (s == null) return null;
    const n = Number(s);
    return Number.isFinite(n) ? (n >>> 0) : hashStringToUint32(s);
}
function hashStringToUint32(str) {
    // Simple DJB2-ish string hash -> uint32
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
    return h >>> 0;
}
function randomUint32() {
    if (crypto?.getRandomValues) {
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        return arr[0] >>> 0;
    }
    return (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
}

// --- Mulberry32 PRNG ---
function mulberry32(a) {
    return function () {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// --- Globals set after JSON load ---
let TABLE_ROOT = null;

// Load JSON then init UI & first render
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("json/DnD_Hexmap.json");
        if (!res.ok) throw new Error(`Failed to load json/DnD_Hexmap.json: ${res.status} ${res.statusText}`);
        const data = await res.json();

        // Your JSON should be { "hexWildernessTerrain": { Plain:{...}, Scrub:{...}, ... } }
        TABLE_ROOT = data.hexWildernessTerrain ?? data;
        if (!TABLE_ROOT || typeof TABLE_ROOT !== "object") {
            console.error("Loaded JSON:", data);
            throw new Error("hexWildernessTerrain not found or invalid in JSON.");
        }

        // Quick sanity log:
        console.log("Terrain keys in JSON:", Object.keys(TABLE_ROOT));

        const initialSeed = getSeedFromURL() ?? randomUint32();
        wireUI(initialSeed, TABLE_ROOT);      // pass TABLE_ROOT down
        // If your wireUI skips (no controls), it should call regenerate(initialSeed, TABLE_ROOT)
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
});



// --- UI wiring (seed input + reroll button) ---
function wireUI(seed) {
    const seedInput = document.getElementById("seedInput");
    const note = document.getElementById("seedNote");
    const btn = document.getElementById("btnReroll");

    // If the HTML UI isn't present, just build the map once and return.
    if (!seedInput || !note || !btn) {
        regenerate(seed, TABLE_ROOT);
        return;
    }

    const setNote = (s) => note.textContent = `Current seed: ${s}  (tip: use ?seed=${s} in the URL)`;
    seedInput.value = String(seed);
    setNote(seed);

    btn.addEventListener("click", () => {
        const val = seedInput.value.trim();
        const s = val ? (Number.isFinite(+val) ? (+val >>> 0) : hashStringToUint32(val)) : randomUint32();
        seedInput.value = String(s);
        setNote(s);
        regenerate(s);
        // Optional: keep URL in sync (no reload)
        const sp = new URLSearchParams(location.search);
        sp.set("seed", String(s));
        history.replaceState(null, "", `${location.pathname}?${sp.toString()}`);
    });

    // Press "r" to reroll
    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "r") {
            const s = randomUint32();
            seedInput.value = String(s);
            setNote(s);
            regenerate(s, TABLE_ROOT);
            const sp = new URLSearchParams(location.search);
            sp.set("seed", String(s));
            history.replaceState(null, "", `${location.pathname}?${sp.toString()}`);
        }
    });

    // Also generate immediately on first load
    regenerate(seed, TABLE_ROOT);
}

// === Core generation (same logic, but now parameterized by seed) ===
function regenerate(seed, TABLE_ROOT) {
    const rng = mulberry32(seed >>> 0);
    const rollD20 = () => 1 + Math.floor(rng() * 20);

    const grid = new Map();
    function setCell(q, r, { baseName, variant }) {
        const code = T[baseName] ?? T.Plain;
        const fill = TERRAIN_COLOR[code] || "#555";
        grid.set(`${q},${r}`, {
            q, r, baseName, variant, code, fill,
            label: variant ? `${baseName}-${variant}` : baseName
        });
    }

    // seed
    setCell(0, 0, { baseName: "Plain", variant: null });

    // BFS
    const frontier = [[0, 0]];
    const inBounds = (Q, R) => axialDistance(0, 0, Q, R) <= RADIUS;

    while (frontier.length) {
        const [cq, cr] = frontier.shift();
        const curr = grid.get(`${cq},${cr}`);

        for (const [nq, nr] of neighborsAxial(cq, cr)) {
            if (!inBounds(nq, nr)) continue;
            const k = `${nq},${nr}`;
            if (grid.has(k)) continue;

            const parentBaseName = curr.baseName;
            const d20 = rollD20();
            const result = nextFromJSON(TABLE_ROOT, parentBaseName, d20);

            const child =
                result === "Lake" ? { baseName: parentBaseName, variant: 'P' } :
                    result === "Depression" ? { baseName: parentBaseName, variant: 'D' } :
                        { baseName: result, variant: null };

            setCell(nq, nr, child);
            frontier.push([nq, nr]);
        }
    }

    render(grid);
}



// ---- Terrain setup (names used in your JSON) ----
const T = {
    Plain: 1,
    Scrub: 2,
    Forest: 3,
    Rough: 4,
    Desert: 5,
    Hills: 6,
    Mountains: 7,
    Marsh: 8
    // Lake / Depression are treated as modifiers, not base terrains
};
const TERRAIN_COLOR = {
    [T.Plain]: "#6caf5f",
    [T.Scrub]: "#8bbf71",
    [T.Forest]: "#2e7d32",
    [T.Rough]: "#7a6756",
    [T.Desert]: "#c9ab52",
    [T.Hills]: "#8a7e63",
    [T.Mountains]: "#9aa3a7",
    [T.Marsh]: "#4b7068"
};

// ---- Hex math (axial, pointy top) ----
function axialToPixel(q, r) {
    const x = HEX_SIZE * 1.5 * q;
    const y = HEX_SIZE * Math.sqrt(3) * (r + q / 2);
    return { x, y };
}

function hexPolygon(x, y, size) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
        // 0°,60°,120°,... gives flat-top orientation
        const ang = Math.PI / 180 * (60 * i);
        pts.push([x + size * Math.cos(ang), y + size * Math.sin(ang)]);
    }
    return pts.map(p => p.join(",")).join(" ");
}
function axialDistance(q1, r1, q2, r2) {
    const x1 = q1, z1 = r1, y1 = -x1 - z1;
    const x2 = q2, z2 = r2, y2 = -x2 - z2;
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2), Math.abs(z1 - z2));
}
function neighborsAxial(q, r) {
    return [[q + 1, r], [q - 1, r], [q, r + 1], [q, r - 1], [q + 1, r - 1], [q - 1, r + 1]];
}
const key = (q, r) => `${q},${r}`;

function nextFromJSON(TABLE_ROOT, currentTerrainName, d20) {
    if (!TABLE_ROOT) throw new Error("TABLE_ROOT is not set when calling nextFromJSON.");
    const col = TABLE_ROOT[currentTerrainName];
    if (!col) {
        console.warn(`Terrain "${currentTerrainName}" not found in JSON. Falling back to same terrain.`);
        return currentTerrainName;
    }

    // Prefer exact "1".."20"
    const exact = col[String(d20)];
    if (exact) return exact;

    // Optional: tolerate range keys like "1-11"
    for (const [rng, res] of Object.entries(col)) {
        if (!rng.includes("-")) continue;
        const [a, b] = rng.split("-").map(Number);
        if (d20 >= a && d20 <= b) return res;
    }

    return currentTerrainName;
}


function render(grid) {
    const svg = document.getElementById("map");
    const frag = document.createDocumentFragment();

    // Compute dynamic bounds to set viewBox so it fills the screen
    let minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
    for (const cell of grid.values()) {
        const { x, y } = axialToPixel(cell.q, cell.r);
        minX = Math.min(minX, x - HEX_SIZE);
        maxX = Math.max(maxX, x + HEX_SIZE);
        minY = Math.min(minY, y - HEX_SIZE);
        maxY = Math.max(maxY, y + HEX_SIZE);
    }
    const pad = HEX_SIZE * 1.5;
    const vbX = Math.floor(minX - pad);
    const vbY = Math.floor(minY - pad);
    const vbW = Math.ceil((maxX - minX) + pad * 2);
    const vbH = Math.ceil((maxY - minY) + pad * 2);
    svg.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);

    for (const cell of grid.values()) {
        const { x, y } = axialToPixel(cell.q, cell.r);

        // Hex polygon
        const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        poly.setAttribute("points", hexPolygon(x, y, HEX_SIZE - 1));
        poly.setAttribute("class", "hex");
        poly.setAttribute("fill", cell.fill);
        poly.dataset.q = cell.q;
        poly.dataset.r = cell.r;
        poly.addEventListener("click", () => {
            alert(`(${cell.q},${cell.r}) — ${cell.label}`);
        });
        frag.appendChild(poly);

        // Scaled label: make it smaller on dense maps, larger on sparse
        const fontPx = Math.max(8, Math.floor(HEX_SIZE * 0.55)); // tweak factor as you like
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x);
        label.setAttribute("y", y);
        label.setAttribute("class", "label");
        label.setAttribute("font-size", `${fontPx}px`);

        // Variant text colour
        if (cell.variant === 'P') {
            label.classList.add("label-lake");
        } else if (cell.variant === 'D') {
            label.classList.add("label-depression");
        }

        // Show compact label e.g. "Plain-P"
        label.textContent = cell.label;
        frag.appendChild(label);
    }

    svg.innerHTML = "";
    svg.appendChild(frag);
}
