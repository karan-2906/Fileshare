const multer = require('multer')
const File = require('../models/filemodel')
const moment = require('moment');
const fs = require('fs');
const path = require('path');


const date = moment().format('MM-DD-YYYY-h.mm')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${date}+${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Upload a file
exports.uploadFile = upload.single('file')

exports.savefile = async (req, res) => {
    try {
        const { visibility } = req.body
        const { name } = req.body || null
        const { file } = req;
        const userId = req.userId;

        if (!visibility) {
            return res.status(400).json({ message: 'Please enter all fields' })
        }

        const filedetails = new File({
            user: userId,
            filename: name || file.originalname,
            path: file.path,
            size: file.size,
            visibility,
            type: file.mimetype
        })

        const savedFile = await filedetails.save()

        res.status(201).json({ message: 'File uploaded successfully', savedFile })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


//delete a file 
exports.deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Find the file in the database
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });

        }
        console.log(file.filename)

        // Check if the user is authorized to delete the file
        if (file.user.toString() !== userId) {
            return res.status(401).json({ message: 'You are not authorized to delete this file' });
        }

        const filePath = path.join(__dirname, '../', file.path);

        // Delete the file from the file system
        fs.unlink(filePath, async (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return res.status(404).json({ message: 'File not found on the server' });
                }
                console.error(`Error deleting the file from the file system: ${err.message}`);
                return res.status(500).json({ message: 'Error deleting the file from the file system', err });
            }

            // Remove the file record from the database
            await file.deleteOne();

            res.status(200).json({ message: 'File deleted successfully' });
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getallfiles = async (req, res) => {

    try {
        const userId = req.userId;

        // Fetch files that belong to the user and are private
        const userFiles = await File.find({ user: userId }).populate(
            'user',
        )

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

}

exports.getuserfile = async (req, res) => {
    try {
        const userId = req.userId;

        const file = await File.find({
            user: userId
        }).populate("user");
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

}

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

        const filePath = path.join(__dirname, '../', file.path);
        res.download(filePath, file.filename);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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

        const filePath = path.join(__dirname, '../', file.path);
        const fileStream = fs.createReadStream(filePath);
        console.log(file.type)

        res.setHeader('Content-Type', file.type);
        res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);

        fileStream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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
}