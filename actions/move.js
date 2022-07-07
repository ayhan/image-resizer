var fs = require('fs');
var path = require('path');
var process = require("process");

var moveFrom = "old";
var moveTo = "new"

fs.readdir(moveFrom, function (err, files) {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  files.forEach(function (file, index) {
    var fromPath = path.join(moveFrom, file);
    var toPath = path.join(moveTo, file);

    fs.stat(fromPath, function (error, stat) {
      if (error) {
        console.error("Error stating file.", error);
        return;
      }

      if (stat.isFile())
        console.log("'%s' is a file.", fromPath);
      else if (stat.isDirectory())
        console.log("'%s' is a directory.", fromPath);

      fs.rename(fromPath, `${moveTo}/new-name-${index}.jpg`, function (error) {
        if (error) {
          console.error("File moving error.", error);
        } else {
          console.log("Moved file '%s' to '%s'.", fromPath, toPath);
        }
      });

    });
  });
});