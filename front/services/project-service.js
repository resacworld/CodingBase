import authService from "./auth-service"

const axios = require("axios")
const token = authService.getToken()

class ProjectService {
     getUserProjects = () => axios.post("/api/project/user",{token: authService.getToken()}).then(res => res.data) // pour recharger token lors de la connection
     getProject = (data) => axios.post("/api/project/get",{token, data}).then(res => res.data)
     getSection = (data) => axios.post("/api/section/get", {token, data}).then(res => res.data)
     getModule = (data) => axios.post('/api/module/get',{token, data}).then(res => res.data)

     // ces 3 fonctions ne sont pas utilisées
     // delete = (etape) => axios.post("/api/project/delete", {...etape}).then(res => res.data)
     // create = (etape) => axios.post("/api/project/create", {...etape}).then(res => res.data)
     // update = (etape) => axios.post("/api/project/update",{...etape}).then(res => res.data)
}

export default new ProjectService()