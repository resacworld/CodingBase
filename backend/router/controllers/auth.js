// const   passport =  require('passport'),
const express = require('express');
const jwt = require('jsonwebtoken');
const DBController = require('../../services/DBControllers/Index')
const bcrypt = require('bcrypt');

// const UserModel = require(__dirname+'../../../models/user');
const router = express.Router();

const createToken = (user, local) => {
    return jwt.sign({id: user._id, local}, process.env.JWT_KEY, { expiresIn: '2h' })
}

router.post('/auth/login', async (req, res) => {
    try {
        const user = await DBController.getUser({username: req.body.username})
        if (!user){
            return res.json({
                status: false,
                message: "No username found"
            })
        } else if (!bcrypt.compareSync(req.body.password, user.password)){
            return res.json({
                status: false,
                message: "Wrong password"
            })
        }
        const token = createToken(user, true)
        res.json({
            status: true,
            token,
            user: await DBController.getUserProjects({username: req.body.username})
        })
    } catch(err){
        res.json({
            status: false,
            message: "Login Failed"
        })
    }
});

// router.post('/auth/test', async (req, res) => { // ONLY FOR DEV
//     try {
//         const decoded = jwt.decode(req.body.token)
//         const user = await DBController.getUser({ _id: decoded.id})
//         if(decoded){
//             res.json({
//                 message: "valid token",
//                 ...user,
//             });
//         } else {
//             res.json({
//                 message: "invalid token"
//             });
//         }
//     } catch (err){
//         res.json({
//             status: false,
//             message: "Error when running test"
//         })
//     }
// });

router.route('/auth/logout') 
.get((req, res) => { //Passport logout
    req.logout();
    res.redirect('/');
});

module.exports = router;


// const   passport =  require('passport'),
//         express =   require('express'),
//         jwt =       require('jsonwebtoken');
// const { route } = require('./security');

// // const UserModel = require(__dirname+'../../../models/user');
// const router = express.Router();

// const createToken = (user, local) => {
//     return jwt.sign({id: user._id,local}, process.env.JWT_KEY, { expiresIn: '6h' })
// }

// router.post('/auth/login', function (req, res, next) {
//     passport.authenticate('local',{session: false}, (err, user, info) => {
//         console.log('here !!!!!!!!!!!!!')
//         if (err || !user) {
//             return res.status(200).json({
//                 status: false,
//                 message: info ? info.message : 'Login failed',
//                 user   : user,
//                 code: 'NOTFOUND',
//             });
//         }

//         req.login(user, (err) => {
//             if (err) {
//                 res.send(err);
//             }
//             return res.json({
//                 status: true,
//                 token: createToken(user,true),
//             });
//         });
//     })(req, res, next);
// });

// router.route('/auth/logout') 
// .get((req, res) => { //Passport logout
//     req.logout();
//     res.redirect('/');
// });

// module.exports = router;