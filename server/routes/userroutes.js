const express = require('express');
const router = express.Router();
const { registerUser, loginUser, hello, userInfo } = require('../controller/usercontroller');
const auth = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/hello', hello);
router.get('/userinfo', auth, userInfo)

module.exports = router;