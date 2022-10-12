export default ( state, action ) => {
    state = JSON.parse(JSON.stringify(state))
    switch(action.type){
        case 'ADDMODULE':
            state.modules.push(action.module)
            return {
                ...state,
                modules: state.modules
            }
        case 'DELETEMODULE':
            
            var modules = []
            state.modules.forEach(module => {
                if((module != action.module._id) && (module._id != action.module._id)) modules.push(module)
                console.log(module, action.module)
            })
            return {
                ...state,
                modules,
                deployedModuleIndex: 0
            }
        case 'SETMODULEINDEX':
            return {
                ...state,
                deployedModuleIndex: action.index
            }
        default: 
            return state
    }
}