const multer = require('multer');
const File = require('../models/filemodel');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const stream = require('stream');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const KEYFILEPATH = path.join(__dirname, '../middleware/cred.json');

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

// Set the current date format
const date = moment().format('MM-DD-YYYY-h.mm');

// Multer setup for local file storage (you can modify if you want only Google Drive uploads)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Local uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, `${date}+${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Upload a file (single file with 'file' field)
exports.uploadFile = upload.single('file');

// Upload and save file to Google Drive and DB
exports.savefile = async (req, res) => {
    try {
        const { visibility } = req.body;
        const { name } = req.body || null;
        const file = req.file;
        const userId = req.userId;

        if (!visibility) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }


        const uploadFile = async (fileObject) => {
            const bufferStream = new stream.PassThrough();
            bufferStream.end(fileObject.path);
            console.log('uploading...');
            const { data } = await google.drive({ version: "v3", auth }).files.create({
              media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path),
              },
              requestBody: {
                name: `${date}+${file.originalname}`,
                parents: ['1zvE2zXJit9BQoE1tnBcrHLueuY5Ptbh4'],
              },
              fields: "id,name,webViewLink,webContentLink",
            });
            console.log(`Uploaded file ${data.name} ${data.id}`);
            return {
              driveLink: `https://drive.google.com/file/d/${data.id}/view?usp=sharing`,
            };
          };

          const response = await uploadFile(file);
          console.log(response);

        // Get Drive file ID and links for future reference
        const driveFileId = response.id;
        const driveWebViewLink = response.driveLink;
        const driveWebContentLink = response.webContentLink;

        // Save file details to MongoDB
        const fileDetails = new File({
            user: userId,
            filename: name || file.originalname,
            googleDriveFileId: driveFileId,  // Save the Google Drive File ID
            drivelink: driveWebViewLink, // Viewable link
            googleDriveWebContentLink: driveWebContentLink, // Downloadable link
            size: file.size,
            visibility,
            type: file.mimetype,
            // Store a flag or remove local path as it's now in Google Drive
            path: file.path, // optional; remove this if storing only in Drive
        });

        const savedFile = await fileDetails.save();

        res.status(201).json({
            message: 'File uploaded successfully to Google Drive',
            savedFile,
            googleDriveLinks: {
                webView: driveWebViewLink,
                download: driveWebContentLink
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a file (from DB and Google Drive)
exports.deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Find the file in the database
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Check if the user is authorized to delete the file
        if (file.user.toString() !== userId) {
            return res.status(401).json({ message: 'You are not authorized to delete this file' });
        }

        // Remove the file record from the database
        await file.deleteOne();

        res.status(200).json({ message: 'File deleted successfully from Google Drive' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all files (local + Google Drive info)
exports.getallfiles = async (req, res) => {
    try {
        const userId = req.userId;

        // Fetch files that belong to the user and are private
        const userFiles = await File.find({ user: userId }).populate('user');

        // Fetch files that are public
        const publicFiles = await File.find({ visibility: 'public' }).populate('user');

        // Combine user files and public files, ensuring uniqueness
        const combinedFiles = [...userFiles, ...publicFiles].filter((file, index, self) =>
            index === self.findIndex((f) => f._id.toString() === file._id.toString())
        );

        res.status(200).json(combinedFiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch a specific user's file from Google Drive
exports.getuserfile = async (req, res) => {
    try {
        const userId = req.userId;
        const file = await File.find({ user: userId }).populate("user");

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (file.visibility === 'private' && file.user.toString() !== userId) {
            return res.status(401).json({ message: 'You are not authorized to view this file' });
        }

        res.status(200).json(file);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Download a file from Google Drive
exports.download = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (file.visibility === 'private' && file.user.toString() !== userId) {
            return res.status(401).json({ message: 'You are not authorized to view this file' });
        }

        const auth = await authorize();
        const fileId = file.googleDriveFileId;

        // Generate a download link using Google Drive API
        res.redirect(file.googleDriveWebContentLink); // Redirect to the download link
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View file in browser
exports.viewfile = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (file.visibility === 'private' && file.user.toString() !== userId) {
            return res.status(401).json({ message: 'You are not authorized to view this file' });
        }

        res.redirect(file.googleDriveWebViewLink); // Redirect to the viewable link on Google Drive
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search files
exports.search = async (req, res) => {
    try {
        const { searchTerm } = req.body;
        const userId = req.userId;

        const files = await File.find({
            $and: [
                { user: userId },
                {
                    $or: [
                        { filename: { $regex: searchTerm, $options: 'i' } },
                        { visibility: { $regex: searchTerm, $options: 'i' } }
                    ]
                }
            ]
        });

        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
