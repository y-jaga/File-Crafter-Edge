const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { UNEXPECTED_FILE_TYPE } = require("../constants/file.js");
const {
  fileFolderTypeValidator,
} = require("../utils/fileFolderTypeValidator.js");
const Folder = require("../../models/Folder.js");

//process.cwd() ensures the path of uploads folder is from project root
const uploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) {
  // Creates directory if not present
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: async (req, file, cb) => {
    const folderId = req.params.folderId;

    // Check if folderId does not exists
    if (!folderId) {
      return cb(new Error("Folder ID not provided."));
    }

    const folder = await Folder.findByPk(folderId);

    // Check if folder does not exists
    if (!folder) {
      return cb(new Error("Folder does not exist."));
    }

    const isFileTypeAllowed = fileFolderTypeValidator(file, folder);
    if (isFileTypeAllowed) {
      return cb(null, true);
    } else {
      cb(
        new multer.MulterError(
          UNEXPECTED_FILE_TYPE.code,
          UNEXPECTED_FILE_TYPE.message
        )
      );
    }
  },
}).array("file", 1);

module.exports = { upload };
