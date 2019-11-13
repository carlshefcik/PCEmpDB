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
            semester_id     INTEGER PRIMARY KEY AUTOINCREMENT, 
            semester        varchar(5), 
            year            NUMBER(4))`)
            // emp_tbl_name TEXT, 
            // tutor_tbl_name TEXT, 
            // mentor_tbl_name TEXT, 
            // si_tbl_name TEXT, 
            // wds_tbl_name Text
        
        db.run(`
        CREATE TABLE IF NOT EXISTS subject_list (
            subject_id      INTEGER PRIMARY KEY AUTOINCREMENT, 
            subject         TEXT)`)

        db.run(`
        CREATE TABLE IF NOT EXISTS class_list (
            class_id    INTEGER PRIMARY KEY AUTOINCREMENT, 
            subject_id  INTEGER, 
            number      TEXT)`)

        //Professor and course data for the semesters
        // ? Should this include section number?
        db.run(`
        CREATE TABLE IF NOT EXISTS class_sections (
            class_section_id        INTEGER PRIMARY KEY AUTOINCREMENT,
            catalog_number          INTEGER,
            class_id                INTEGER,
            section_number          TEXT)`)

        db.run(`
        CREATE TABLE IF NOT EXISTS professors (
            professor_id        INTEGER PRIMARY KEY AUTOINCREMENT,
            last_name           TEXT,
            first_name          TEXT,
            pronoun_id          INTEGER,
            email               TEXT,
            phone_number        TEXT,
            department          TEXT)`)

        db.run(`
        CREATE TABLE IF NOT EXISTS class_section_sem_assignments (
            class_section_sem_assign_id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_section_id            INTEGER,
            semester_id                 INTEGER,
            professor_id                INTEGER,
            sid                         TEXT)`)

        //table for the semester assingments for tutors
        db.run(`
        CREATE TABLE IF NOT EXISTS tutor_sem_assignments (
            class_id        INTEGER,
            semester_id     INTEGER,
            sid             TEXT)`)

        //class grades for employees
        db.run(`
        CREATE TABLE IF NOT EXISTS class_grades (
            grade_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            sid         TEXT,
            class_id    INTEGER,
            semester_id INTEGER,
            grade       REAL)`)
            
        //trainging levels for every employee
        db.run(`
        CREATE TABLE IF NOT EXISTS training_levels (
            training_level_id   INTEGER PRIMARY KEY AUTOINCREMENT,
            training_level      TEXT)`)
        db.run(`
        CREATE TABLE IF NOT EXISTS assigned_training_level (
            training_id         INTEGER PRIMARY KEY AUTOINCREMENT,
            training_level_id   INTEGER,
            semester_id         INTEGER,
            sid                 TEXT)`)

        db.run(`
        CREATE TABLE IF NOT EXISTS certifications (
            certification_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            certification       TEXT)`)
        db.run(`
        CREATE TABLE IF NOT EXISTS assigned_certifications (
            assigned_cert_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            certification_id    INTEGER,
            semester_id         INTEGER,
            sid                 TEXT)`)

        db.run(`
        CREATE TABLE IF NOT EXISTS strengths (
            strength_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            strength       TEXT)`)
        db.run(`
        CREATE TABLE IF NOT EXISTS assigned_strengths (
            assigned_strength_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            strength_id             INTEGER,
            semester_id             INTEGER,
            sid                     TEXT)`)

        db.run(`
        CREATE TABLE IF NOT EXISTS languages (
            language_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            language       TEXT)`)
        db.run(`
        CREATE TABLE IF NOT EXISTS assigned_languages (
            assigned_language_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            language_id             INTEGER,
            semester_id             INTEGER,
            sid                     TEXT)`)

        db.run(`
        CREATE TABLE IF NOT EXISTS special_interests (
            special_interest_id     INTEGER PRIMARY KEY AUTOINCREMENT,
            special_interest        TEXT,
            semester_id             INTEGER,
            sid                     TEXT)`)

        db.run(`
        CREATE TABLE IF NOT EXISTS pronouns (
            pronoun_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            pronoun       TEXT)`)


        //employees table just holds all the info for every employee that has been at peer connections. (maybe also some info from)
        db.run(`CREATE TABLE IF NOT EXISTS employee_data (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT
            ,semester_id        INTEGER
            ,sid                TEXT
            ,last_name          TEXT
            ,first_name         TEXT
            ,preferred_name     TEXT
            ,pronoun_id         INTEGER
            ,email              TEXT
            ,phone_number       TEXT
            ,shirt_size         INTEGER
            ,grad_date          TEXT
            ,major              TEXT
            ,college            TEXT
            ,degree             INTEGER
            ,transfer           INTEGER
            ,international      INTEGER 
            ,role               INTEGER
            ,semester_start     INTEGER
            ,hire_status        TEXT
            ,schedule_sent      INTEGER
            ,evc_date           TEXT
            ,pay_rate           REAL
            ,leave_date         TEXT 
            ,leave_reason       TEXT
            ,avg_hours_wk       REAL
            )`)

        //this is a semester specific table that holds info on the semetser, points to other tables but only semester_overview table points to it
        //phone number?
        //pronoun_id: 0=other, 1= male, 2=female
        //shirt size: 0 1 2 3 4 5 6 7 8 
        //undergrad: 0 1
        //international: 0 1
        //role: 0 1 2 3
        //schedule_sent: 0 1
    }

    //TODO have teh Learning assistants and WDSK AS selections

    semesterFill()
    subjectFill()
    classFill()
    gradesFill()
    strengthsFill()
    pronounsFill()
    languagesFill()
    certificationsFill()
    training_levelsFill()
    employeeFill()
    
    // TODO add as many semesters as deanna wants(?)
    function semesterFill(){
        db.run(`INSERT INTO semester_list (semester, year) VALUES ('Spring', 2015)`)
        db.run(`INSERT INTO semester_list (semester, year) VALUES ('Fall', 2015)`)
        db.run(`INSERT INTO semester_list (semester, year) VALUES ('Spring', 2016)`)
        db.run(`INSERT INTO semester_list (semester, year) VALUES ('Fall', 2016)`)
        db.run(`INSERT INTO semester_list (semester, year) VALUES ('Spring', 2017)`)
        db.run(`INSERT INTO semester_list (semester, year) VALUES ('Fall', 2017)`)
        db.run(`INSERT INTO semester_list (semester, year) VALUES ('Spring', 2018)`)
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
        db.run(`INSERT INTO class_grades (sid, class_id, semester_id, grade) VALUES ('111111111', 1, 9, 3.0)`)
        db.run(`INSERT INTO class_grades (sid, class_id, semester_id, grade) VALUES ('123456789', 1, 8, 4.0)`)
        db.run(`INSERT INTO class_grades (sid, class_id, semester_id, grade) VALUES ('010517091', 1, 8, 4.0)`)
        db.run(`INSERT INTO class_grades (sid, class_id, semester_id, grade) VALUES ('010517091', 2, 8, 3.0)`)
        db.run(`INSERT INTO class_grades (sid, class_id, semester_id, grade) VALUES ('010517091', 3, 9, 4.0)`)
    }

    function strengthsFill(){
        //TODO fill in all 34 strengths
        db.run(`INSERT INTO strengths (strength) VALUES ('Acheiver')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Adaptable')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Analytical')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Arranger')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Belif')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Command')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Communication')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Competition')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Connectedness')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Consistency')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Context')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Deliberative')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Developer')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Discipline')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Empathy')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Focus')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Futuristic')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Harmony')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Ideation')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Includer')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Individualization')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Input')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Intellection')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Learner')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Maximizer')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Positivity')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Relator')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Resposiblity')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Restorative')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Self-assurance')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Significance')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Strategic')`)
        db.run(`INSERT INTO strengths (strength) VALUES ('Woo')`)
    }

    function pronounsFill(){
        db.run(`INSERT INTO pronouns (pronoun) VALUES ('He/Him')`)
        db.run(`INSERT INTO pronouns (pronoun) VALUES ('She/Her')`)
    }
    function certificationsFill(){
        db.run(`INSERT INTO certifications (certification) VALUES ('CPR')`)
        db.run(`INSERT INTO certifications (certification) VALUES ('First Aid')`)
    }
    function training_levelsFill(){
        db.run(`INSERT INTO training_levels (training_level) VALUES ('CRLA Tutor 1')`)
        db.run(`INSERT INTO training_levels (training_level) VALUES ('CRLA Tutor 2')`)
        db.run(`INSERT INTO training_levels (training_level) VALUES ('CRLA Mentor 1')`)
        db.run(`INSERT INTO training_levels (training_level) VALUES ('CRLA Mentor 2')`)
    }
    function languagesFill(){
        db.run(`INSERT INTO languages (language) VALUES ('English')`)
        db.run(`INSERT INTO languages (language) VALUES ('Spanish')`)
        db.run(`INSERT INTO languages (language) VALUES ('Chinese')`)
    }
    
    function employeeFill(){
        db.run(`INSERT INTO employee_data 
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
        VALUES 
        (8, "010517091", "Shefcik", "Carl", "Carl", 1, "carl.shefcik@sjsu.edu", "619-846-3775", 2, "Spring 2020", "Software Engineering", "Engineering", 1, 0, 0, 3, 5, "Good?", "1", "date format", "15.00", "", "", "15")`)

        db.run(`INSERT INTO employee_data 
        (semester_id, sid, last_name, first_name, preferred_name, pronoun_id, email, phone_number, shirt_size, grad_date, major, college, degree, transfer, international, role, semester_start, hire_status, schedule_sent, evc_date, pay_rate, leave_date, leave_reason, avg_hours_wk) 
        VALUES 
        (9, "010517091", "Shefcik", "Carl", "Carl", 1, "carl.shefcik@sjsu.edu", "619-846-3775", 2, "Spring 2020", "Software Engineering", "Engineering", 1, 0, 0, 2, 5, "Good?", "1", "date format", "15.75", "", "", "4")`)

        db.run(`INSERT INTO employee_data 
        (semester_id, sid, last_name, first_name, preferred_name, pronoun_id, email, phone_number, shirt_size, grad_date, major, college, degree, transfer, international, role, semester_start, hire_status, schedule_sent, evc_date, pay_rate, leave_date, leave_reason, avg_hours_wk) 
        VALUES 
        (10, "010517091", "Shefcik", "Carl", "Carl", 1, "carl.shefcik@sjsu.edu", "619-846-3775", 2, "Spring 2020", "Software Engineering", "Engineering", 1, 0, 0, 2, 5, "Good?", "1", "date format", "15.75", "", "", "4")`)
        
        db.run(`INSERT INTO employee_data 
        (semester_id, sid, last_name, first_name, preferred_name, pronoun_id, email, phone_number, shirt_size, grad_date, major, college, degree, transfer, international, role, semester_start, hire_status, schedule_sent, evc_date, pay_rate, leave_date, leave_reason, avg_hours_wk) 
        VALUES 
        (9, "123456789", "Naeem", "Sonnan", "", 1, "", "", 2, "Spring 2020", "Computer Science", "COS", 1, 0, 0, 2, 4, "Good?", "1", "date format", "15.75", "", "", "4")`)
       
        db.run(`INSERT INTO employee_data 
        (semester_id, sid, last_name, first_name, preferred_name, pronoun_id, email, phone_number, shirt_size, grad_date, major, college, degree, transfer, international, role, semester_start, hire_status, schedule_sent, evc_date, pay_rate, leave_date, leave_reason, avg_hours_wk) 
        VALUES 
        (9, "111111111", "Doe", "Jon", "", 1, "", "", 2, "Spring 2020", "Computer Science", "COS", 1, 0, 0, 2, 7, "Good?", "1", "date format", "15.75", "", "", "4")`)
        
    }

    

    
    // delete command
    // db.run('DELETE FROM Employees')

    // db.all(`SELECT * FROM pronouns`, (err, rows)=>{
    //     console.log(rows)
    // })
    db.all(`SELECT * FROM semester_list`, (err, rows)=>{
        console.log(rows)
    })
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

    // db.serialize(function(){
    //     db.all(`
    //     SELECT
    //         cl.class_id, sl.subject, cl.number, cg.grade, e.first_name, e.last_name, e.sid, e.role
    //     FROM
    //         class_list as cl
    //     JOIN
    //         subject_list as sl ON cl.subject_id = sl.subject_id
    //     JOIN
    //         class_grades as cg ON cl.class_id = cg.class_id
    //     JOIN
    //         employee_data as e ON cg.sid = e.sid
    //     WHERE
    //         cl.class_id = 1
    //         AND e.semester_id = 3
    //     GROUP BY
    //         e.sid, cl.class_id`
    //     , (err, rows)=>{ 
    //         console.log('-----------------------------------------------------')
    //         console.log(err)
    //         console.log(rows)
    //     })
    // })
    
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
    

    // db.serialize(function(){
    //     db.all(`SELECT * FROM assigned_strengths JOIN strengths ON strengths.strength_id=assigned_strengths.strength_id WHERE sid='010517091' ORDER BY assigned_strength_id ASC`, (err, rows)=>{ 
    //         console.log('-----------------------------------------------------')
    //         console.log(err)
    //         console.log(rows)
    //     })
    // })
    // db.serialize(function(){
    //     db.all(`SELECT * FROM class_sections JOIN class_list ON class_list.class_id=class_sections.class_id JOIN subject_list ON subject_list.subject_id=class_list.subject_id ORDER BY subject_list.subject ASC, class_list.number ASC `, (err, rows)=>{ 
    //         console.log('-----------------------------------------------------')
    //         console.log(err)
    //         console.log(rows)
    //     })
    // })
    
    

})

//db.close();