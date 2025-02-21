# 📂 FileCrafter - API-based Document Management System

# 🚀 Project Overview

File-Crafter-Edge is a powerful and scalable API-based Document Management System that allows users to:

- 📁 Create folders with restrictions (file type, max file limit)

- 📤 Upload files with metadata to Cloudinary

- 🔄 Manage files and folders (delete, update, and read operations)

- 🔍 Sort files by size or upload date

- 📄 Retrieve files by type across folders

- 🏷 Fetch file metadata for better insights

# 🛠 Tech Stack:

- 🟢 Node.js & Express.js – Backend framework

- ☁️ Cloudinary – File storage

- 📦 Multer – Middleware for file uploads

- 🗄 Sequelize – ORM for PostgreSQL

- 🛢 Supabase PostgreSQL – Database

# 🔗 API Endpoints

📂 Folder Management

- ➕ Create a Folder

Endpoint: POST /folder/create

Description: Creates a new folder with optional restrictions.

---

- ✏️ Update a Folder

Endpoint: PUT /folders/:folderId

Description: Updates folder metadata.

---

- 🗑 Delete a Folder

Endpoint: DELETE /folders/:folderId

Description: Deletes a folder and all its files from Cloudinary.

---

- 📜 Get All Folders

Endpoint: GET /folders

Description: Fetches a list of all folders.

# 📄 File Management

- 📤 Upload a File

Endpoint: POST /folders/:folderId/files

Description: Uploads a file to Cloudinary using Multer.

---

- 📝 Update File Description

Endpoint: PUT /folders/:folderId/files/:fileId

Description: Updates the description of a file.

---

- 🗑 Delete a File

Endpoint: DELETE /folders/:folderId/files/:fileId

Description: Deletes a file from Cloudinary.

---

- 📂 Get Files in a Folder

Endpoint: GET /folders/:folderId/files

Description: Retrieves all files within a specific folder.

---

- 🔄 Sort Files in a Folder

Endpoint: GET /folders/:folderId/filesBySort?sort=size or sort=uploadedAt

Description: Sorts files by size or recency.

---

- 🔍 Get Files by Type Across Folders

Endpoint: GET /files?type=pdf

Description: Fetches files of a specific type from all folders.

---

- 🏷 Get File Metadata

Endpoint: GET /folders/:folderId/files/metadata

Description: Retrieves metadata of files within a folder.

---

# ⚙️ Installation & Setup

- 📥 Clone the Repository

git clone https://github.com/y-jaga/File-Crafter-Edge.git  
cd File-Crafter-Edge

- 📦 Install Dependencies

npm install

- 🛠 Set Up Environment Variables
  Create a .env file and add:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

DATABASE_URL=your_supabase_postgresql_url  
DATABASE_HOST = your_supabase_postgresql_host  
DATABASE_USER = your_supabase_postgresql_user  
DATABASE_NAME = postgres  
DATABASE_PASSWORD = your_supabase_postgresql_password

- ▶️ Run the Server

npm start
