const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const { registerUser, loginUser } = require('./auth');
const { createDocument, getDocuments } = require('./db');


const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    win.loadFile('index.html')
  }

  
  async function checkDatabase(){
    //await registerUser('user@example.com', 'password123', 'John Doe');
    //const session = await loginUser('user@example.com', 'password123');
    console.log('User session:', session);
  }
  


  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })