import { useReducer, createContext, useEffect } from 'react'
import Reducer from "./reducers/index";
import defaultState from './default.json'
import * as wss from "../services/wss-service"
import projectService from '../services/project-service';

export const Context = createContext()

const Store = ({ children }) => {
    const [ state, dispatch ] = useReducer(Reducer, defaultState)

    useEffect(()=>{
        (async() => {
            const projects = await projectService.getUserProjects()
            if(projects.status){
                console.log(projects)
                dispatch({ 
                    supertype: "PROJECTS",
                    type: 'initialisation', 
                    projects: projects.result 
                })
            }
        })()
    },[])

    useEffect(()=>{
        wss.subupdateProject(({ status, result, error })=>{
            if(error) throw error
            console.log(state.projects)
            if(state.projects!=[] && result._id===state.projects[state.deployedProjectIndex]._id){
                console.log('update of Project : ' + JSON.stringify(result)) 
                if(result.name) dispatch({ type: "SETNAME", value: result.name })
                if(result.status) dispatch({ type: "SETSTATUS", value: result.status?result.status:0 })
            }
        })
        wss.subcreateSection(({ status, result, error }) => {
            if(error) throw error
            if(result.project == state.projects[state.deployedProjectIndex]._id){
                dispatch({
                    type: "ADDSECTION",
                    section: result
                })
            }
        })
        wss.subdeleteSection(({ status, result, error }) => {
            if(error) throw error
            if(result.project == state.projects[state.deployedProjectIndex]._id) {
                dispatch({
                    type: "DELETESECTION",
                    section: result
                })
            }
        })
        wss.subupdateSection(({ status, result, error }) => {
            if(error) throw error
            if(result.project == state.projects[state.deployedProjectIndex]._id){
                dispatch({
                    type: "UPDATESECTION",
                    section: result
                })
            }
        })
    }, [state])

    useEffect(()=>{
        wss.subcreateProject(({ status, result, error })=>{
            if(error) throw error
            dispatch({
                supertype: "PROJECTS",
                type: "ADD",
                project : result
            })
        })
        wss.subdeleteProject(({ status, result, error })=>{
            if(error) throw error
            dispatch({
                supertype: "PROJECTS",
                type: "DELETE",
                project : result
            })
        })
        wss.subcreateModule(({ status, result, error })=>{
            if(error) throw error
            dispatch({type:"ADDMODULE", module: result })
        })
        wss.subdeleteModule(({ status, result, error }) => {
            if(error) throw error
            dispatch({type:"DELETEMODULE", module: result })
        })
        wss.subupdateModule(({ status, result, error })=>{
            if(error) throw error
            dispatch({type:"updateModule", module: result})
        })

    },[])

    return (
        <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
    )
}

export default Store