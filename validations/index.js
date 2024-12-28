const Folder = require("../models/Folder");

const createFolderValidation = async (data) => {
  const { name, type, maxFileLimit } = data;
  const errors = [];

  const folder = await Folder.findOne({
    where: { name },
  });

  if (folder) {
    errors.push("folder name must be unique.");
  } else if (!["csv", "img", "pdf", "ppt"].includes(type)) {
    errors.push("Invalid Type: must be one of ['csv', 'img', 'pdf', 'ppt']");
  } else if (typeof maxFileLimit !== "number" || maxFileLimit < 0) {
    errors.push("maxFileLimit must be a positive integer");
  }

  return errors;
};

const updateFolderValidation = async (folderId, data) => {
  const errors = [];
  const { type, maxFileLimit } = data;

  if (!folderId) {
    errors.push("Folder ID is missing.");
    return errors;
  }

  const folder = await Folder.findOne({
    where: { folderId },
  });

  if (!folder) {
    errors.push("Invalid folder ID");
  } else if (!["csv", "img", "pdf", "ppt"].includes(type)) {
    errors.push("Invalid Type: must be one of ['csv', 'img', 'pdf', 'ppt']");
  } else if (typeof maxFileLimit !== "number" || maxFileLimit < 0) {
    errors.push("maxFileLimit must be a positive integer");
  }

  return errors;
};

module.exports = { createFolderValidation, updateFolderValidation };
