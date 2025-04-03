// Removing unnecessary lines from each file
const fs = require('fs');
const path = require('path');

const folderPath = `C:\\Users\\tomco\\Documents\\Dragon's Rest\\22 Characters`; // ← update this
const textsToRemove = [
    '**Description: Appearance, Race, Portrayal, Traits**',
    '**Description: Appearance, Race, Mannerisms, Traits**',
    '**What are they doing: Minor and Major',
    '**How did they get to this point**',
    '**Key Info and Secrets**',
    '**Story Links**',
    '**What**',
    '**Who**',
    '**How**',
    '**Secret**'
];



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

                    let updatedContent = data;
                    textsToRemove.forEach(text => {
                        updatedContent = updatedContent.replace(text, '');
                    });

                    if (data !== updatedContent) {
                        fs.writeFile(filePath, updatedContent, 'utf8', err => {
                            if (err) {
                                console.error(`Error writing file ${file}:`, err);
                            } else {
                                console.log(`Removed specified text from: ${file}`);
                            }
                        });
                    }
                });
            }
        });
    });
});
