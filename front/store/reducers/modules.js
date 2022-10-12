export default ( state, action ) => {
    state = JSON.parse(JSON.stringify(state))
    module = JSON.parse(JSON.stringify(state.module))
    switch(action.type){
        case 'loadModuleAndUpdateIndex':
            return {
                ...state,
                module: action.module,
                ModuleIndex: action.ModuleIndex
            }
        case 'updateModule':
            switch(action.module.type){
                case 'global':
                    switch(action.module.action){
                        case 'updatename':
                            module.name = action.module.name
                            state.module = module
                    }
                case 'steps':
                    // let steps = JSON.parse(JSON.stringify(action.module.steps))
                    let steps = []
                    switch(action.module.action){
                        case 'create':
                            module.steps = module.steps.concat(action.module.steps)
                            state.module = module
                            return state
                        case 'update':
                            steps = []
                            module.steps.forEach(step=>{
                                let modified = action.module.steps.map(sstep=>{
                                    if(step._id===sstep._id){
                                        if(sstep.name!=undefined) {
                                            step.name=sstep.name
                                        } else {
                                            step.done=sstep.done
                                        }
                                        steps.push(step)
                                        return true
                                    }
                                    return false
                                })
                                if(modified.indexOf(true)==-1){
                                    steps.push(step)
                                }
                            })
                            module.steps = steps
                            state.module = module
                            return state
                        case 'delete':
                            steps = []
                            module.steps.forEach(step=>{
                                let modified = action.module.steps.map(sstep=>{
                                    if(step._id==sstep._id){
                                        return true
                                    }
                                    return false
                                })
                                if(modified.indexOf(true)==-1){
                                    steps.push(step)
                                }
                            })
                            module.steps = steps
                            state.module = module
                            return state
                        default:
                            return state
                    }
                default:
                    return state
            }
        default: 
            return state
    }
}