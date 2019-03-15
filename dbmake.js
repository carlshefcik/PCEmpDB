/**
 * Creates the db is not made and creates tables and relationships if not created already
 */
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database("Employee.db")

db.serialize(function(){
    db.run('CREATE TABLE IF NOT EXISTS Employees (PersonID INTEGER PRIMARY KEY AUTOINCREMENT, LastName varchar(255), FirstName varchar(255))')
    
    // insert command
    db.run('INSERT INTO Employees (LastName, FirstName) VALUES ("Shefcik", "Carl")')

    // delete command
    // db.run('DELETE FROM Employees')

    db.all('SELECT * FROM Employees', (err, rows)=>{
        console.log(rows)
    })
})

db.close();