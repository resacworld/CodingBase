const axios = require("axios")

class UserService {
     login = (data) => axios.post("/api/auth/login", data).then(res => res.data)
}

export default new UserService()