var jwt = require('jsonwebtoken');

const getParentId = (req, res, next)=>{
    const authToken = req.header('auth-token');
    if(!authToken){
        res.status(401).json({ message: "please provide a valid authentication token", success: false });
    }
    try {
        const data = jwt.verify(authToken, "b7YbDkovwO");
        req.id = data.user.id;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong", error: err, success: false });
    }
}

module.exports = getParentId;