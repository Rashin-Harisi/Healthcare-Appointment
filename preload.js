const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'api',{
    registerUser : (data)=> ipcRenderer.invoke("registerUser",data),
    loginUser: (data)=> ipcRenderer.invoke("loginUser", data),
    sendPatientDetails : (data) => ipcRenderer.invoke("sendPatientDetails", data)
  })