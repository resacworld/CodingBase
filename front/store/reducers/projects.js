export default ( state, action ) => {
    switch (action.type) {
        case "initialisation":
            return {
                ...state,
                projects: action.projects
            }
        case "ADD": 
            const projects = JSON.parse(JSON.stringify(state.projects))
            projects.push({
                ...action.project,
                deployed: true
            })
            return {
                ...state,
                projects: projects
            }
        case "DELETE":
            var project2 = JSON.parse(JSON.stringify(state.projects))
            console.log(action.project, project2)
            project2 = project2.filter(project => project._id !== action.project._id ? true: false)
            return {
                ...state,
                projects: project2
            }
        default: 
            return state
    }
}