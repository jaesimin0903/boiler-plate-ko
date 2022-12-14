const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type : String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true,
        unique: 1
    },
    password:{
        type: String,
        minlength: 5
    },
    lastname:{
        type: String,
        maxlength: 50
    },
    role :{
        type: Number,
        default: 0
    },
    image:String,
    token:{
        type: String
    },
    tokenExp:{
        type: Number
    }
})

//save 하기 전에 하는 행동 pre
userSchema.pre('save',function (next) {
    var user = this;

    //password 를 바꿀시에만 작동하게 그렇지않으면 다른 요소를 변경시에도 암호화 되기 때문
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds,function(err,salt){
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err,hash){
                if(err) return next(err)
                user.password = hash
                next()
            });
        }); 
    }else{
        next();
    }
    //salt 를 이용한 비밀번호 암호화
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainpassword 1234567     암호화된 비밀번호 ~ 
    bcrypt.compare(plainPassword, this.password, function(err,isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    //json webtoken 을 이용해서 토큰 생성하기
    var token = jwt.sign(user._id.toHexString(), 'jaeminToken')

    user.token = token;
    user.save(function(err,user) {
        if(err) return cb(err)
        cb(null, user)
    })

}

userSchema.statics.findByToken = function (token, cb){
    var user = this;

    //Decode Token

    jwt.verify(token, 'jaeminToken', function(err, decoded){
        //find User to use User_id 
        //Token in DB == Token in Client

        user.findOne({"_id" : decoded, "token":token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}


const User = mongoose.model('User',userSchema)

module.exports = {User} //User model exports for other files