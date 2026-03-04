// js/DnD_HexMapControls.js
import { getSeedFromURL, randomUint32, hashStringToUint32 } from "./DnD_HexMapUtils.js";

export function initControls({ hexMap, dom, initialSeed }) {
  if (!hexMap) throw new Error("initControls: hexMap required");

  const seedInput = dom?.seedInput ?? document.getElementById("seedInput");
  const noteEl = dom?.seedNote ?? document.getElementById("seedNote");
  const btn = dom?.rerollBtn ?? document.getElementById("btnReroll");
  const svg = hexMap.svg;

  const setNote = (s) => {
    if (noteEl) noteEl.textContent = `Seed: ${s}`;
  };

  // initial render
  const seed0 = (initialSeed ?? getSeedFromURL() ?? randomUint32()) >>> 0;
  if (seedInput) seedInput.value = String(seed0);
  setNote(seed0);
  hexMap.generate(seed0);
  hexMap.render();

  // reroll button
  if (btn) {
    btn.addEventListener("click", () => {
      const val = seedInput?.value?.trim();
      const s = val
        ? Number.isFinite(+val)
          ? +val >>> 0
          : hashStringToUint32(val)
        : randomUint32();
      if (seedInput) seedInput.value = String(s);
      setNote(s);
      hexMap.generate(s);
      hexMap.render();
      const sp = new URLSearchParams(location.search);
      sp.set("seed", String(s));
      history.replaceState(null, "", `${location.pathname}?${sp.toString()}`);
    });
  }


  // Button for rerolling features after importing a json
  const rerollBtn = document.getElementById("rerollButton");
  if (rerollBtn) {
    rerollBtn.addEventListener("click", () => {
      hexMap.rerollAllFeaturesAndEncounters();

      hexMap.render();
      if (hexMap.selectedKey) {
        const [q, r] = hexMap.selectedKey.split(",").map(Number);
        hexMap.select(q, r); // refresh side panel if something is selected
      }
    });

  }


  // R hotkey
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r") {
      const s = randomUint32();
      if (seedInput) seedInput.value = String(s);
      setNote(s);
      hexMap.generate(s);
      hexMap.render();
      const sp = new URLSearchParams(location.search);
      sp.set("seed", String(s));
      history.replaceState(null, "", `${location.pathname}?${sp.toString()}`);
    }
  });

  // Side panel bindings
  const idOut = dom?.hexId ?? document.getElementById("hexId");
  const crdOut = dom?.hexCoords ?? document.getElementById("hexCoords");
  const terOut = dom?.hexTerrain ?? document.getElementById("hexTerrain");

  const featOut = dom?.hexFeatures ?? document.getElementById("hexFeatures");
  const enc1Out = dom?.encounterFeatures1 ?? document.getElementById("encounterFeatures1");
  const enc2Out = dom?.encounterFeatures2 ?? document.getElementById("encounterFeatures2");
  const enc3Out = dom?.encounterFeatures3 ?? document.getElementById("encounterFeatures3");
  const wildFeatOut = dom?.wildFeaturesText ?? document.getElementById("wildFeaturesText");
  const ruinsBlock = dom?.ruinsBlock ?? document.getElementById("ruinsBlock");
  const ruDecay = dom?.ruinsDecay ?? document.getElementById("ruinsDecay");
  const ruType = dom?.ruinsType ?? document.getElementById("ruinsType");
  const ruInh = dom?.ruinsInhabitants ?? document.getElementById("ruinsInhabitants");

  const setOut = dom?.settlementText ?? document.getElementById("settlementText");

  svg.addEventListener("hexmap:select", (e) => {
    const c = e.detail.cell;
    if (idOut) idOut.textContent = c.id;
    if (crdOut) crdOut.textContent = `q=${c.q}, r=${c.r}`;
    if (terOut) terOut.textContent = c.baseName;

    // Features (natural + special, combined)
    const lines = [];
    if (c.feature) lines.push(c.feature);
    if (c.special) lines.push(`Special: ${c.special}`);
    if (featOut) featOut.textContent = lines.length ? lines.join(" | ") : "—";
    if (enc1Out) enc1Out.textContent = c.encounterFeatures1 ?? "—";
    if (enc2Out) enc2Out.textContent = c.encounterFeatures2 ?? "—";
    if (enc3Out) enc3Out.textContent = c.encounterFeatures3 ?? "—";
    if (wildFeatOut) wildFeatOut.textContent = c.wildFeaturesText ?? "—";
    if (setOut) setOut.textContent = c.settlementText ?? "";

    // Ruins details
    if (c.ruins && ruinsBlock) {
      if (ruType) ruType.textContent = c.ruins.type ?? "—";
      if (ruDecay) ruDecay.textContent = c.ruins.decay ?? "—";
      if (ruInh) ruInh.textContent = c.ruins.inhabitants ?? "—";
      ruinsBlock.style.display = "";
    } else if (ruinsBlock) {
      ruinsBlock.style.display = "none";
    }

  });

  // click polygon → select
  svg.addEventListener("click", (e) => {
    const poly = e.target.closest("polygon");
    if (!poly) return;
    const [q, r] = (poly.dataset.key || "").split(",").map(Number);
    if (!Number.isFinite(q) || !Number.isFinite(r)) return;
    hexMap.select(q, r);
  });

  // Toggle button to show encounter features
  const toggleEncBtn = document.getElementById("toggleEncounterLabels");
  if (toggleEncBtn) {
    toggleEncBtn.addEventListener("click", () => {
      if (hexMap.labelMode === "encounters") {
        hexMap.labelMode = "default";
        toggleEncBtn.textContent = "Show Encounters";
        toggleWildBtn.textContent = "Show Wilderness Stocking";
      } else if (hexMap.labelMode === "wildStocking") {
        hexMap.labelMode = "encounters"
        toggleEncBtn.textContent = "Show Terrain";
        toggleWildBtn.textContent = "Show Wilderness Stocking";
      } else {
        hexMap.labelMode = "encounters"
        toggleEncBtn.textContent = "Show Terrain";
        toggleWildBtn.textContent = "Show Wilderness Stocking";
      }

      hexMap.render();
      if (hexMap.selectedKey) {
        const [q, r] = hexMap.selectedKey.split(",").map(Number);
        hexMap.select(q, r); // keep side panel synced
      }
    });
  }

  // Toggle button to show wilderness stocking features
  const toggleWildBtn = document.getElementById("toggleWildLabels");
  if (toggleWildBtn) {
    toggleWildBtn.addEventListener("click", () => {
      
      if (hexMap.labelMode === "wildStocking") {
        hexMap.labelMode = "default";
        toggleEncBtn.textContent = "Show Encounters";
        toggleWildBtn.textContent = "Show Wilderness Stocking";
      } else if (hexMap.labelMode === "encounters") {
        hexMap.labelMode = "wildStocking"
        toggleEncBtn.textContent = "Show Encounters";
        toggleWildBtn.textContent = "Show Terrain";
      } else {
        hexMap.labelMode = "wildStocking"
        toggleEncBtn.textContent = "Show Encounters";
        toggleWildBtn.textContent = "Show Terrain";
      }

      hexMap.render();
      if (hexMap.selectedKey) {
        const [q, r] = hexMap.selectedKey.split(",").map(Number);
        hexMap.select(q, r); // keep side panel synced
      }
    });
  }
}
