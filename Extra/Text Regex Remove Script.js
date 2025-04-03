// Remove all lines like ![[... .original ...]]
const fs = require('fs');
const path = require('path');

const folderPath = `C:\\Users\\tomco\\Documents\\Dragon's Rest\\22 Characters`; // ← update this
const regexToRemove = /!\[\[.*?\.original.*?\]\]/g;

// /!\[\[.*?\.original.*?\]\]/g
// Removes original pic text


fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`Error stating file ${file}:`, err);
        return;
      }

      if (stats.isFile()) {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file ${file}:`, err);
            return;
          }

          const updatedContent = data.replace(regexToRemove, '');

          if (data !== updatedContent) {
            fs.writeFile(filePath, updatedContent, 'utf8', err => {
              if (err) {
                console.error(`Error writing file ${file}:`, err);
              } else {
                console.log(`Removed .original image text from: ${file}`);
              }
            });
          }
        });
      }
    });
  });
});
