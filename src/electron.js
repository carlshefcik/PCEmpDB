// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog, Menu, ipcMain} = require('electron')

const path = require('path');
const url = require('url');


const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()

// Hook up to database
// let dbFile = path.join(app.getAppPath(), 'EmployeeDB.db')
const db = new sqlite3.Database("./Employee_testing.db")


//TODO all these queries need to check if there was anything in the rows before they start trying to access the data (especially the semester specific ones)
// ! Not Used
// ipcMain.on('employee-get', (event, arg) => {
//     console.log(arg);
//     let allEmployees = []
//     db.serialize(function(){
//         db.all('SELECT * FROM employee_data', (err, rows)=>{
//             // processes each employee and puts it into an array to be inserted into the front page
//             rows.forEach((e)=>{
//                 let employee = []
//                 // solution from https://stackoverflow.com/questions/1078118/how-do-i-iterate-over-a-json-structure
//                 let obj = e //assigns object in array
//                 for (var key in obj){ // key = object attribute name & obj = the object itself
//                     var attrName = key // the arributes name is the key
//                     var attrValue = obj[key] // how to retireve the obj value
//                     employee.push(obj[key])
//                 }
//                 allEmployees.push(employee)
//             })
//             event.sender.send('employee-reply', allEmployees)
//         })
//     })
// })


// for EditEmp page
ipcMain.on('edit-get', (event, arg) => {
    //TODO I think it should get the employee and search their id in every semester table and return all the tables they are in and the front will load the most recent semester and say what semester with a large selector at the top
    
    //1. Make query that joins semester_list to employee_data
    //2. Front end parses and creates select from elements

    let dbString = `SELECT * FROM semester_list JOIN employee_data ON employee_data.semester_id = semester_list.semester_id WHERE sid='${arg}' ORDER BY year DESC, semester ASC`
    console.log(dbString)
    db.serialize(function(){
        db.all(dbString, (err, row)=>{ // should only give one row
            event.sender.send('edit-reply', row)
        })
    })

})

ipcMain.on('edit-post', (event, arg) => {
    //take data and replace the coresponding rows data
    let empData = arg[0];
    
    db.serialize(function(){
        db.run(`UPDATE employee_data SET 
        last_name =            '${empData['last_name']}'
        ,first_name =          '${empData['first_name']}'
        ,preferred_name =      '${empData['preferred_name']}'
        ,pronouns =            ${empData['pronouns']}
        ,email =               '${empData['email']}'
        ,phone_number =        '${empData['phone_number']}'
        ,shirt_size =          ${empData['shirt_size']}
        ,grad_date =           '${empData['grad_date']}'
        ,major =               '${empData['major']}'
        ,college =             '${empData['college']}'
        ,undergrad =           ${empData['undergrad']}
        ,international =       ${empData['international']}
        ,role  =               ${empData['role']}
        ,semester_start =      '${empData['semester_start']}'
        ,hire_status =         '${empData['hire_status']}'
        ,schedule_sent =       ${empData['schedule_sent']}
        ,evc_date =            '${empData['evc_date']}'
        ,pay_rate =            ${empData['pay_rate']}
        ,leave_date =          '${empData['leave_date']}'
        ,leave_reason =        '${empData['leave_reason']}'
        ,training_levels =     '${empData['training_levels']}'
        ,certifications =      '${empData['certifications']}'
        ,avg_hours_wk =        ${empData['avg_hours_wk']}
        ,courses =             '${empData['courses']}'
        ,languages =           '${empData['languages']}'
        ,strengths =           '${empData['strengths']}'
        ,special_interests =   '${empData['special_interests']}'
        WHERE 
        id =           ${empData['id']}`
        , (err)=>{ 
            if(err){
                console.log(err)
                confirmQuery(false)
            } else {
                // TODO continue updating the other tables
                confirmQuery(true) // this should be called if all the tables are done
            }
        })
    })
    function confirmQuery(queryErr) {
        event.sender.send('edit-confirm', queryErr) 
    }
})

// for AddEmp and NewSemester page
ipcMain.on('semesters-get', (event, arg) => {
    db.serialize(function(){
        db.all('SELECT * FROM semester_list ORDER BY year DESC, semester ASC', (err,rows)=>{
            event.sender.send('semesters-reply', rows)
        })
    })
})

ipcMain.on('classes-get', (event, arg) => {
    db.serialize(function(){
        db.all(`SELECT * FROM class_list as cl JOIN subject_list as sl ON cl.subject_id=sl.subject_id  ORDER BY sl.subject, cl.number`, (err, rows)=>{
            event.sender.send('classes-reply', rows)
        })
    })
})

ipcMain.on('class-add-post', (event, arg) => {
    db.serialize(function(){
        db.run(`INSERT INTO class_list (subject_id, number) VALUES (${arg[0]}, '${arg[1]}')`, (err) => { 
            if(err){
                confirmQuery(false)
            } else {
                confirmQuery(true)
            }
        })
    })
    function confirmQuery(queryErr) {
        event.sender.send('class-add-confirm', queryErr)
    }
})

ipcMain.on('subject-get', (event, arg) => {
    db.serialize(function(){
        db.all(`SELECT * FROM subject_list ORDER BY subject`, (err, rows)=>{
            event.sender.send('subject-reply', rows)
        })
    })
})

ipcMain.on('subject-create-post', (event, arg) => {
    db.serialize(function(){
        db.run(`INSERT INTO subject_list (subject) VALUES ('${arg}')`, (err) => { 
            if(err){
                confirmQuery(false)
            } else {
                confirmQuery(true)
            }
        })
    })
    function confirmQuery(queryErr) {
        event.sender.send('subject-create-confirm', queryErr)
    }
})

ipcMain.on('class-manage-post', (event, arg) => {
    console.log(arg)
    event.sender.send('class-manage-confirm', 'success')
})

ipcMain.on('add-post', (event, arg) => {
    //take data and replace the coresponding rows data

    // 1. Get input variables (semester being saved and all other variables)
    // 2. Add query to DB
    console.log(arg)
    let semester_id = arg[0]
    let empData = arg[1]

    // 3. Add to employee_data table 
    db.serialize(function(){
        db.run('INSERT INTO employee_data (semester_id, sid, last_name, first_name, preferred_name, pronouns, email, phone_number, shirt_size, grad_date, major, college, undergrad, international, role, semester_start, hire_status, schedule_sent, evc_date, pay_rate, leave_date, leave_reason, training_levels, certifications, avg_hours_wk, courses, languages, strengths, special_interests) VALUES ($semester_id, $sid, $last_name, $first_name, $preferred_name, $pronouns, $email, $phone_number, $shirt_size, $grad_date, $major, $college, $undergrad, $international, $role, $semester_start, $hire_status, $schedule_sent, $evc_date, $pay_rate, $leave_date, $leave_reason, $training_levels, $certifications, $avg_hours_wk, $courses, $languages, $strengths, $special_interests)', {
            $semester_id:       semester_id, 
            $last_name:         empData['last_name'], 
            $first_name:        empData['first_name'], 
            $preferred_name:    empData['preferred_name'], 
            $pronouns:          empData['pronouns'], 
            $email:             empData['email'], 
            $phone_number:      empData['phone_number'],
            $shirt_size:        empData['shirt_size'], 
            $grad_date:         empData['grad_date'], 
            $major:             empData['major'], 
            $college:           empData['college'], 
            $undergrad:         empData['undergrad'], 
            $international:     empData['international'], 
            $role:              empData['role'], 
            $semester_start:    empData['semester_start'], 
            $hire_status:       empData['hire_status'], 
            $schedule_sent:     empData['schedule_sent'], 
            $evc_date:          empData['evc_date'], 
            $pay_rate:          empData['pay_rate'], 
            $leave_date:        empData['leave_date'], 
            $leave_reason:      empData['leave_reason'], 
            $training_levels:   empData['training_levels'], 
            $certifications:    empData['certifications'], 
            $avg_hours_wk:      empData['avg_hours_wk'], 
            $courses:           empData['courses'], 
            $languages:         empData['languages'], 
            $strengths:         empData['strengths'], 
            $special_interests: empData['special_interests'],
            $sid:               empData['sid']
        }, (err)=>{ 
            if(err){
                confirmQuery(false)
            } else {
                confirmQuery(true)
            }
        })
    })
    function confirmQuery(queryErr) {
        event.sender.send('add-confirm', queryErr) 
    }
})

// for Search page
ipcMain.on('search-get', (event, arg) => {

    db.serialize(function(){
        db.all(`SELECT * FROM semester_list ORDER BY year DESC, semester ASC`, (err, rows)=>{
            // console.log(rows[0]['semester_id'])
            getEmployees(rows[0]['semester_id'])
        })
    })

    // console.log(arg);
    //this is searching for first name
    function getEmployees(tempSemId) {
        let dbString = '';
        if(!arg[4]){
            dbString +=`
        SELECT 
            e1.first_name, e1.last_name, e1.sid, e1.role
        FROM 
            (SELECT * from employee_data WHERE semester_id <> ${tempSemId}) as e1
        LEFT JOIN 
            (SELECT * from employee_data WHERE semester_id = ${tempSemId}) as e2
        ON 
            e1.sid = e2.sid
        WHERE e2.sid IS NULL`
        } else {
            dbString +=`SELECT sid, first_name, last_name, role FROM employee_data WHERE semester_id=${tempSemId}`
        }

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
        
        if(arg[1]){ dbString += ' AND role=0' }
        //TODO this needs to know if there was something before so it just adds an or
        if(arg[2]){
            if(arg[1]){ dbString += ' OR role=1' } else { dbString += ' AND role=1' }
        }
        if(arg[3]){
            if(arg[1] || arg[2]){ dbString += ' OR role=2' } else { dbString += ' AND role=2' }
        }
        //checks to see if we want employed or not
        //groups by sid
        
        // console.log(dbString)

        db.serialize(function(){
            //this gets all employees that are employed
            db.all(dbString, (err, rows)=>{
                // console.log(err)
                // processes each employee and puts it into an array to be inserted into a results list
                event.sender.send('search-reply', rows)
            })
        })
    }
})

ipcMain.on('class-search-get', (event, arg) => {
    // searches for the class and gives the grade and employee data
    let dbString = `
    SELECT
        cl.class_id, sl.subject, cl.number, cg.grade, e.first_name, e.last_name, e.sid, e.role
    FROM
        class_list as cl
    JOIN
        subject_list as sl ON cl.subject_id = sl.subject_id
    JOIN
        class_grades as cg ON cl.class_id = cg.class_id
    JOIN
        employee_data as e ON cg.sid = e.sid
    WHERE
        cl.class_id = ${arg}
    GROUP BY
        e.sid, cl.class_id`

    db.serialize(function(){
        //this gets all employees that are employed
        db.all(dbString, (err, rows)=>{
            // console.log(err)
            // processes each employee and puts it into an array to be inserted into a results list
            event.sender.send('class-search-reply', rows)
        })
    })
})

// TODO REDO
ipcMain.on('semEmployees-get', (event, arg) => {
    console.log(arg);
    let prevSemEmployees = []
    db.serialize(function(){
        db.all('SELECT first_name, last_name, sid FROM '+arg, (err, rows)=>{
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
                prevSemEmployees.push(employee)
            })
            event.sender.send('semEmployees-reply', prevSemEmployees)
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
    // mainWindow.loadURL('http://localhost:3000');

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