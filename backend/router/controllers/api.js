const express = require('express')
const router = express.Router()
const DBSecurity = require('../../services/DBSecurity')
const DBController = require('../../services/DBControllers/Index')
const { API: { REST } } = require('../../params.json')

for(var Mname in REST){
    const elt = REST[Mname]

    for (let i = 0; i < elt.length; i++) {
        const actiontype = elt[i];

        try {
            if(Mname == "Project"){
                router.route(`/${Mname.toLowerCase()}/${actiontype}`)
                .post(async (req, res) => {
                    let {token, data} = req.body
                    try{
                        const result = await DBSecurity.verifyProjectappartenance(token, data, actiontype.toUpperCase())
                        res.json({ status: true, result })
                    } catch (error) {
                        console.log('error : ', error)
                        res.json({ status: false, error })
                    }
                })
            } else if(Mname == "Section"){
                router.route(`/${Mname.toLowerCase()}/${actiontype}`)
                .post(async (req, res) => {
                    let {token, data} = req.body
                    try{
                        const result = await DBSecurity.verifySectionappartenance(token, data, actiontype.toUpperCase())
                        res.json({ status: true, result })
                    } catch (error) {
                        console.log('error : ', error)
                        res.json({ status: false, error })
                    }
                })
            } else if(Mname == "Module"){
                router.route(`/${Mname.toLowerCase()}/${actiontype}`)
                .post(async (req, res) => {
                    let {token, data} = req.body
                    try{
                        const result = await DBSecurity.verifyModuleappartenance(token, data, actiontype.toUpperCase())
                        res.json({ status: true, result })
                    } catch (error) {
                        console.log('error : ', error)
                        res.json({ status: false, error })
                    }
                })
            }
        } catch(e){
            console.log(e)
        }
    } 
}

router.route('/project/user')
.post(async(req, res) => {
    try {
        const {id} = await DBSecurity.decryptToken(req.body.token)
        const result = await DBController.getUserProjects({_id: id})
        res.json({status: true, result})
    } catch(error){
        res.json({status: false, error})
    }
})

module.exports = router


// var fs = require("fs");

// router.route('/')
// .get(async(req,res) => {
//     try{
//         // res.json({status: true})
//         console.log('ff')
//         // fs.readFile(__dirname,'./index.html','utf8', function(err, text){
//         //     console.log(text)
//         // })
//         // res.send(fs.readFile('./index.html'))
//         res.sendFile('../../../frontend/build/index.html', {root: __dirname })
//     } catch(error){
//         res.json({status:false, error})
//     }
// })
