
// Moves files out of the targetRoot folder folders, and deletes that folder

// To use, first use cd C:\Users\tomco\Documents\Code\Site\Public\Extra"
// Then use node "Move File Script.js"

const fs = require('fs').promises;
const path = require('path');

const targetRoot = `C:\\Users\\tomco\\Documents\\Dragon's Rest\\23 Factions`;

async function moveFilesAndClean(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await moveFilesAndClean(fullPath);
    } else if (dir !== targetRoot) {
      const newPath = path.join(targetRoot, entry.name);

      try {
        await fs.rename(fullPath, newPath);
        console.log(`Moved: ${fullPath} → ${newPath}`);
      } catch (err) {
        console.error(`Failed to move ${fullPath}:`, err);
      }
    }
  }

  // After everything moved, try to remove folder (only if not root)
  if (dir !== targetRoot) {
    try {
      await fs.rmdir(dir);
      console.log(`Deleted folder: ${dir}`);
    } catch (err) {
      console.warn(`Could not delete folder ${dir} (maybe not empty):`, err.message);
    }
  }
}

moveFilesAndClean(targetRoot).catch(console.error);
