const multer = require("multer");
const express = require("express");
const { UNEXPECTED_FILE_TYPE } = require("../constants/file");
const { upload } = require("../middleware/fileUpload");
const { uploadFiles } = require("../../controllers/fileController");

const fileRouter = express.Router();

fileRouter.post(
  "/:folderId/files",
  function (req, res, next) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === UNEXPECTED_FILE_TYPE.code) {
          return res.status(400).json({ error: { description: err.field } });
        }
      } else if (err) {
        return res.status(400).json({ error: { description: err.message } });
      }
      next();
    });
  },
  uploadFiles
);

module.exports = { fileRouter };
