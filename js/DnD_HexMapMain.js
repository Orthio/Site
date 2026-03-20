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

  const terrainTable = data.hexWildernessTerrain ?? null;
  const terrainFeaturesTable = data.terrainFeatures ?? null;
  const inhabitationTable = data.hexInhabitation ?? null;
  const wildernessRollsTable = data.wildernessRollsTable ?? null
  const wildernessFeatureChance = data.wildernessFeatureChance ?? null;
  const wildernessEncountersTable = data.wildernessEncountersTable ?? null;
  const specificEncountersTable = data.specificEncountersTable ?? null;
  const wildernessFeaturesTable = data.wildernessFeaturesTable ?? null;
  const wildFeaturesWithSuppArray = data.wildFeaturesWithSuppArray ?? null;
  const specialInhabitationTable = data.specialInhabitation ?? (inhabitation ? inhabitation.Special : null) ?? null;
  const ruinsTypeTable = data.ruinsType ?? null;
  const ruinsDecayTable = data.ruinsDecay ?? null;
  const ruinsInhabitantsTable = data.ruinsInhabitants ?? null;
  const sandboxGenFeatureTable = data.sandboxGenFeatureTable ?? null;
  const sandboxGenSettlementTable = data.sandboxGenSettlementTable ?? null;
  const sandboxGenLandmarkStartingTable = data.sandboxGenLandmarkStartingTable ?? null;
  const sandboxGenLandmarkNaturalTable = data.sandboxGenLandmarkNaturalTable ?? null;
  const sandboxGenLandmarkArtificialTable = data.sandboxGenLandmarkArtificialTable ?? null;
  const sandboxGenLandmarkMagicTable = data.sandboxGenLandmarkMagicTable ?? null;
  const sandboxGenLandmarkContentTable = data.sandboxGenLandmarkContentTable ?? null;
  const sandboxGenHazardTable = data.sandboxGenHazardTable ?? null;
  const sandboxGenEmptyTable = data.sandboxGenEmptyTable ?? null;
  const sandboxGenSpecialStartTable = data.sandboxGenSpecialStartTable ?? null;
  const fillingFeatureTable = data.fillingFeatureTable ?? null;
  const sandboxGenSpecialDisputeTable = data.sandboxGenSpecialDisputeTable ?? null;
  const wildHexMatchingTable = data.wildHexMatchingTable ?? null;
  const forestWildHexTable = data.forestWildHexTable ?? null;
  const mountainWildHexTable = data.mountainWildHexTable ?? null;
  const desertWildHexTable = data.desertWildHexTable ?? null;
  const swampWildHexTable = data.swampWildHexTable ?? null;
  const oceanWildHexTable = data.oceanWildHexTable ?? null;


  hexMap.setTables({
    terrainTable,
    terrainFeaturesTable,
    inhabitationTable,
    wildernessRollsTable,
    wildernessFeatureChance,
    wildernessEncountersTable,
    specificEncountersTable,
    wildernessFeaturesTable,
    wildFeaturesWithSuppArray,
    specialInhabitationTable,
    ruinsDecayTable,
    ruinsTypeTable,
    ruinsInhabitantsTable,
    sandboxGenFeatureTable,
    sandboxGenSettlementTable,
    sandboxGenLandmarkStartingTable,
    sandboxGenLandmarkNaturalTable,
    sandboxGenLandmarkArtificialTable,
    sandboxGenLandmarkMagicTable,
    sandboxGenLandmarkContentTable,
    sandboxGenHazardTable,
    sandboxGenEmptyTable,
    sandboxGenSpecialStartTable,
    fillingFeatureTable,
    sandboxGenSpecialDisputeTable,
    wildHexMatchingTable,
    forestWildHexTable,
    mountainWildHexTable,
    desertWildHexTable,
    swampWildHexTable,
    oceanWildHexTable
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

      terrainFeatures: document.getElementById("terrainFeatures"),
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
      importMaz: document.getElementById("importMaz")
    }
  });
});
