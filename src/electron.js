// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog, Menu, ipcMain} = require('electron')

const path = require('path');
const url = require('url');


const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()

// Hook up to database
// let dbFile = path.join(app.getAppPath(), 'EmployeeDB.db')
const db = new sqlite3.Database("./Employee_testing.db")

var currentSem = [];
getCurrentSemester()
function getCurrentSemester() {
    db.all(`SELECT * FROM semester_list WHERE year <= strftime('%Y','now') ORDER BY year DESC, semester ASC`, (err, rows)=>{
        console.log(rows[0])
        currentSem = rows[0]
    })
}

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
    //1. Make query that joins semester_list to employee_data
    //2. Front end parses and creates select from elements

    let dbString = `SELECT * FROM semester_list JOIN employee_data ON employee_data.semester_id = semester_list.semester_id WHERE sid='${arg}' ORDER BY year DESC, semester ASC`
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
        ,pronoun_id =          ${empData['pronoun_id']}
        ,email =               '${empData['email']}'
        ,phone_number =        '${empData['phone_number']}'
        ,shirt_size =          ${empData['shirt_size']}
        ,grad_date =           '${empData['grad_date']}'
        ,major =               '${empData['major']}'
        ,college =             '${empData['college']}'
        ,degree =              ${empData['degree']}
        ,transfer =            ${empData['transfer']}
        ,international =       ${empData['international']}
        ,role  =               ${empData['role']}
        ,semester_start =      '${empData['semester_start']}'
        ,hire_status =         '${empData['hire_status']}'
        ,schedule_sent =       ${empData['schedule_sent']}
        ,evc_date =            '${empData['evc_date']}'
        ,pay_rate =            ${empData['pay_rate']}
        ,leave_date =          '${empData['leave_date']}'
        ,leave_reason =        '${empData['leave_reason']}'
        ,avg_hours_wk =        ${empData['avg_hours_wk']}
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

ipcMain.on('add-post', (event, arg) => {
    //take data and replace the coresponding rows data

    // 1. Get input variables (semester being saved and all other variables)
    // 2. Add query to DB
    let semester_id = arg[0]
    let empData = arg[1]
    console.log(arg);
    let queryString = `INSERT INTO employee_data 
    (
        semester_id
        ,sid
        ,last_name
        ,first_name
        ,preferred_name
        ,pronoun_id
        ,email
        ,phone_number
        ,shirt_size
        ,grad_date
        ,major
        ,college
        ,degree
        ,transfer
        ,international
        ,role
        ,semester_start
        ,hire_status
        ,schedule_sent
        ,evc_date
        ,pay_rate
        ,leave_date
        ,leave_reason
        ,avg_hours_wk
        ) 
    VALUES (
        ${semester_id}
        ,'${empData['sid']}'
        ,'${empData['last_name']}'
        ,'${empData['first_name']}'
        ,'${empData['preferred_name']}'
        ,${empData['pronoun_id']}
        ,'${empData['email']}'
        ,'${empData['phone_number']}'
        ,${empData['shirt_size']}
        ,'${empData['grad_date']}'
        ,'${empData['major']}'
        ,'${empData['college']}'
        ,${empData['degree']}
        ,${empData['transfer']}
        ,${empData['international']}
        ,${empData['role']}
        ,'${empData['semester_start']}'
        ,'${empData['hire_status']}'
        ,${empData['schedule_sent']}
        ,'${empData['evc_date']}'
        ,${empData['pay_rate']}
        ,'${empData['leave_date']}'
        ,'${empData['leave_reason']}'
        ,${empData['avg_hours_wk']}
        )`

    console.log(queryString)

    // 3. Add to employee_data table 
    db.serialize(function(){
        db.run(queryString, (err)=>{ 
            if(err){
                console.log(err)
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

ipcMain.on('prof-get', (event, arg) => {
    // console.log(arg);
    db.serialize(function(){
        db.all(`SELECT * FROM professors ORDER BY last_name ASC, first_name ASC`, (err, rows)=>{
            event.sender.send('prof-reply', rows)
        })
    })
})

ipcMain.on('prof-add-post', (event, arg) => {
    db.serialize(function(){
        db.run(`INSERT INTO professors (last_name, first_name, pronoun_id, email, phone_number, department) VALUES ('${arg[0]}', '${arg[1]}', ${arg[2]},' ${arg[3]}', '${arg[4]}', '${arg[5]}')`, (err) => { 
            if(err){
                confirmQuery(false)
            } else {
                confirmQuery(true)
            }
        })
    })
    function confirmQuery(queryErr) {
        event.sender.send('prof-add-confirm', queryErr)
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
        AND e.semester_id = ${currentSem['semester_id']}
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

ipcMain.on('semEmployees-get', (event, arg) => {
    // console.log(arg);
    db.serialize(function(){
        db.all(`SELECT first_name, last_name, sid, id FROM employee_data WHERE semester_id=${arg} ORDER BY last_name, first_name`, (err, rows)=>{
            event.sender.send('semEmployees-reply', rows)
        })
    })
})

ipcMain.on('grades-list-get', (event, arg) => {
    db.serialize(function(){
        db.all(`
        SELECT
            cl.class_id, sl.subject, cl.number, cg.grade_id, cg.grade, s.semester, s.year
        FROM
            class_grades as cg 
        JOIN
            class_list as cl ON cg.class_id = cl.class_id
        JOIN
            subject_list as sl ON cl.subject_id = sl.subject_id
        JOIN
            employee_data as e ON cg.sid = e.sid
        JOIN
            semester_list as s ON s.semester_id = cg.semester_id
        WHERE
            e.sid = '${arg}'
        GROUP BY
            cl.class_id
        ORDER BY 
            s.year ASC, s.semester DESC, sl.subject ASC, cl.number ASC
        `, (err, rows)=>{
            event.sender.send('grades-list-reply', rows)
        })
    })
})

ipcMain.on('grade-add-post', (event, arg) => {
    db.serialize(function(){
        db.run(`INSERT INTO class_grades (sid, class_id, semester_id, grade) VALUES ('${arg['sid']}', ${arg['class_id']}, ${arg['semester_id']}, ${arg['grade']})`, (err) => { 
            if(err){
                confirmQuery(false)
            } else {
                confirmQuery(true)
            }
        })
    })
    function confirmQuery(queryErr) {
        event.sender.send('grade-add-confirm', queryErr)
    }
})
ipcMain.on('grade-remove-post', (event, arg) => {
    db.serialize(function(){
        db.run(`DELETE FROM class_grades WHERE grade_id=${arg}`, (err) => { 
            if(err){
                confirmQuery(false)
            } else {
                confirmQuery(true)
            }
        })
    })
    function confirmQuery(queryErr) {
        event.sender.send('grade-remove-confirm', queryErr)
    }
})

ipcMain.on('training-levels-get', (event, arg) => {
    db.serialize(function(){
        db.all(`SELECT * FROM training_levels ORDER BY training_level ASC`, (err, rows)=>{
            event.sender.send('training-levels-reply', rows)
        })
    })
})
ipcMain.on('training-level-create-post', (event, arg) => {
    db.serialize(function(){
        db.run(`INSERT INTO training_levels (training_level) VALUES ('${arg}')`, (err) => { 
            if(err){ confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('training-level-create-confirm', queryErr) }
})
ipcMain.on('training-level-remove-post', (event, arg) => {
    db.serialize(function(){
        db.run(`DELETE FROM training_levels WHERE training_level_id=${arg}`, (err) => { 
            if(err){ confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('training-level-remove-confirm', queryErr) }
})
ipcMain.on('training-level-list-get', (event, arg) => {
    db.serialize(function(){
        db.all(`SELECT * FROM assigned_training_level JOIN training_levels ON training_levels.training_level_id=assigned_training_level.training_level_id WHERE sid='${arg}' ORDER BY training_id ASC`, (err, rows)=>{
            event.sender.send('training-level-list-reply', rows)
        })
    })
})
ipcMain.on('training-level-assign-post', (event, arg) => {
    db.serialize(function(){
        db.run(`INSERT INTO assigned_training_level (training_level_id, semester_id, sid) VALUES (${arg[0]}, ${arg[1]}, '${arg[2]}')`, (err) => { 
            if(err){ console.log(err); confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('training-level-assign-confirm', queryErr) }
})
ipcMain.on('training-level-assign-remove-post', (event, arg) => {
    db.serialize(function(){
        db.run(`DELETE FROM assigned_training_level WHERE training_id=${arg}`, (err) => { 
            if(err){ confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('training-level-assign-remove-confirm', queryErr) }
})

ipcMain.on('certifications-get', (event, arg) => {
    db.serialize(function(){
        db.all(`SELECT * FROM certifications ORDER BY certification ASC`, (err, rows)=>{
            event.sender.send('certifications-reply', rows)
        })
    })
})
ipcMain.on('certification-create-post', (event, arg) => {
    db.serialize(function(){
        db.run(`INSERT INTO certifications (certification) VALUES ('${arg}')`, (err) => { 
            if(err){ confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('certification-create-confirm', queryErr) }
})
ipcMain.on('certification-remove-post', (event, arg) => {
    db.serialize(function(){
        db.run(`DELETE FROM certifications WHERE certification_id=${arg}`, (err) => { 
            if(err){ confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('certification-remove-confirm', queryErr) }
})
ipcMain.on('certification-list-get', (event, arg) => {
    db.serialize(function(){
        db.all(`SELECT * FROM assigned_certifications JOIN certifications ON certifications.certification_id=assigned_certifications.certification_id WHERE sid='${arg}' ORDER BY assigned_cert_id ASC`, (err, rows)=>{
            event.sender.send('certification-list-reply', rows)
        })
    })
})
ipcMain.on('certification-assign-post', (event, arg) => {
    db.serialize(function(){
        db.run(`INSERT INTO assigned_certifications (certification_id, semester_id, sid) VALUES (${arg[0]}, ${arg[1]}, '${arg[2]}')`, (err) => { 
            if(err){ console.log(err); confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('certification-assign-confirm', queryErr) }
})
ipcMain.on('certification-assign-remove-post', (event, arg) => {
    db.serialize(function(){
        db.run(`DELETE FROM assigned_certifications WHERE assigned_cert_id=${arg}`, (err) => { 
            if(err){ confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('certification-assign-remove-confirm', queryErr) }
})


ipcMain.on('languages-get', (event, arg) => {
    db.serialize(function(){
        db.all(`SELECT * FROM languages ORDER BY language ASC`, (err, rows)=>{
            event.sender.send('languages-reply', rows)
        })
    })
})
ipcMain.on('language-create-post', (event, arg) => {
    db.serialize(function(){
        db.run(`INSERT INTO languages (language) VALUES ('${arg}')`, (err) => { 
            if(err){ confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('language-create-confirm', queryErr) }
})
ipcMain.on('language-remove-post', (event, arg) => {
    db.serialize(function(){
        db.run(`DELETE FROM languages WHERE language_id=${arg}`, (err) => { 
            if(err){ confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('language-remove-confirm', queryErr) }
})
ipcMain.on('language-list-get', (event, arg) => {
    db.serialize(function(){
        db.all(`SELECT * FROM assigned_languages JOIN languages ON languages.language_id=assigned_languages.language_id WHERE sid='${arg}' ORDER BY assigned_language_id ASC`, (err, rows)=>{
            event.sender.send('language-list-reply', rows)
        })
    })
})
ipcMain.on('language-assign-post', (event, arg) => {
    db.serialize(function(){
        db.run(`INSERT INTO assigned_languages (language_id, semester_id, sid) VALUES (${arg[0]}, ${arg[1]}, '${arg[2]}')`, (err) => { 
            if(err){ console.log(err); confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('language-assign-confirm', queryErr) }
})
ipcMain.on('language-assign-remove-post', (event, arg) => {
    db.serialize(function(){
        db.run(`DELETE FROM assigned_languages WHERE assigned_language_id=${arg}`, (err) => { 
            if(err){ confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('language-assign-remove-confirm', queryErr) }
})

ipcMain.on('pronouns-get', (event, arg) => {
    db.serialize(function(){
        db.all(`SELECT * FROM pronouns ORDER BY pronoun ASC`, (err, rows)=>{
            event.sender.send('pronouns-reply', rows)
        })
    })
})
ipcMain.on('pronoun-create-post', (event, arg) => {
    db.serialize(function(){
        db.run(`INSERT INTO pronouns (pronoun) VALUES ('${arg}')`, (err) => { 
            if(err){ confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('pronoun-create-confirm', queryErr) }
})
ipcMain.on('pronoun-remove-post', (event, arg) => {
    db.serialize(function(){
        db.run(`DELETE FROM pronouns WHERE pronoun_id=${arg}`, (err) => { 
            if(err){ confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('pronoun-remove-confirm', queryErr) }
})

ipcMain.on('strengths-get', (event, arg) => {
    db.serialize(function(){
        db.all(`SELECT * FROM strengths ORDER BY strength ASC`, (err, rows)=>{
            event.sender.send('strengths-reply', rows)
        })
    })
})
ipcMain.on('strengths-list-get', (event, arg) => {
    db.serialize(function(){
        db.all(`SELECT * FROM assigned_strengths JOIN strengths ON strengths.strength_id=assigned_strengths.strength_id WHERE sid='${arg}' ORDER BY assigned_strength_id ASC`, (err, rows)=>{
            event.sender.send('strengths-list-reply', rows)
        })
    })
})
ipcMain.on('strengths-assign-post', (event, arg) => {
    db.serialize(function(){
        db.run(`INSERT INTO assigned_strengths (strength_id, semester_id, sid) VALUES (${arg[0]}, ${arg[1]}, '${arg[2]}')`, (err) => { 
            if(err){ console.log(err); confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('strengths-assign-confirm', queryErr) }
})
ipcMain.on('strengths-assign-remove-post', (event, arg) => {
    db.serialize(function(){
        db.run(`DELETE FROM assigned_strengths WHERE assigned_strength_id=${arg}`, (err) => { 
            if(err){ confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('strengths-assign-remove-confirm', queryErr) }
})

ipcMain.on('specInt-get', (event, arg) => {
    db.serialize(function(){
        db.all(`SELECT * FROM special_interests WHERE sid='${arg}' ORDER BY special_interest_id ASC`, (err, rows)=>{
            event.sender.send('specInt-reply', rows)
        })
    })
})
ipcMain.on('specInt-assign-post', (event, arg) => {
    db.serialize(function(){
        db.run(`INSERT INTO special_interests (special_interest, semester_id, sid) VALUES ('${arg[0]}', ${arg[1]}, '${arg[2]}')`, (err) => { 
            if(err){ console.log(err); confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('specInt-assign-confirm', queryErr) }
})
ipcMain.on('specInt-assign-remove-post', (event, arg) => {
    db.serialize(function(){
        db.run(`DELETE FROM special_interests WHERE special_interest_id=${arg}`, (err) => { 
            if(err){ confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('specInt-assign-remove-confirm', queryErr) }
})

ipcMain.on('class-section-get', (event, arg) => {
    db.serialize(function(){
        db.all(`SELECT * FROM class_sections JOIN class_list ON class_list.class_id=class_sections.class_id JOIN subject_list ON subject_list.subject_id=class_list.subject_id ORDER BY subject_list.subject ASC, class_list.number ASC `, (err, rows)=>{
            event.sender.send('class-section-reply', rows)
        })
    })
})
ipcMain.on('class-section-edit-post', (event, arg) => {
    db.serialize(function(){
        db.run(`UPDATE class_sections SET catalog_number=${arg[1]}, section_number='${arg[2]}' WHERE class_section_id=${arg[0]}`, (err) => { 
            if(err){ console.log(err); confirmQuery(false) } else { confirmQuery(true) }
        })
    })
    function confirmQuery(queryErr) { event.sender.send('class-section-edit-confirm', queryErr) }
})
ipcMain.on('class-section-add-post', (event, arg) => {
    console.log(arg)
    db.serialize(function(){
        db.run(`INSERT INTO class_sections (catalog_number, class_id, section_number) VALUES ('${arg[0]}', ${arg[1]}, '${arg[2]}')`, (err) => { 
            if(err){
                confirmQuery(false)
            } else {
                confirmQuery(true)
            }
        })
    })
    function confirmQuery(queryErr) {
        event.sender.send('class-section-add-confirm', queryErr)
    }
    // TODO create a table in the db that stores class sections with the semester_id and class_id
    // TODO create a table in the db that stores profesors, table that stores Professors => Class Sections, table that stores Employee => Class sections
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