/**
 * Creates the db is not made and creates tables and relationships if not created already
 */
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database("Employee.db")

//will have to make 4 tabes every semester, probably store the table names in the semester_overview so we dont have to build them.

db.serialize(function(){
    db.run('UPDATE employees_fall_2018 SET last_name=$last_name, first_name=$first_name, preferred_name=$preferred_name, pronouns=$pronouns, email=$email, phone_number=$phone_number, shirt_size=$shirt_size, grad_date=$grad_date, major=$major, college=$college, undergrad=$undergrad, international=$international, role=$role, semester_start=$semester_start, hire_status=$hire_status, schedule_sent=$schedule_sent, evc_date=$evc_date, pay_rate=$pay_rate, leave_date=$leave_date, leave_reason=$leave_reason, training_levels=$training_levels, certifications=$certifications, avg_hours_wk=$avg_hours_wk, courses=$courses, languages=$languages, strengths=$strengths, special_interests=$special_interests WHERE sid=$sid', {
        $last_name: "Shefcik", 
        $first_name: "Carl", 
        $preferred_name: "Carl", 
        $pronouns: 1, 
        $email: "carl.shefcik@sjsu.edu", 
        $phone_number: "619-846-3775",
        $shirt_size: 2, 
        $grad_date: "Spring 2020", 
        $major: "Software Engineering", 
        $college: "Engineering", 
        $undergrad:1, 
        $international: 0, 
        $role: 2, 
        $semester_start: "Fall 2017", 
        $hire_status: "Good?", 
        $schedule_sent: 1, 
        $evc_date: "date format", 
        $pay_rate: 15.75, 
        $leave_date: "5/23/2019", 
        $leave_reason: "New job", 
        $training_levels: "SI level 2", 
        $certifications:"", 
        $avg_hours_wk:"3.5", 
        $courses: "array pointing to class ids", 
        $languages:"English", 
        $strengths:"strengths", 
        $special_interests: "memes",
        $sid:"010517091"
    })

})

//db.close();