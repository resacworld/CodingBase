require('dotenv').config()

const db = require("./services/db").dbConnect()

const fs = require('fs');
const path = require('path');
const BodyParser = require('body-parser')

const express = require('express');
const app = express();
const ServerSocket = require('./wss/index')
const http = require("http")
const https = require('https')
const { httpsserver, port } = require('./params.json')

const DBController = require('./services/DBControllers/Index')

/* Middlewares */
app.use("/",express.static(SRCFOLDER))
app.use(BodyParser.urlencoded({ extended : false}))
app.use(BodyParser.json())

// rest communications
const index = require('./router/index')
app.use(index)

class Server {
  constructor() {
    if(!httpsserver){
      this.http = http.createServer(app)
      this.wss = new ServerSocket(this.http).listenToEvents()
    } else {
        this.https = https.createServer({
        key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
      }, app)
      this.wss = new ServerSocket(this.https).listenToEvents()
    }
  }

  listen() {
    if(!httpsserver){
      this.http.listen(port)
    } else {
      this.https.listen(port)
    }
    console.log('Magic happens on port ' + port);
  }
}
  
new Server().listen()