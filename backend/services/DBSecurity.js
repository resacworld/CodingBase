const jwt = require('jsonwebtoken')
const Typeof = require('object-types');
const DBController = require('./DBControllers/Index')

class DBSecurity {
    getUser = async (token) => {
        const decrypt = jwt.decode(token)
        const user = await DBController.getUser({_id: decrypt.id})
        return user
    }
    decryptToken = (token) => {
        return jwt.decode(token)
    }
    checkRequest = (data, filter, strict=false) => {
        if(data==={}) return "Empty request"

        let datalength = 0
        let filterlength = 0
        for(const key in data) datalength+=1
        for(const key in filter) filterlength+=1

        if(strict && datalength != filterlength) return `Strict mode : ${datalength} instead of ${filterlength}`
        if(datalength > filterlength) return `Too many values : ${datalength} instead of ${filterlength} max`

        for(const key in data){
            if(!filter[key] && filter[key] === undefined) return `Unknown Value : ${key}`
        }
        
        for(const key in filter){
            let required = false;
            let filtertype = filter[key];
            if(typeof(filter[key]) === "object"){
                filtertype = filter[key].type
                if(filter[key].required) required=true
            } 

            let datatype = typeof(data[key])
            datatype = datatype==="object"?Typeof(data[key]):datatype

            if(datatype === "undefined"){
                if(required) return `Value required : ${data[key]}`
            } else if(datatype !== filtertype){
                return `Unknown type : ${datatype}`
            }
        }
        return true
    }
}

module.exports = new DBSecurity()