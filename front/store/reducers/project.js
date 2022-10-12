export default (state, action) => {
    state = JSON.parse(JSON.stringify(state))
    var sections;
    switch (action.type){
        // utils functions
        case "SETNAME":
            return {
                ...state,
                name_value: action.value
            }
        case "SETSTATUS":
            return {
                ...state,
                status_value: action.value
            }
        // system functions
        case "DELETEPROJECT":   
            return {
                ...state,
                comfirm: action.comfirm
            }
        case "EDITMODESTATUS":
            return {
                ...state,
                editmode: action.value?action.value:!state.editmode 
            }
        case "DESCRIPTIONSTATUS":
            return {
                ...state,
                description: action.value?true:false
            }
        case 'ADDSECTION':
            state.deployedSectionIndex.push(action.section)
            return {
                ...state,
                deployedSectionIndex: state.deployedSectionIndex,
                deployedSectionIndex: state.deployedSectionIndex.length-1
            }
        case 'UPDATESECTION':
            var section = state.sections[state.deployedSectionIndex]
            section = {
                ...section,
                ...action.section
            }
            return {
                ...state,
                deployedSectionIndex: state.deployedSectionIndex
            }
        case 'DELETESECTION':
            sections = []
            state.deployedSectionIndex.forEach((section)=>{
                if(action.section._id != section._id){
                    sections.push(section)
                }
            })
            return {
                ...state,
                deployedSectionIndex: sections,
                deployedSectionIndex: 0
            }
        case 'SETSECTIONID':
            return {
                ...state,
                deployedSectionIndex: action.index,
                // modules_value: project.sections[action.index].modules,
                // deployedModuleIndex: 0
            }
        default:
            return state
    }
}