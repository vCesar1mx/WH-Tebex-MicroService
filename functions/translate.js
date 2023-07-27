const fs = require('fs');
const translate = require('translate-google');
const colors = require('colors');

async function translateJSON(json, targetLanguage) {
  const translatedJSON = {};
  for (let key in json) {
    if (typeof json[key] === 'object') {
      translatedJSON[key] = await translateJSON(json[key], targetLanguage);
    } else {
      const translation = await translate(json[key], { to: targetLanguage });
      translatedJSON[key] = translation;
    }
  }
  return translatedJSON;
}

module.exports.autoTranslate = async function(jsonFile, targetLanguage) {
  try {
    const jsonContent = await fs.promises.readFile('./langs/spanish.json', 'utf8');
    const originalJSON = JSON.parse(jsonContent);
    const translatedJSON = await translateJSON(originalJSON, targetLanguage);
    const outputFile = `./langs/${targetLanguage}.json`;

    await fs.promises.writeFile(outputFile, JSON.stringify(translatedJSON, null, 2));

    console.log('Language translated with success:', outputFile);
    console.log(`${colors.yellow("Please, restart the bot to apply the changes.")}`);
    process.exit();
  } catch (error) {
    console.error('Error:', error);
  }
};
