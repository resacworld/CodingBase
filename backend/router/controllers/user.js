const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Users = require('../../models/users');
// const errors = require('../../../services/utils');
// const emailService = require('../../../services/mail')
const host = "http://localhost:8080"
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.route('/user')
  .post(async (req, res) => { // Add user
    let user = new Users(req.body);
    if (user.password) {
      user.password = bcrypt.hashSync(user.password, 10)
    }

    //Check model
    user.save()
      .then(async response => {
        console.log(response)
        
        res.json({
          status: true,
          result: response
        });
      })
      .catch(error => res.json({
          status: false,
          result: error
      }));
  })
module.exports = router;