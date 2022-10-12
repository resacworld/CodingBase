const express = require('express')
const router = express.Router()

router.use("/api", require('./controllers/api.js'))
router.use("/api", require('./controllers/auth.js'))
router.use("/api", require('./controllers/user.js'))
router.use("/", require('./controllers/main.js')) // doit être en bas a cause du redirect "/*"

module.exports = router