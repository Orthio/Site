// js/DnD_HexMapMain.js
import { HexMapCore } from "./DnD_HexMapCore.js";
import { initControls } from "./DnD_HexMapControls.js";
import { initPersistence } from "./DnD_HexMapPersistence.js";
import { getSeedFromURL, randomUint32 } from "./DnD_HexMapUtils.js";

window.addEventListener("DOMContentLoaded", async () => {
  const svg = document.getElementById("map");
  if (!svg) throw new Error("#map SVG not found");

  const hexMap = new HexMapCore(svg, {
    cols: 15,
    rows: 10,
    hexSize: 28,
    startTerrain: "Plain"
  });

  const res = await fetch("json/DnD_Hexmap.json");
  if (!res.ok) {
    throw new Error(`Failed to load json/DnD_Hexmap.json: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();

  const terrain = data.hexWildernessTerrain ?? data.terrain ?? data;
  const features = data.hexFeatures ?? null;
  const inhabitation = data.hexInhabitation ?? null;
  const special = data.specialInhabitation ?? (inhabitation ? inhabitation.Special : null) ?? null;
  const ruinsType = data.ruinsType ?? null;
  const ruinsDecay = data.ruinsDecay ?? null;
  const ruinsInhabitants = data.ruinsInhabitants ?? null;

  hexMap.setTables({
    terrain,
    features,
    inhabitation,
    special,
    ruinsDecay,
    ruinsType,
    ruinsInhabitants
  });

  const initialSeed = getSeedFromURL() ?? randomUint32();

  initControls({
    hexMap,
    dom: {
      seedInput: document.getElementById("seedInput"),
      rerollBtn: document.getElementById("btnReroll"),
      seedNote: document.getElementById("seedNote"),

      hexId: document.getElementById("hexId"),
      hexCoords: document.getElementById("hexCoords"),
      hexTerrain: document.getElementById("hexTerrain"),
      hexTerrain2: document.getElementById("hexTerrain2"),

      hexFeatures: document.getElementById("hexFeatures"),
      ruinsBlock: document.getElementById("ruinsBlock"),
      ruinsDecay: document.getElementById("ruinsDecay"),
      ruinsType: document.getElementById("ruinsType"),
      ruinsInhabitants: document.getElementById("ruinsInhabitants"),

      hexSettlement: document.getElementById("hexSettlement"),
      hexSettlementSize: document.getElementById("hexSettlementSize"),
      saveSettlement: document.getElementById("saveSettlement")
    },
    initialSeed
  });

  initPersistence({
    hexMap,
    dom: {
      exportBtn: document.getElementById("exportGrid"),
      importInput: document.getElementById("importGrid")
    }
  });
});
