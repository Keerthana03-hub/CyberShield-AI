const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const pdfFiles = [
  "GUIDE.pdf",
  "Best_Practices_9005e915fa.pdf",
  "I Can Do_RBI-compressed.pdf",
];

async function getKnowledgeBase() {
  let combinedText = "";

  for (const file of pdfFiles) {
    try {
      const filePath = path.join(__dirname, "../knowledge", file);

      const dataBuffer = fs.readFileSync(filePath);

      const pdfData = await pdfParse(dataBuffer);

      combinedText += "\n\n" + pdfData.text;

    } catch (err) {
      console.log(`Could not read ${file}`);
    }
  }

  return combinedText;
}

module.exports = {
  getKnowledgeBase,
};