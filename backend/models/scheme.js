const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SchemeSchema = Schema(
    {
      name: {type: String, default: ""},
    },
    { strict: true }
  )

module.exports = mongoose.model('scheme', SchemeSchema)
