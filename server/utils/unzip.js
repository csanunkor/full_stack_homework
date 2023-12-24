const decompress = require("decompress");

const unzipFiles = () => {
  decompress("files.zip", "../client/public/")
    .then(() => {
      console.log("Files Unzipped Successfully");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = unzipFiles;
