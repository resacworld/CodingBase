/* importation du socket */
const socketIo = require('socket.io')
const DBSecurity = require('../services/DBSecurity')
const { API: { WSS } } = require('../params.json')

class ServerSocket {
     constructor(https) {
         this.io = socketIo(https)
     }
     listenToEvents() {
        this.io.on('connection', (socket) => {

            for(var Mname in WSS){
                const elt = WSS[Mname]

                for (let i = 0; i < elt.length; i++) {
                    const actiontype = elt[i];
                    const name = actiontype + Mname

                    if(Mname == "Project"){
                        const ProjectFunc = async ({token, data}) => {
                            console.log('ProjectFunc : '+ JSON.stringify(data) + ' : ' + actiontype)
                            let result = { status: true };
                            try{
                                result.result = await DBSecurity.verifyProjectappartenance(token, data, actiontype.toUpperCase())
                            } catch (error) {
                                console.log('error : ', error)
                                result = { status: false, error }
                            }
                            this.io.emit(name, result)
                        }
                        socket.on(name, ProjectFunc)
                    } else if(Mname == "Section"){
                        const SectionFunc = async ({token, data}) => {
                            console.log('SectionFunc : '+ JSON.stringify(data) + ' : ' + actiontype)
                            let result = { status: true };
                            try{
                                result.result = await DBSecurity.verifySectionappartenance(token, data, actiontype.toUpperCase())
                            } catch (error) {
                                console.log('error : ', error)
                                result = { status: false, error }
                            }
                            this.io.emit(name, result)
                        }
                        socket.on(name, SectionFunc)
                    } else if(Mname == "Module"){
                        const ModuleFunc = async ({token, data}) => {
                            console.log('ModuleFunc : '+ JSON.stringify(data) + ' : ' + actiontype)
                            let result = { status: true };
                            try{
                                result.result = await DBSecurity.verifyModuleappartenance(token, data, actiontype.toUpperCase())
                            } catch (error) {
                                console.log('error : ', error)
                                result = { status: false, error }
                            }
                            this.io.emit(name, result)
                        }
                        socket.on(name, ModuleFunc)
                    }
                } 
            }
        })
    }
}

module.exports = ServerSocket