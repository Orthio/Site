module.exports = async (params) => {
    const { app } = params;

    // Read the monster stat block from the clipboard.
    let text = await navigator.clipboard.readText();

    if (!text || !text.trim()) {
        new Notice("Your clipboard is empty.");
        return;
    }

    text = convertOSEStatBlock(text);

    // Insert the converted block at the current cursor position.
    const editor = app.workspace.activeEditor?.editor;

    if (editor) {
        editor.replaceSelection(text);
        new Notice("OSE stat block inserted.");
    } else {
        // Fall back to copying the result if no Markdown editor is open.
        await navigator.clipboard.writeText(text);
        new Notice("No editor was open. Converted stat block copied to clipboard.");
    }
};

function convertOSEStatBlock(input) {
    let text = input
        // Normalise Windows and Mac line endings.
        .replace(/\r\n?/g, "\n")

        // Remove quotation marks surrounding the entire pasted block.
        .trim()
        .replace(/^["“]/, "")
        .replace(/["”]$/, "")

        // Join words split across lines by PDF hyphenation:
        // "weap-\non" becomes "weapon".
        .replace(/([A-Za-z])-\s*\n\s*([a-z])/g, "$1$2")

        // Change square brackets into round brackets.
        .replace(/\[/g, "(")
        .replace(/\]/g, ")")

        // Remove remaining line wrapping.
        .replace(/[ \t]*\n[ \t]*/g, " ")

        // Clean repeated whitespace.
        .replace(/[ \t]{2,}/g, " ")
        .trim();

    /*
     * The first portion before the descriptive text is treated as the name.
     * This assumes the first line of the original clipboard text was the name.
     */
    const originalFirstLine = input
        .replace(/\r\n?/g, "\n")
        .trim()
        .replace(/^["“]/, "")
        .split("\n")[0]
        .trim();

    const monsterName = originalFirstLine.replace(/["”]$/, "");

    if (monsterName && text.startsWith(monsterName)) {
        text = `**${monsterName}**\n${text.slice(monsterName.length).trimStart()}`;
    }

    // Convert THAC0 18 (+1) into THAC0 +1.
    // Also handles negative attack bonuses such as THAC0 20 (-1).
    text = text.replace(
        /\bTHAC0\s+\d+\s+\(([+-]\d+)\)/gi,
        "THAC0 $1"
    );

    // Add line breaks at the desired points.
    text = text
        .replace(/\s+(AC\s+\d)/i, "\n$1")
        .replace(/,\s*(MV\s+)/i, ",\n$1")
        .replace(/,\s*(ML\s+)/i, ",\n$1")
        .replace(/\s+(▶\s*)/g, "\n$1");

    // Remove accidental spaces before punctuation.
    text = text
        .replace(/\s+,/g, ",")
        .replace(/\s+\./g, ".")
        .trim();

    return text;
}