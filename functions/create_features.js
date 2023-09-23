module.exports.createFeatures = async function () {
  const fs = require("fs");
  const colors = require('colors');

  const jsonData = fs.readFileSync("config.json", "utf8");
  const data = JSON.parse(jsonData);
  data.embed.useMCskin = true;
  const updatedJsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync("config.json", updatedJsonData, "utf8");
console.log(colors.yellow("New features added. Please visit https://github.com/vCesar1mx/WH-Tebex-MicroService/ for more information"));
};
