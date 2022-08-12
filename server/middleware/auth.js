const { User } = require("../models/User");


let auth = (req,res,next) => {

    //인증 처리를 하는곳

    //Get Token in Client cookie 
    let token = req.cookies.x_auth;

    // after decrypt Token, find User
    User.findByToken(token, (err,user) =>{
        if(err) throw err;
        if(!user) return res.json({isAuth:false,error:true})

        req.token = token;
        req.user = user;
        next();
    })

    //if user auth okay

    //!user auth no
}

module.exports = {auth};