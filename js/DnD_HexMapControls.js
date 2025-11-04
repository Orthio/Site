// js/DnD_HexMapControls.js
import { getSeedFromURL, randomUint32, hashStringToUint32 } from "./DnD_HexMapUtils.js";

export function initControls({ hexMap, dom, initialSeed }) {
  if (!hexMap) throw new Error("initControls: hexMap required");

  const seedInput = dom?.seedInput ?? document.getElementById("seedInput");
  const noteEl    = dom?.seedNote  ?? document.getElementById("seedNote");
  const btn       = dom?.rerollBtn ?? document.getElementById("btnReroll");
  const svg       = hexMap.svg;

  const setNote = (s) => { if (noteEl) noteEl.textContent = `Seed: ${s}`; };

  const seed0 = (initialSeed ?? getSeedFromURL() ?? randomUint32()) >>> 0;
  if (seedInput) seedInput.value = String(seed0);
  setNote(seed0);
  hexMap.generate(seed0);
  hexMap.render();

  if (btn) {
    btn.addEventListener("click", () => {
      const val = seedInput?.value?.trim();
      const s = val ? (Number.isFinite(+val) ? (+val >>> 0) : hashStringToUint32(val)) : randomUint32();
      if (seedInput) seedInput.value = String(s);
      setNote(s);
      hexMap.generate(s);
      hexMap.render();
      const sp = new URLSearchParams(location.search);
      sp.set("seed", String(s));
      history.replaceState(null, "", `${location.pathname}?${sp.toString()}`);
    });
  }

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

  // Side panel bindings (optional)
  const idOut   = dom?.hexId    ?? document.getElementById("hexId");
  const crdOut  = dom?.hexCoords?? document.getElementById("hexCoords");
  const terOut  = dom?.hexTerrain??document.getElementById("hexTerrain");
  const natIn   = dom?.hexNatural??document.getElementById("hexNatural");
  const setIn   = dom?.hexSettlement??document.getElementById("hexSettlement");
  const sizeIn  = dom?.hexSettlementSize??document.getElementById("hexSettlementSize");
  const saveNat = dom?.saveNatural??document.getElementById("saveNatural");
  const saveSet = dom?.saveSettlement??document.getElementById("saveSettlement");

  svg.addEventListener("hexmap:select", (e) => {
    const c = e.detail.cell;
    if (idOut)  idOut.textContent = c.id;
    if (crdOut) crdOut.textContent = `q=${c.q}, r=${c.r}`;
    if (terOut) terOut.textContent = c.label;
    if (natIn)  natIn.value  = c.natural ?? "";
    if (setIn)  setIn.value  = c.settlement ?? "";
    if (sizeIn) sizeIn.value = c.settlementSize ?? "";
  });

  svg.addEventListener("click", (e) => {
    const poly = e.target.closest("polygon");
    if (!poly) return;
    const [q,r] = (poly.dataset.key || "").split(",").map(Number);
    if (!Number.isFinite(q) || !Number.isFinite(r)) return;
    hexMap.select(q,r);
  });

  if (saveNat) {
    saveNat.addEventListener("click", () => {
      const key = hexMap.selectedKey; if (!key) return;
      const [q,r] = key.split(",").map(Number);
      hexMap.setNatural(q,r, natIn?.value ?? "");
    });
  }
  if (saveSet) {
    saveSet.addEventListener("click", () => {
      const key = hexMap.selectedKey; if (!key) return;
      const [q,r] = key.split(",").map(Number);
      hexMap.setSettlement(q,r, setIn?.value ?? "", sizeIn?.value ?? null);
      hexMap.render(); // redraw to show settlement dot
    });
  }
}
