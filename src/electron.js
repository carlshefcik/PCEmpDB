// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog, Menu, ipcMain} = require('electron')

const path = require('path');
const url = require('url');


const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()

// Hook up to database
// let dbFile = path.join(app.getAppPath(), 'EmployeeDB.db')
const db = new sqlite3.Database("./Employee.db")

//global variable for the pages that is loaded on open and when new semseters are added (rare)
let semesters = []
refreshSemesters()
function refreshSemesters(){
    //gets all the semesters and puts them into an array
    db.all('SELECT emp_tbl_name FROM semester_list', (err,rows)=>{
        rows.forEach((e)=>{
            semesters.push(e['emp_tbl_name'])
        })
    })
}


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
    
    //1. get a list of all the semesters
    //2. see if the person was there in every one of the semester tables
    //3. if so add to return value

    let semesterInfo = []
    db.serialize(function(){
        //gets all the semesters and puts them into an array
        let semesters = []
        db.each('SELECT emp_tbl_name FROM semester_list ORDER BY emp_tbl_name DESC', (err,row)=>{
            semesters.push(row['emp_tbl_name'])
        }, () =>{ //called once db.each() finishes
            getInfo()
        })

        function getInfo() {
            let count=0
            semesters.forEach(semName => {
                let dbString = 'SELECT * FROM '+semName+' WHERE sid="'+arg+'"'
                console.log(dbString)
                db.serialize(function(){
                    db.each(dbString, (err, row)=>{ // should only give one row
                        if(row){
                            let empInfo = []
                            let obj = row //assigns object in array
                            empInfo.push(semName)
                            for (var key in obj){ // key = object attribute name & obj = the object itself
                                var attrName = key // the arributes name is the key
                                var attrValue = obj[key] // how to retireve the obj value
                                empInfo.push(obj[key])
                            }
                            semesterInfo.push(empInfo)
                        }
                        
                    }, () => {
                        //promise, calls once db query completes
                        if(count === semesters.length-1){
                            sendResult()
                        } else { count++ }
                    })
                })
            })
        }
        
        function sendResult() {
            event.sender.send('edit-reply', semesterInfo)
        }
    })
})

ipcMain.on('edit-post', (event, arg) => {
    //take data and replace the coresponding rows data

    // 1. Get input variables (semester being saved and all other variables)
    // 2. Add query to DB
    console.log(arg)
    let semseter = arg[0]
    let data = arg[1]

    db.serialize(function(){
        db.run('UPDATE '+ semseter +' SET last_name=$last_name, first_name=$first_name, preferred_name=$preferred_name, pronouns=$pronouns, email=$email, phone_number=$phone_number, shirt_size=$shirt_size, grad_date=$grad_date, major=$major, college=$college, undergrad=$undergrad, international=$international, role=$role, semester_start=$semester_start, hire_status=$hire_status, schedule_sent=$schedule_sent, evc_date=$evc_date, pay_rate=$pay_rate, leave_date=$leave_date, leave_reason=$leave_reason, training_levels=$training_levels, certifications=$certifications, avg_hours_wk=$avg_hours_wk, courses=$courses, languages=$languages, strengths=$strengths, special_interests=$special_interests WHERE sid=$sid', {
            $last_name:         data['last_name'], 
            $first_name:        data['first_name'], 
            $preferred_name:    data['preferred_name'], 
            $pronouns:          data['pronouns'], 
            $email:             data['email'], 
            $phone_number:      data['phone_number'],
            $shirt_size:        data['shirt_size'], 
            $grad_date:         data['grad_date'], 
            $major:             data['major'], 
            $college:           data['college'], 
            $undergrad:         data['undergrad'], 
            $international:     data['international'], 
            $role:              data['role'], 
            $semester_start:    data['semester_start'], 
            $hire_status:       data['hire_status'], 
            $schedule_sent:     data['schedule_sent'], 
            $evc_date:          data['evc_date'], 
            $pay_rate:          data['pay_rate'], 
            $leave_date:        data['leave_date'], 
            $leave_reason:      data['leave_reason'], 
            $training_levels:   data['training_levels'], 
            $certifications:    data['certifications'], 
            $avg_hours_wk:      data['avg_hours_wk'], 
            $courses:           data['courses'], 
            $languages:         data['languages'], 
            $strengths:         data['strengths'], 
            $special_interests: data['special_interests'],
            $sid:               data['sid']
        }, (err)=>{ 
            if(err){
                confirmQuery(false)
            } else {
                confirmQuery(true)
            }
        })
    })
    function confirmQuery(queryErr) {
        event.sender.send('edit-confirm', queryErr) 
    }
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

    let searchResults = []
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
                searchResults.push(employee)
            })
            event.sender.send('search-reply', searchResults)
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
    // const startUrl = process.env.ELECTRON_START_URL || url.format({
    //     pathname: path.join(__dirname, '/../build/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // });
    // mainWindow.loadURL(startUrl);
    mainWindow.loadURL('http://localhost:3000');

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
    db.close()
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