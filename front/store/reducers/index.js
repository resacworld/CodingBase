import projects from './projects'
import project from './project'
import sections from './sections'
import modules from './modules'

export default ( state, action ) => {
    switch (action.supertype){
        case "PROJECTS":
            return projects(state, action)
        case "PROJECT":
            return project(state, action)
        case "SECTIONS":
            return sections(state, action)
        case "MODULE":
            return modules(state, action)
    }
    switch (action.type){
        case 'SETAUTH':
            return {
                ...state,
                auth: action.value
            }
        default :
            return state
    }
}