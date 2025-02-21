const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./config/database");

const {
  createFolder,
  updateFolder,
  deleteFolder,
  getAllFolders,
} = require("./controllers/folderController");

const {
  updateFileDescription,
  deleteFile,
  getFiles,
  sortFile,
  getFilesByType,
  getFileMetadata,
} = require("./controllers/fileController");

const { fileRouter } = require("./src/router/fileRouter");

app.use(express.json());
app.use(cors());

//Create Folder
//API Endpoint: http://localhost:3000/folder/create
app.post("/folder/create", createFolder);

//Update Folder
//API Endpoint:- http://localhost:3000/folders/:folderId
app.put("/folders/:folderId", updateFolder);

//Delete folder and all its files from cloudinary.
//API Endpoint:- http://localhost:3000/folders/:folderId
app.delete("/folders/:folderId", deleteFolder);

//Upload File to cloudinary via
//API Endpoint:- http://localhost:3000/folders/:folderId/files
app.use("/folders", fileRouter);

//Update File Description
//API Endpoint:- http://localhost:3000/folders/:folderId/files/:fileId
app.put("/folders/:folderId/files/:fileId", updateFileDescription);

//Delete File
//API Endpoint:- http://localhost:3000/folders/:folderId/files/:fileId
app.delete("/folders/:folderId/files/:fileId", deleteFile);

//Get all folders
//API Endpoint:- http://localhost:3000/folders
app.get("/folders", getAllFolders);

//Get Files in a Folder
//API Endpoint:- http://localhost:3000/folders/:folderId/files
app.get("/folders/:folderId/files", getFiles);

// Sort Files by Size
//API Endpoint:- http://localhost:3000/folders/:folderId/filesBySort?sort=size
//Sort Files by Recency
//API Endpoint:- http://localhost:3000/folders/:folderId/filesBySort?sort=uploadedAt
app.get("/folders/:folderId/filesBySort", sortFile);

//Get Files by Type Across Folders
//API Endpoint:- http://localhost:3000/files?type=pdf
app.get("/files", getFilesByType);

//Get File Metadata
//API Endpoint:- http://localhost:3000/folders/:folderId/files/metadata
app.get("/folders/:folderId/files/metadata", getFileMetadata);

if (process.env.NODE_ENV !== "test") {
  sequelize
    .authenticate()
    .then(() => console.log("Database connection successfully established."))
    .catch((error) => console.log("Unable to connect to the database:", error));
}

module.exports = app;
