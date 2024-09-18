const express = require('express');

const router = express.Router();

router.get('/', (req, res)=>{
    return res.status(200).send(JSON.stringify({ message: "Hello Mail!!", success: true }));
})

module.exports = router;