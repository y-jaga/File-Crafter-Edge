require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");

//cloudinary config
const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary configured...");
};

cloudinaryConfig();

// Upload file to Cloudinary
const uploadToCloudinary = async (filePath, folderId, mimetype) => {
  try {
    let resourceType = "raw";

    if (mimetype.startsWith("image/")) {
      resourceType = "image";
    } else if (mimetype.startsWith("video/")) {
      resourceType = "video";
    }
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `folders/${folderId}`,
      resource_type: resourceType,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

//Delete all files from cloudinary
const deleteFileFromCloudinary = async (folderId, maxFileLimit) => {
  try {
    //Fetch all files from folder
    const resources = await cloudinary.api.resources({
      type: "upload",
      prefix: `folders/${folderId}`,
      max_results: maxFileLimit,
    });

    const files = resources.resources;

    if (files.length === 0) {
      console.log("No files found in the folder.");
      return;
    }

    for (const file of files) {
      const publicId = file.public_id;
      const deletedFileResult = await cloudinary.uploader.destroy(publicId);

      if (deletedFileResult.result === "ok") {
        console.log(`Deleted file: ${publicId}`);
      } else {
        console.error(`Failed to delete file: ${publicId}`);
        return;
      }
    }

    console.log(`All files in folder '${folderId}' deleted successfully.`);
  } catch (error) {
    console.error("Error deleting files by folderId:", error);
  }
};

module.exports = { uploadToCloudinary, deleteFileFromCloudinary };
