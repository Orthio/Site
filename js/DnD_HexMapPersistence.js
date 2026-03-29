// js/DnD_HexMapPersistence.js
export function initPersistence({ hexMap, dom }) {
  if (!hexMap) throw new Error("initPersistence: hexMap required");

  const exportBtn = dom?.exportBtn ?? document.getElementById("exportGrid");
  const importIn = dom?.importInput ?? document.getElementById("importGrid");
  const importMaz = dom?.importMaz ?? document.getElementById("importMaz");
  const exportRegion = dom?.exportRegion ?? document.getElementById("exportRegion");
  const openMaziatryMap = dom?.openMaziatryMap ?? document.getElementById("openMaziatryMap");
  const exportMarkButton = dom?.exportMarkButton ?? document.getElementById("exportMarkButton");

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const snapshot = hexMap.toJSON();
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hexmap.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  if (importIn) {
    importIn.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const snapshot = JSON.parse(text);
        hexMap.fromJSON(snapshot);
        hexMap.render();
      } catch (err) {
        alert("Invalid JSON file.");
        console.error(err);
      } finally {
        importIn.value = "";
      }
    });
  }

  if (importMaz) {
    importMaz.addEventListener("click", async () => {
      try {
        const response = await fetch("json/Maziatry_Sidesheet_Hexmap.json");
        if (!response.ok) throw new Error("Failed to load JSON");

        const snapshot = await response.json();
        hexMap.fromJSON(snapshot);
        hexMap.render();
      } catch (err) {
        alert("Failed to load JSON file.");
        console.error(err);
      }
    });
  }

  if (exportRegion) {
    exportRegion.addEventListener("click", () => {
      try {
        const snapshot = hexMap.exportSelectedRegionJSON();
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
          type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = hexMap.getSelectedRegionFilename();
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        alert(err.message);
        console.error(err);
      }
    });
  }

  if (openMaziatryMap) {
    openMaziatryMap.addEventListener("click", () => {
      window.open("DnD_Maziatry_Map.html", "_blank");
    });
  }

  if (exportMarkButton) {
    exportMarkButton.addEventListener("click", async () => {
      try {
        const files = hexMap.exportMarkdown();

        const zip = new JSZip();
        const folder = zip.folder("hexmap-markdown");

        for (const file of files) {
          folder.file(file.filename, file.content);
        }

        const blob = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE"
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "hexmap-markdown.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        alert(err.message);
        console.error(err);
      }
    });
  }

}
