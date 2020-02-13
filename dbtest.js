/**
 * Creates the db is not made and creates tables and relationships if not created already
 */
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database("Employee_testing.db")

//will have to make 4 tabes every semester, probably store the table names in the semester_overview so we dont have to build them.

db.serialize(function(){


    db.serialize(function(){
        db.all(`SELECT * FROM class_sections`, (err, rows)=>{ 
            console.log('-----------------------------------------------------')
            console.log(err)
            console.log(rows)
        })
    })

})