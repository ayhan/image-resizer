const path = require("path");
const fs = require("fs");
const sharp = require('sharp');

const directoryPath = path.join("new");
fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(function (file, idx) {
    console.log('%cresize.js line:12 file', 'color: #007acc;', file);
    // sharp(`new/${file}`).resize(1920).toFile(`new/Edirne-ferforje-metal-${idx}.jpg`)
  });
});
