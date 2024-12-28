const path = require("path");

const fileFolderTypeValidator = (file, folder) => {
  const validTypes = {
    csv: "csv",
    img: ["jpeg", "jpg", "png", "gif"],
    pdf: "pdf",
    //mimetype of .ppt and .pptx files
    ppt: [
      "vnd.ms-powerpoint",
      "vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
  };
  const fileType = file.mimetype.split("/")[1];
  const folderType = folder.type;

  if (
    Array.isArray(validTypes[folderType]) &&
    !validTypes[folderType].includes(fileType)
  ) {
    return false;
  }
  if (
    !Array.isArray(validTypes[folderType]) &&
    validTypes[folderType] !== fileType
  ) {
    return false;
  }
  return true;
};

module.exports = { fileFolderTypeValidator };
