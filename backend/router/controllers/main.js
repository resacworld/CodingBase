const express = require('express')
const { SRCFILE } = require('../../params.json')
const router = express.Router()
const path = require('path')

router.route("/")
.all((req, res) => {
    res.sendFile(path.join(__dirname, "/../.." + SRCFILE))
})

router.route("/*")
.all((req, res) => {
    res.redirect('/')
})

// GET  POST   PUT   DELETE ==> types requêtes
// GET CREATE UPDATE DELETE ==> actions
module.exports = router