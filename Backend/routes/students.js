const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv');

const router = express.Router();

router.post('/login', async(req, res)=>{
    try {
        const { email, password }= req.body;

        const queryText = "SELECT * FROM students WHERE email = $1";
        const values = [email];

        const result = await db.query(queryText, values);
        
        const student = result.rows[0];

        if(!student){
            return res.status(501).send(JSON.stringify({ message: "Student with this email does not exists", success: false }));
        }

        const passwordMatched = bcrypt.compare(password, student.password);

        if(passwordMatched){
            const data = {
                user:{
                    id: student.id
                }
            }
            const authToken = jwt.sign(data, "b7YbDkovwO");

            return res.status(200).send(JSON.stringify({ message: "Student account loggedin successfully!!", result: student, authtoken: authToken, success: true }));
        }else{
            return res.status(501).send(JSON.stringify({ message: "Wrong password", success: false }));
        }

    } catch (error) {
        console.log(error);
        return res.status(501).send(JSON.stringify({ message: "Something went wrong", error: error, success: false }));
    }
});

module.exports = router;