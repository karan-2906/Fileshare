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
    search,
    getuserfile
} = require('../controller/filecontroller')



router.post('/upload', auth, uploadFile, savefile)
router.delete('/delete/:id', auth, deleteFile)
router.get('/getallfiles', auth, getallfiles)
router.get('/getuserfiles/', auth, getuserfile)
router.get('/view/:id', auth, viewfile)
router.get('/download/:id', auth, download)
router.get('/search', auth, search)


module.exports = router;