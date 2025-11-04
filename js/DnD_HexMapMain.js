// js/HexMapMain.js
import { HexMapCore } from "./DnD_HexMapCore.js";
import { initControls } from "./DnD_HexMapControls.js";
import { initPersistence } from "./DnD_HexMapPersistence.js";
import { getSeedFromURL, randomUint32 } from "./DnD_HexMapUtils.js";

window.addEventListener("DOMContentLoaded", async () => {
  const svg = document.getElementById("map");
  if (!svg) throw new Error("#map SVG not found");

  // Core: 15x10 rectangular flat-top, even-q IDs 000.000..014.009
  const hexMap = new HexMapCore(svg, {
    cols: 15,
    rows: 10,
    hexSize: 28,
    startTerrain: "Plain"
  });

  // Load JSON (terrain + inhabitation)
  const res = await fetch("json/DnD_Hexmap.json");
  if (!res.ok) throw new Error(`Failed to load json/DnD_Hexmap.json: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const terrain = data.hexWildernessTerrain ?? data.terrain ?? data;
  const inhabitation = data.hexInhabitation ?? null;
  hexMap.setTables({ terrain, inhabitation });

  // Seed resolution and initial render via controls
  const initialSeed = getSeedFromURL() ?? randomUint32();
  initControls({
    hexMap,
    dom: {
      seedInput: document.getElementById("seedInput"),
      rerollBtn: document.getElementById("btnReroll"),
      seedNote:  document.getElementById("seedNote"),
      // Side-panel (optional)
      hexId: document.getElementById("hexId"),
      hexCoords: document.getElementById("hexCoords"),
      hexTerrain: document.getElementById("hexTerrain"),
      hexNatural: document.getElementById("hexNatural"),
      hexSettlement: document.getElementById("hexSettlement"),
      hexSettlementSize: document.getElementById("hexSettlementSize"),
      saveNatural: document.getElementById("saveNatural"),
      saveSettlement: document.getElementById("saveSettlement")
    },
    initialSeed
  });

  // Optional: export/import
  initPersistence({
    hexMap,
    dom: {
      exportBtn: document.getElementById("exportGrid"),
      importInput: document.getElementById("importGrid")
    }
  });
});
