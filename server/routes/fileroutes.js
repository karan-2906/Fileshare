const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    uploadFile,
    savefile,
    deleteFile,
    getallfiles,
    viewfile,
    download,
    search
} = require('../controller/filecontroller')



router.post('/upload', auth, uploadFile, savefile)
router.delete('/delete/:id', auth, deleteFile)
router.get('/allfiles', auth, getallfiles)
router.get('/view/:id', auth, viewfile)
router.get('/download/:id', auth, download)
router.get('/search', auth, search)


module.exports = router;