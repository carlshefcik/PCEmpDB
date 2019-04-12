// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog, Menu, ipcMain} = require('electron')

const path = require('path');
const url = require('url');


const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()

// Hook up to database
// let dbFile = path.join(app.getAppPath(), 'EmployeeDB.db')
const db = new sqlite3.Database("./Employee.db")

//TODO all these queries need to check if there was anything in the rows before they start trying to access the data (especially the semester specific ones)
ipcMain.on('employee-get', (event, arg) => {
    console.log(arg);
    let allEmployees = []
    db.serialize(function(){
        db.all('SELECT * FROM employees', (err, rows)=>{
            // processes each employee and puts it into an array to be inserted into the front page
            rows.forEach((e)=>{
                let employee = []
                // solution from https://stackoverflow.com/questions/1078118/how-do-i-iterate-over-a-json-structure
                let obj = e //assigns object in array
                for (var key in obj){ // key = object attribute name & obj = the object itself
                    var attrName = key // the arributes name is the key
                    var attrValue = obj[key] // how to retireve the obj value
                    employee.push(obj[key])
                }
                allEmployees.push(employee)
            })
            event.sender.send('employee-reply', allEmployees)
        })
    })
})

// for EditEmp page
ipcMain.on('edit-get', (event, arg) => {
    //TODO I think it should get the employee and search their id in every semester table and return all the tables they are in and the front will load the most recent semester and say what semester with a large selector at the top

    let dbString = 'SELECT * FROM employees WHERE sid="'+arg+'"'
    console.log(dbString)
    let allEmployees = []
    db.serialize(function(){
        db.all(dbString, (err, rows)=>{
            // processes each employee and puts it into an array to be inserted into the front page
            rows.forEach((e)=>{
                let employee = []
                let obj = e //assigns object in array
                for (var key in obj){ // key = object attribute name & obj = the object itself
                    var attrName = key // the arributes name is the key
                    var attrValue = obj[key] // how to retireve the obj value
                    employee.push(obj[key])
                }
                allEmployees.push(employee)
            })
            event.sender.send('edit-reply', allEmployees)
        })
    })
})

// for Search page
ipcMain.on('search-get', (event, arg) => {
    console.log(arg);
    //TODO parse the params and build a correct query
    //this is searching for first name
    let dbString = 'SELECT * FROM employees'
    if(arg[4]){ dbString +=' WHERE employed=1' } else { dbString +=' WHERE employed=0' }
    //this should check if we are searching by firstname, lastname, or SID
    if(arg[0]) { //checks to see if there is a search value
        if(arg[5] === 1){
            dbString += ' AND first_name LIKE "%'+arg[0]+'%"'
        } else if (arg[5] === 2){
            dbString += ' AND last_name LIKE "%'+arg[0]+'%"'
        } else if (arg[5] === 3) {
            dbString += ' AND sid LIKE "%'+arg[0]+'%"'
        }
    }
    
    if(arg[1]){ dbString += ' AND current_role=0' }
    //TODO this needs to know if there was something before so it just adds an or
    if(arg[2]){
        if(arg[1]){ dbString += ' OR current_role=1' } else { dbString += ' AND current_role=1' }
    }
    if(arg[3]){
        if(arg[1] || arg[2]){ dbString += ' OR current_role=2' } else { dbString += ' AND current_role=2' }
    }
    //checks to see if we want employed or not
    
    console.log(dbString)

    let allEmployees = []
    db.serialize(function(){
        //this gets all employees that are employed
        db.all(dbString, (err, rows)=>{
            // processes each employee and puts it into an array to be inserted into a results list
            rows.forEach((e)=>{
                let employee = []
                let obj = e //assigns object in array
                for (var key in obj){ // key = object attribute name & obj = the object itself
                    var attrName = key // the arributes name is the key
                    var attrValue = obj[key] // how to retireve the obj value
                    employee.push(obj[key])
                }
                allEmployees.push(employee)
            })
            event.sender.send('search-reply', allEmployees)
        })
    })
})





// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1280, height: 720});

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);
    //mainWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.