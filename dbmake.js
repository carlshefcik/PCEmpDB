/**
 * Creates the db is not made and creates tables and relationships if not created already
 */
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database("Employee_testing.db")

//will have to make 4 tabes every semester, probably store the table names in the semester_overview so we dont have to build them.

db.serialize(function(){

    createTables()
    function createTables() {
        //semester_list
        db.run(`CREATE TABLE IF NOT EXISTS semester_list (
            semester_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            semester varchar(5), 
            year NUMBER(4))`)
            // emp_tbl_name TEXT, 
            // tutor_tbl_name TEXT, 
            // mentor_tbl_name TEXT, 
            // si_tbl_name TEXT, 
            // wds_tbl_name Text
        
        db.run(`
        CREATE TABLE IF NOT EXISTS subject_list (
            subject_id    INTEGER PRIMARY KEY AUTOINCREMENT, 
            subject     TEXT)`)

        db.run(`
        CREATE TABLE IF NOT EXISTS class_list (
            class_id    INTEGER PRIMARY KEY AUTOINCREMENT, 
            subject_id  INTEGER, 
            number      TEXT)`)

        db.run(`
        CREATE TABLE IF NOT EXISTS class_grades (
            grade_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            sid         TEXT,
            class_id    INTEGER,
            semester_id INTEGER,
            grade       REAL)`)


        //employees table just holds all the info for every employee that has been at peer connections. (maybe also some info from)
        db.run(`CREATE TABLE IF NOT EXISTS employee_data (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT
            ,semester_id        INTEGER
            ,sid                TEXT
            ,last_name          TEXT
            ,first_name         TEXT
            ,preferred_name     TEXT
            ,pronouns           INTEGER
            ,email              TEXT
            ,phone_number       TEXT
            ,shirt_size         INTEGER
            ,grad_date          TEXT
            ,major              TEXT
            ,college            TEXT
            ,undergrad          INTEGER
            ,international      INTEGER 
            ,role               INTEGER
            ,semester_start     TEXT
            ,hire_status        TEXT
            ,schedule_sent      INTEGER
            ,evc_date           TEXT
            ,pay_rate           REAL
            ,leave_date         TEXT 
            ,leave_reason       TEXT
            ,training_levels    TEXT
            ,certifications     TEXT
            ,avg_hours_wk       REAL
            ,courses            TEXT
            ,languages          TEXT
            ,strengths          TEXT
            ,special_interests  TEXT
            )`)

        //this is a semester specific table that holds info on the semetser, points to other tables but only semester_overview table points to it
        //phone number?
        //pronouns: 0=other, 1= male, 2=female
        //shirt size: 0 1 2 3 4 5 6 7 8 
        //undergrad: 0 1
        //international: 0 1
        //role: 0 1 2 3
        //schedule_sent: 0 1
    }

    //TODO have teh Learning assistants and WDSK AS selections

    // semesterFill()
    // subjectFill()
    // classFill()
    // gradesFill()
    // employeeFill()
    
    function semesterFill(){
        db.run(`INSERT INTO semester_list (semester, year) VALUES ('Fall', 2018)`)
        db.run(`INSERT INTO semester_list (semester, year) VALUES ('Spring', 2019)`)
        db.run(`INSERT INTO semester_list (semester, year) VALUES ('Fall', 2019)`)
    }

    function subjectFill(){
        db.run(`INSERT INTO subject_list (subject) VALUES ('CS')`)
        db.run(`INSERT INTO subject_list (subject) VALUES ('CMPE')`)
    }
    
    function classFill(){
        db.run(`INSERT INTO class_list (subject_id, number) VALUES (1, '46B')`)
        db.run(`INSERT INTO class_list (subject_id, number) VALUES (1, '146')`)
        db.run(`INSERT INTO class_list (subject_id, number) VALUES (2, '102')`)
    }

    function gradesFill(){
        db.run(`INSERT INTO class_grades (sid, class_id, semester_id, grade) VALUES ('111111111', 1, 2, 3.0)`)
        db.run(`INSERT INTO class_grades (sid, class_id, semester_id, grade) VALUES ('123456789', 1, 1, 4.0)`)
        db.run(`INSERT INTO class_grades (sid, class_id, semester_id, grade) VALUES ('010517091', 1, 1, 4.0)`)
        db.run(`INSERT INTO class_grades (sid, class_id, semester_id, grade) VALUES ('010517091', 2, 1, 3.0)`)
        db.run(`INSERT INTO class_grades (sid, class_id, semester_id, grade) VALUES ('010517091', 3, 2, 4.0)`)
    }
    
    function employeeFill(){
        db.run(`INSERT INTO employee_data 
        (
            semester_id
            ,sid
            ,last_name
            ,first_name
            ,preferred_name
            ,pronouns
            ,email
            ,phone_number
            ,shirt_size
            ,grad_date
            ,major
            ,college
            ,undergrad
            ,international
            ,role
            ,semester_start
            ,hire_status
            ,schedule_sent
            ,evc_date
            ,pay_rate
            ,leave_date
            ,leave_reason
            ,training_levels
            ,certifications
            ,avg_hours_wk
            ,courses
            ,languages
            ,strengths
            ,special_interests
        ) 
        VALUES 
        (1, "010517091", "Shefcik", "Carl", "Carl", 1, "carl.shefcik@sjsu.edu", "619-846-3775", 2, "Spring 2020", "Software Engineering", "Engineering", 1, 0, 3, "Fall 2017", "Good?", "1", "date format", "15.00", "", "", "SI level 2", "", "15", "array pointing to class ids", "English", "strengths", "memes")`)

        db.run(`INSERT INTO employee_data 
        (semester_id, sid, last_name, first_name, preferred_name, pronouns, email, phone_number, shirt_size, grad_date, major, college, undergrad, international, role, semester_start, hire_status, schedule_sent, evc_date, pay_rate, leave_date, leave_reason, training_levels, certifications, avg_hours_wk, courses, languages, strengths, special_interests) 
        VALUES 
        (2, "010517091", "Shefcik", "Carl", "Carl", 1, "carl.shefcik@sjsu.edu", "619-846-3775", 2, "Spring 2020", "Software Engineering", "Engineering", 1, 0, 2, "Fall 2017", "Good?", "1", "date format", "15.75", "", "", "SI level 2", "", "4", "array pointing to class ids", "English", "strengths", "memes")`)

        db.run(`INSERT INTO employee_data 
        (semester_id, sid, last_name, first_name, preferred_name, pronouns, email, phone_number, shirt_size, grad_date, major, college, undergrad, international, role, semester_start, hire_status, schedule_sent, evc_date, pay_rate, leave_date, leave_reason, training_levels, certifications, avg_hours_wk, courses, languages, strengths, special_interests) 
        VALUES 
        (3, "010517091", "Shefcik", "Carl", "Carl", 1, "carl.shefcik@sjsu.edu", "619-846-3775", 2, "Spring 2020", "Software Engineering", "Engineering", 1, 0, 2, "Fall 2017", "Good?", "1", "date format", "15.75", "", "", "SI level 2", "", "4", "array pointing to class ids", "English", "strengths", "memes")`)
        
        db.run(`INSERT INTO employee_data 
        (semester_id, sid, last_name, first_name, preferred_name, pronouns, email, phone_number, shirt_size, grad_date, major, college, undergrad, international, role, semester_start, hire_status, schedule_sent, evc_date, pay_rate, leave_date, leave_reason, training_levels, certifications, avg_hours_wk, courses, languages, strengths, special_interests) 
        VALUES 
        (1, "123456789", "Naeem", "Sonnan", "", 1, "", "", 2, "Spring 2020", "Computer Science", "COS", 1, 0, 2, "Fall 2017", "Good?", "1", "date format", "15.75", "", "", "Tutor level 2", "", "4", "array pointing to class ids", "English", "strengths", "memes")`)
       
        db.run(`INSERT INTO employee_data 
        (semester_id, sid, last_name, first_name, preferred_name, pronouns, email, phone_number, shirt_size, grad_date, major, college, undergrad, international, role, semester_start, hire_status, schedule_sent, evc_date, pay_rate, leave_date, leave_reason, training_levels, certifications, avg_hours_wk, courses, languages, strengths, special_interests) 
        VALUES 
        (1, "111111111", "Doe", "Jon", "", 1, "", "", 2, "Spring 2020", "Computer Science", "COS", 1, 0, 2, "Fall 2017", "Good?", "1", "date format", "15.75", "", "", "Tutor level 2", "", "4", "array pointing to class ids", "English", "strengths", "memes")`)
        
    }

    

    
    // delete command
    // db.run('DELETE FROM Employees')

    // db.all(`SELECT * FROM semester_list`, (err, rows)=>{
    //     console.log(rows)
    // })
    // db.all(`SELECT * FROM employee_data`, (err, rows)=>{
    //     console.log(rows)
    //     // if(rows){ console.log('worked') }
    // })

    // testing()
    function testing(){
        let semesterInfo = []
        let count=0
            
        let dbString = 'SELECT * FROM employee_data WHERE sid="010517091"'
        db.each(dbString, (err, row)=>{
            if(row){
                let empInfo = []
                let obj = row //assigns object in array
                for (var key in obj){ // key = object attribute name & obj = the object itself
                    var attrName = key // the arributes name is the key
                    var attrValue = obj[key] // how to retireve the obj value
                    empInfo.push(obj[key])
                }
                semesterInfo.push(empInfo)
            }

        }, () => {
            //promise, calls once db query completes
            sendResult()
        })
            
        function sendResult() {
            console.log(semesterInfo)
            //event.sender.send('edit-reply', semesterInfo)
        }
    }

    getCurrentSemester()
    function getCurrentSemester() {
        db.all(`SELECT * FROM semester_list WHERE year <= strftime('%Y','now') ORDER BY year DESC, semester ASC`, (err, rows)=>{
            console.log(rows[0])
        })
    }

    // let dbString = `SELECT * FROM semester_list JOIN employee_data ON employee_data.semester_id = semester_list.semester_id WHERE sid='010517091'`
    // console.log(dbString)
    // db.serialize(function(){
    //     db.all(dbString, (err, rows)=>{ // should only give one row
    //         console.log(rows)
    //     })
    // })

    

    // db.serialize(function(){
    //     db.all(`
    //     SELECT 
    //         e1.first_name, e1.last_name, e1.sid, e1.role
    //     FROM 
    //         (SELECT * from employee_data WHERE semester_id <> 3) as e1
    //     LEFT JOIN 
    //         (SELECT * from employee_data WHERE semester_id = 3) as e2
    //     ON 
    //         e1.sid = e2.sid
    //     WHERE e2.sid IS NULL

    //     `, (err, rows)=>{ 
    //         console.log('-----------------------------------------------------')
    //         console.log(err)
    //         console.log(rows)
    //     })
    // })

    db.serialize(function(){
        db.all(`
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
            cl.class_id = 1
            AND e.semester_id = 3
        GROUP BY
            e.sid, cl.class_id`
        , (err, rows)=>{ 
            console.log('-----------------------------------------------------')
            console.log(err)
            console.log(rows)
        })
    })
    
    // db.serialize(function(){
    //     db.all(`
    //     SELECT
    //         cl.class_id, sl.subject, cl.number, cg.grade_id, cg.grade, s.semester, s.year
    //     FROM
    //         class_grades as cg 
    //     JOIN
    //         class_list as cl ON cg.class_id = cl.class_id
    //     JOIN
    //         subject_list as sl ON cl.subject_id = sl.subject_id
    //     JOIN
    //         employee_data as e ON cg.sid = e.sid
    //     JOIN
    //         semester_list as s ON s.semester_id = cg.semester_id
    //     WHERE
    //         e.sid = '010517091'
    //     GROUP BY
    //         cl.class_id
    //     ORDER BY 
    //         s.year ASC, s.semester DESC
    //     `, (err, rows)=>{ 
    //         console.log('-----------------------------------------------------')
    //         console.log(err)
    //         console.log(rows)
    //     })
    // })
    
    

})

//db.close();