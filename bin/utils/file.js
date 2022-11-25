const fileSave = require("file-save");

function createFile(url, content) {
  fileSave(url).write(content, "utf8").end("\n");
}

module.exports = createFile;
