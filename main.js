const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const { registerUser, loginUser } = require('./auth');
const sqlite3 = require("sqlite3").verbose();


const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error(error.message);
  } else {
    console.log("Database is connected.");
  }
});

db.run(`CREATE TABLE IF NOT EXISTS patients(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  insurance INTEGER,
  doctor TEXT,
  service TEXT,
  date TEXT,
  time TEXT
  )`)
 

  ipcMain.handle("sendPatientDetails", async(event, arg)=>{
    const {patient_name,insurance_number,doctor_name,service,date,time} = arg;
      return await new Promise((resolve,reject)=>{
        db.run(`INSERT INTO patients (name,insurance,doctor,service,date,time) VALUES (?,?,?,?,?,?)`, [patient_name,insurance_number,doctor_name,service,date,time],function(error){
          if(error){
            reject(error)
          }else{
            id = this.lastID;
            arg.id = id;
            resolve({success: true, message:"Patient's info is stored successfully.", data:arg})
          }
        })
      })
  })
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

  ipcMain.handle("registerUser", async(event,arg)=>{
    const {name,email,password} = arg
    try {
      const response = await registerUser(email,password,name)
      return response 
    }catch (error) {
      return {success: false, message: "Something went wrong in registering process." }
  }
})
 
ipcMain.handle("loginUser", async(event,arg)=>{
  const {email,password} = arg
  try {
    const response = await loginUser(email,password)
    return response 
  }catch (error) {
    return {success: false, message: "Something went wrong in registering process." }
}
})



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