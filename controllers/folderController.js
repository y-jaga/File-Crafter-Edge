const Folder = require("../models/Folder");
const File = require("../models/File");
const { deleteFileFromCloudinary } = require("../src/config/cloudinary");
const {
  createFolderValidation,
  updateFolderValidation,
} = require("../validations/index");

const createFolder = async (req, res) => {
  try {
    const { name, type, maxFileLimit } = req.body;

    const errors = await createFolderValidation({ name, type, maxFileLimit });

    if (errors.length > 0) {
      return res.status(400).json({ error: errors });
    }

    const newFolder = await Folder.create({ name, type, maxFileLimit });

    return res.status(201).json({
      message: "Folder created successfully",
      folder: newFolder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create folders." });
  }
};

const updateFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const { name, type, maxFileLimit } = req.body;

    const errors = await updateFolderValidation(folderId, {
      type,
      maxFileLimit,
    });

    if (errors.length > 0) {
      return res.status(400).json({ error: errors });
    }

    const [updateCount, updatedRow] = await Folder.update(
      { name, type, maxFileLimit },
      { where: { folderId }, returning: true }
    );

    if (updateCount === 0) {
      return res.status(400).json({ error: "No rows has been updated" });
    }

    res
      .status(201)
      .json({ message: "Folder updated successfully", folder: updatedRow });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update folders." });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;

    if (!folderId) {
      return res.status(400).json({ error: "folderID not provided." });
    }

    const folder = await Folder.findByPk(folderId);

    if (!folder) {
      return res.status(400).json({ error: "Folder does not exists." });
    }

    //deletes files from cloudinary
    await deleteFileFromCloudinary(folderId);

    const deletedFileCount = await File.destroy({
      where: { folderId },
    });

    const deletedFolderCount = await Folder.destroy({
      where: { folderId },
    });

    if (deletedFileCount === 0) {
      console.log("No file exists for folder.");
    }

    if (deletedFolderCount === 0) {
      console.log("Folder not deleted.");
    }

    res.status(200).json({ message: "Folder deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete folders." });
  }
};

const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.findAll();

    if (folders.length === 0) {
      return res.status(400).json({ error: "No folder exists." });
    }

    res.status(200).json(folders);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch all folders." });
  }
};

module.exports = { createFolder, updateFolder, deleteFolder, getAllFolders };
