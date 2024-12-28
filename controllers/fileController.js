const fs = require("fs");
const Folder = require("../models/Folder");
const File = require("../models/File");
const { uploadToCloudinary } = require("../src/config/cloudinary");
const { Op } = require("sequelize");

const uploadFiles = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const { description } = req.body;
    const file = req.files[0];
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    const folder = await Folder.findByPk(folderId);

    // Check if file exists
    if (!req.files) {
      return res
        .status(400)
        .json({ error: "File not present in the request body." });
    }

    //if uploaded files array is empty
    if (Array.isArray(req.files) && req.files.length === 0) {
      return res.status(400).json({
        error: { description: "No files uploaded." },
      });
    }

    // Check if folder has reached max file limit
    const fileCount = await File.count({ where: { folderId } });
    if (fileCount >= folder.maxFileLimit) {
      return res
        .status(400)
        .json({ error: "Folder has reached its max file limit." });
    }

    if (file.size > MAX_FILE_SIZE) {
      return res
        .status(400)
        .json({ error: "File is too large. Max size is 10MB." });
    }

    //upload file to cloudinary.
    console.log("mimetype of file", file.mimetype);
    const cloudinaryResponse = await uploadToCloudinary(
      file.path,
      folderId,
      file.mimetype
    );

    // Create a new file record in the database
    const createdFile = await File.create({
      folderId,
      name: file.originalname,
      description: description || null,
      type: file.mimetype,
      size: file.size,
    });

    console.log("File path to delete:", file.path);

    //fs.unlink removes file from file.path(i.e uploads folder) after uploading them on cloudinary folder.
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(err);
      }
    });

    res.status(200).json({
      message: "File uploaded successfully.",
      file: {
        fileId: createdFile.fileId,
        uploadedAt: createdFile.uploadedAt,
        name: createdFile.name,
        type: createdFile.type,
        size: createdFile.size,
        folderId: createdFile.folderId,
        description: createdFile.description,
        secure_url: cloudinaryResponse.secure_url,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateFileDescription = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const fileId = req.params.fileId;
    const newDescription = req.body.description;

    //fetch the file to update
    const file = await File.findOne({
      where: { fileId },
    });

    if (file.folderId !== folderId) {
      return res
        .status(400)
        .json({ error: "File doesn't exists in the specified folder." });
    }

    //update the file decription
    file.description = newDescription;

    //save the changes in the database.
    await file.save();

    res.status(201).json({
      message: "File description updated successfully",
      files: { fileId, description: newDescription },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to update file description." });
  }
};

const deleteFile = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const fileId = req.params.fileId;

    //fetch the file to be deleted.
    const file = await File.findByPk(fileId);

    if (!file) {
      return res.status(400).json({ error: "File not found." });
    }

    if (file.folderId !== folderId) {
      return res
        .status(400)
        .json({ error: "File doesn't exists in the specified folder." });
    }

    //deletes file from database
    await file.destroy();

    res.status(200).json({ message: "File successfully deleted." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete file." });
  }
};

const getFiles = async (req, res) => {
  try {
    const folderId = req.params.folderId;

    const folder = await Folder.findByPk(folderId);

    if (!folder) {
      return res.status(400).json({ error: "Folder does not exists." });
    }

    const files = await File.findAll({
      where: { folderId },
    });

    if (files.length === 0) {
      return res
        .status(400)
        .json({ error: "No files found for specifed folder." });
    }

    res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch all files." });
  }
};

const sortFile = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const sort = req.query.sort;

    if (sort !== "size" && sort !== "uploadedAt") {
      return res
        .status(400)
        .json({ error: "Invalid sort parameter, use 'size' or 'uploadedAt' " });
    }

    const folder = await Folder.findByPk(folderId);
    if (!folder) {
      return res.status(400).json({ error: "Folder doesn't exists" });
    }

    const files = await File.findAll({
      where: { folderId },
      order: [[`${sort}`, "ASC"]],
    });

    if (files.length === 0) {
      return res.status(400).json({ error: "No files found in the folder." });
    }

    res.status(200).json({ files });
  } catch (error) {
    return res.status(500).json({ error: "Failed to sort files by size." });
  }
};

const getFilesByType = async (req, res) => {
  try {
    const type = req.query.type;
    let searchType;
    let secondsearchType;

    if (type === "pdf") {
      searchType = "application/pdf";
    } else if (type === "csv") {
      searchType = "text/csv";
    } else if (type === "ppt") {
      searchType = "application/vnd.ms-powerpoint";
      secondsearchType =
        "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    } else if (["jpeg", "jpg", "gif", "png"].includes(type)) {
      searchType = `image/${type}`;
    }

    const files = [];
    const allFiles = await File.findAll();

    for (const file of allFiles) {
      if (file.type === searchType) {
        files.push(file);
      }
      if (secondsearchType && file.type === secondsearchType) {
        files.push(file);
      }
    }

    if (files.length === 0) {
      return res.status(400).json({ error: `No files found for type ${type}` });
    }

    res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get files by type." });
  }
};

const getFileMetadata = async (req, res) => {
  try {
    const folderId = req.params.folderId;

    const folder = await Folder.findByPk(folderId);

    if (!folder) {
      return res.status(400).json({ error: "Folder doesn't exists" });
    }

    const allFiles = await File.findAll({
      where: { folderId },
    });

    if (allFiles.length === 0) {
      return res.status(400).json({ error: "Folder is empty" });
    }

    const files = [];

    for (const file of allFiles) {
      files.push({
        fileId: file.fileId,
        name: file.name,
        size: file.size,
        description: file.description,
      });
    }

    res.status(200).json({ files });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch file metadata." });
  }
};

module.exports = {
  uploadFiles,
  updateFileDescription,
  deleteFile,
  getFiles,
  sortFile,
  getFilesByType,
  getFileMetadata,
};
