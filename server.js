let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
const req = require('express/lib/request');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/',(req,res)=> {
    return res.send({
        error : false,
        wrirtten_by : 'krit'
    })
})

// Database connection 
let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '56070501237',
    database: 'covid19'
})
dbCon.connect();

app.get('/Patient',(req, res)=>{
    dbCon.query('SELECT * FROM patient',(error,results,fields)=>{
        if (error) throw error; 

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "No pateint information"
        } else{
            message = "Successfully retrived data"
        }

        return res.send({error : false, data: results, message: message})
    })
})

app.post('/Patient/regis',(req, res)=>{
    let IDnumber = req.body.IDnumber
    let name     = req.body.name
    let surname  = req.body.surname
    let sex      = req.body.sex
    let age      = req.body.age
    let province = req.body.province
    let district = req.body.district
    let phone    = req.body.phone.toString()
    let email    = req.body.email

    if (!IDnumber || !name ) {
        return res.status(400).send({error:true,message: "please fill name and ID number"})
    } else{
        dbCon.query("INSERT INTO patient (IDnumber, name, surname, sex, age, province, distritct, phone, email) VALUES (?,?,?,?,?,?,?,?,?)",
        [IDnumber,name,surname,sex,age,province,district,phone,email], (error, results,fields) =>{
            if (error) throw error;
            return res.send({error:false, data:results,message: "patient successfully register"})       })
    }
})

app.listen(3000,()=>{
    console.log('Node App is running on port 3000')
})

module.exports = app;