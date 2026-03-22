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

  hexMap.setTables(data);

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
      lostChance: document.getElementById("lostChance"),

      terrainFeature: document.getElementById("terrainFeature"),
      encounterFeatures1: document.getElementById("encounterFeatures1"),
      encounterFeatures2: document.getElementById("encounterFeatures2"),
      encounterFeatures3: document.getElementById("encounterFeatures3"),
      wildFeaturesText: document.getElementById("wildFeaturesText"),
      ruinsBlock: document.getElementById("ruinsBlock"),
      ruinsDecay: document.getElementById("ruinsDecay"),
      ruinsType: document.getElementById("ruinsType"),
      ruinsInhabitants: document.getElementById("ruinsInhabitants"),
      settlementText: document.getElementById("settlementText"),
      nFeatures: document.getElementById("nFeatures"),
      obviousFeature1: document.getElementById("obviousFeature1"),
      obviousFeature2: document.getElementById("obviousFeature2"),
      obviousFeature3: document.getElementById("obviousFeature3"),
      hiddenFeature1: document.getElementById("hiddenFeature1"),

    },
    initialSeed
  });

  initPersistence({
    hexMap,
    dom: {
      exportBtn: document.getElementById("exportGrid"),
      importInput: document.getElementById("importGrid"),
      importMaz: document.getElementById("importMaz"),
      exportRegion: document.getElementById("exportRegion"),
      exportMarkButton: document.getElementById("exportMarkButton")
    }
  });
});
