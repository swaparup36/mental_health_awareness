const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getParentId = require('../middleware/parentmiddleware');
const db = require('../db');
require('dotenv');

const router = express.Router();

router.post('/signup', async(req, res)=>{
    try {
        const { first_name, middle_name, last_name, email, phone, password } = req.body;

        const queryText1 = "SELECT * FROM parents WHERE email = $1 OR phone = $2";
        const values1 = [email, phone];

        const checkResult = await db.query(queryText1, values1);
        const parent = checkResult.rows[0];


        if(parent){
            return res.status(501).send(JSON.stringify({ message: "Parent with this email or phone number aleady exists", success: false }));
        }

        const hassedPassword = await bcrypt.hash(password, 10);

        const queryText = "INSERT INTO parents (first_name, middle_name, last_name, email, phone, password) VALUES ($1, $2, $3, $4, $5, $6)";
        const values = [first_name, middle_name, last_name, email, phone, hassedPassword];

        const result = await db.query(queryText, values);

        return res.status(200).send(JSON.stringify({ message: "Parent account created successfully!!", success: true }));
    } catch (error) {
        console.log(error);
        return res.status(501).send(JSON.stringify({ message: "Something went wrong", error: error, success: false }));
    }

});

router.post('/login', async(req, res)=>{
    try {
        const { email, password } = req.body;

        const queryText = "SELECT * FROM parents WHERE email = $1";
        const values = [email];

        const result = await db.query(queryText, values);

        const parent = result.rows[0];

        if(!parent){
            return res.status(501).send(JSON.stringify({ message: "Parent with this email does not exists", success: false }));
        }

        const passwordMatched = bcrypt.compare(password, parent.password);

        if(passwordMatched){
            const data = {
                user:{
                    id: parent.id
                }
            }
            const authToken = jwt.sign(data, "b7YbDkovwO");

            return res.status(200).send(JSON.stringify({ message: "Parent account loggedin successfully!!", result: result.rows[0], authtoken: authToken, success: true }));
        }else{
            return res.status(501).send(JSON.stringify({ message: "Wrong password", success: false }));
        }

    } catch (error) {
        console.log(error);
        return res.status(501).send(JSON.stringify({ message: "Something went wrong", error: error, success: false }));
    }

});

router.post('/addchild', getParentId, async(req, res)=>{
    try {
        const { first_name, middle_name, last_name, email, phone, password, dob, academic_course, gender, location, academic_level, disability, disability_disease } = req.body;

        const queryText3 = "SELECT * FROM students WHERE email = $1 OR phone = $2";
        const values3 = [email, phone];

        const studentExistResult = await db.query(queryText3, values3);

        const existingStudent = studentExistResult.rows[0];

        if(existingStudent){
            return res.status(501).send(JSON.stringify({ message: "Student with this email or phone number aleady exists", success: false }));
        }

        const hassedPassword = bcrypt.hash(password, 10);

        console.log("dob: ", dob);
        console.log("dob: ", new Date(dob));
        const queryText = "INSERT INTO students (first_name, middle_name, last_name, email, phone, password, dob, academic_course, gender, location, academic_level, disability, disability_disease, parent_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)";
        const values = [first_name, middle_name, last_name, email, phone, hassedPassword, dob, academic_course, gender, location, academic_level, disability, disability_disease, req.id];
        
        const createChildResult = await db.query(queryText, values);

        const queryText4 = "SELECT * FROM students WHERE email = $1";
        const values4 = [email];

        const getChildResult = await db.query(queryText4, values4);
        const newChild = getChildResult.rows[0];

        const queryText1 = "SELECT * FROM parents WHERE id = $1";
        const values1 = [req.id];

        const parentResult = await db.query(queryText1, values1);
        const oldChildren = parentResult.rows[0].children;
        let newChildren = [];

        if(oldChildren){
            newChildren = JSON.parse(oldChildren);
            newChildren.push(newChild.id);
        }else{
            newChildren = [newChild.id];
        }

        const queryText2 = "UPDATE parents SET childrens = $1 WHERE id = $2";
        const values2 = [JSON.stringify(newChildren), req.id];

        const updateParentResult = db.query(queryText2, values2);

        return res.status(200).send(JSON.stringify({ message: "Child Added", newChildrens: newChildren, success: true }));
    } catch (error) {
        console.log(error);
        return res.status(501).send(JSON.stringify({ message: "Something went wrong", error: error, success: false }));
    }
});

router.post('/deletetable', async(req, res)=>{
    try {
        const result = db.query("DROP TABLE parent");
        return res.status(200).json({ message: "table dropped" });
    } catch (error) {
        console.log(error);
        return res.status(501).json({ error: error })
    }
});


module.exports = router;