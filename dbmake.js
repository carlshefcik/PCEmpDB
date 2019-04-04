/**
 * Creates the db is not made and creates tables and relationships if not created already
 */
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database("Employee.db")

//will have to make 4 tabes every semester, probably store the table names in the semester_overview so we dont have to build them.

db.serialize(function(){
    //semester_list
    db.run('CREATE TABLE IF NOT EXISTS semester_list (semester_id INTEGER PRIMARY KEY AUTOINCREMENT, semester varchar(5), year NUMBER(4), emp_tbl_name TEXT, tutor_tbl_name TEXT, mentor_tbl_name TEXT, si_tbl_name TEXT)')
    //semester_summary has a summary of info on that specific semester
    db.run('CREATE TABLE IF NOT EXISTS semester_summary (semester_id INTEGER PRIMARY KEY AUTOINCREMENT, semester varchar(5), year NUMBER(4), emp_tbl_name TEXT, tutor_tbl_name TEXT, mentor_tbl_name TEXT, si_tbl_name TEXT)')
    
    //employees table just holds all the info for every employee that has been at peer connections. (maybe also some info from)
    db.run('CREATE TABLE IF NOT EXISTS employees (person_id INTEGER PRIMARY KEY AUTOINCREMENT, sid TEXT, last_name TEXT, first_name TEXT, employed INTEGER)')
    //this is a semester specific table that holds info on the semetser, points to other tables but only semester_overview table points to it
    //phone number?
    //I think I will have to have the training levels all in here.
    db.run('CREATE TABLE IF NOT EXISTS employees_spring_2019 (person_id INTEGER PRIMARY KEY AUTOINCREMENT, sid TEXT, last_name TEXT, first_name TEXT, preferred_name TEXT, pronouns INTEGER, email TEXT, shirt_size INTEGER, grad_date TEXT, major TEXT, college TEXT, undergrad INTEGER, international INTEGER, role INTEGER, semester_start TEXT, hire_status TEXT, schedule_sent INTEGER, evc_date TEXT, pay_rate TEXT, leave_date TEXT, leave_reason TEXT, training_levels TEXT, certifications TEXT, courses TEXT, languages TEXT, strengths TEXT, special_interests TEXT)')
    //pronouns: 0=other, 1= male, 2=female
    //shirt size: 0 1 2 3 4 5 6 7 8 
    //undergrad: 0 1
    //international: 0 1
    //role: 0 1 2 3
    //schedule_sent: 0 1




    // //tutor_classes table
    // db.run('CREATE TABLE IF NOT EXISTS tutor_classes (person_id INTEGER PRIMARY KEY AUTOINCREMENT, last_name varchar(255), first_name varchar(255))')
    // db.run('CREATE TABLE IF NOT EXISTS tutor_classes_spring_2019 (person_id INTEGER PRIMARY KEY AUTOINCREMENT, last_name varchar(255), first_name varchar(255))')

    // //mentor_classes table
    // db.run('CREATE TABLE IF NOT EXISTS mentor_classes (person_id INTEGER PRIMARY KEY AUTOINCREMENT, last_name varchar(255), first_name varchar(255))')
    // db.run('CREATE TABLE IF NOT EXISTS mentor_classes_spring_2019 (person_id INTEGER PRIMARY KEY AUTOINCREMENT, last_name varchar(255), first_name varchar(255))')

    // //si_classes table
    // db.run('CREATE TABLE IF NOT EXISTS si_classes (person_id INTEGER PRIMARY KEY AUTOINCREMENT, last_name varchar(255), first_name varchar(255))')
    // db.run('CREATE TABLE IF NOT EXISTS si_classes_spring_2019 (person_id INTEGER PRIMARY KEY AUTOINCREMENT, last_name varchar(255), first_name varchar(255))')


    // insert command
    db.run('INSERT INTO employees (sid, last_name, first_name, employed) VALUES ("010517091", "Shefcik", "Carl", 1)')
    db.run('INSERT INTO employees_spring_2019 (sid, last_name, first_name, preferred_name, pronouns, email, shirt_size, grad_date, major, college, undergrad, international, role, semester_start, hire_status, schedule_sent, evc_date, pay_rate, leave_date, leave_reason, training_levels, certifications, courses, languages, strengths, special_interests) VALUES ("010517091", "Shefcik", "Carl", "Carl", 1, "carl.shefcik@sjsu.edu", 2, "Spring 2020", "Software Engineering", "Engineering", 1, 0, 0, "Fall 2017", "Good?", "1", "date format", "14", "", "", "SI level 2", "", "array pointing to class ids", "English", "strengths", "memes")')

    // delete command
    // db.run('DELETE FROM Employees')

    db.all('SELECT * FROM employees', (err, rows)=>{
        console.log(rows)
    })
    db.all('SELECT * FROM employees_spring_2019', (err, rows)=>{
        console.log(rows)
    })
})

db.close();