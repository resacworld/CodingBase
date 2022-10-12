import openSocket from 'socket.io-client'
import authService from './auth-service'
const socket = openSocket("http://localhost:3000")
const token = authService.getToken()

// project functions
const createProject = (data) => {
    socket.emit('createProject',{token, data})
}
const deleteProject = (data) => {
    socket.emit('deleteProject',{token, data})
}
const updateProject = (data) => {
    socket.emit('updateProject',{token, data})
}

const subcreateProject = (cb) => {
    socket.on('createProject', cb)
}
const subdeleteProject = (cb) => {
    socket.on('deleteProject', cb)
}
const subupdateProject = (cb) => {
    socket.on('updateProject', cb)
}

// sections fonctions 
const createSection = (data) => {
    socket.emit('createSection',{token, data})
}
const deleteSection = (data) => {
    socket.emit('deleteSection',{token, data})
}
const updateSection = (data) => {
    socket.emit('updateSection',{token, data})
}

const subcreateSection = (cb) => {
    socket.on('createSection', cb)
}
const subdeleteSection = (cb) => {
    socket.on('deleteSection', cb)
}
const subupdateSection = (cb) => {
    socket.on('updateSection', cb)
}


// modules fonctions 
const createModule = (data) => {
    socket.emit('createModule',{token, data})
}
const deleteModule = (data) => {
    socket.emit('deleteModule',{token, data})
}
const updateModule = (data) => {
    socket.emit('updateModule',{token, data})
}

const subcreateModule = (cb) => {
    socket.on('createModule', cb)
}
const subdeleteModule = (cb) => {
    socket.on('deleteModule', cb)
}
const subupdateModule = (cb) => {
    socket.on('updateModule', cb)
}

export {
    // Project wss controller
    createProject,
    deleteProject,
    updateProject,

    subcreateProject,
    subdeleteProject,
    subupdateProject,

    // Sections wss controller
    createSection,
    deleteSection,
    updateSection,

    subcreateSection,
    subdeleteSection,
    subupdateSection,

    // Modules wss controller
    createModule,
    deleteModule,
    updateModule,

    subcreateModule,
    subdeleteModule,
    subupdateModule
}