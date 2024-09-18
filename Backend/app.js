const express = require('express');
const cors = require('cors');
const parents = require('./routes/parents');
const students = require('./routes/students');
const caretaker = require('./routes/caretaker');
const admin = require('./routes/admin');
const mail = require('./routes/mail');
require('dotenv');

const PORT = 8080;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res)=>{
    return res.status(200).send(JSON.stringify({ message: "Hello!!", success: true }));
})

app.use('/parents', parents);
app.use('/students', students);
app.use('/caretaker', caretaker);
app.use('/admin', admin);
app.use('/mail', mail);


app.listen(PORT, ()=>console.log(`Server listening on PORT ${PORT}`));