const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const {auth} = require('./middleware/auth')
const {User} = require('./models/User')

const config = require('./config/key')
//application/x-www-form-urlencoded  
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')

mongoose.connect(config.mongoURI,{
    useNewUrlParser : true, useUnifiedTopology:true
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/',(req,res) => res.send('Hello World 123'))

app.get('/hello',(req,res) => res.send('Hello World 123111'))

app.post('/users/register',(req,res)=> {
    //회원가입 위한 정보 client 에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body)

    //회원정보를 저장이 잘되었는가?
    user.save((err,userInfo)=>{
        if(err) return res.json({success:false,err})
        return res.status(200).json({
            success:true
        })
    })

})

app.post('/users/login',(req,res)=>{
    //요청된 이메일을 데이터베이스에서 찾기
    console.log("login")
    User.findOne({email:req.body.email},(err,user)=>{
        
        if(!user){
            return res.json({
                loginSuccess :false,
                message : "이메일이 일치하는 유저가 없습니다."
            })
        }
        //요청한 이메일이 있다면 비밀번호가 같은지 확인
        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch)
                return res.json({loginSuccess : false, message:"비밀번호가 틀렸습니다."})
            //비밀번호도 같다면 토큰을 생성        
            user.generateToken((err,user) =>{
                if(err) return res.status(400).send(err);

                //토큰을 저장한다. 어디에? 쿠키, 로컬 스토리지 ,...]
                //쿠키에 저장
                res.cookie("x_auth",user.token)
                .status(200)
                .json({loginSuccess : true, userID : user._id})
            })
        })
    })
})

app.get('/users/logout', auth, (req,res)=>{
    User.findOneAndUpdate({_id:req.user._id},
        {token:""}, (err, user)=>{
            if(err) return res.json({success:false, err});
            return res.status(200).send({
                success:true
            })
        })
})

app.get('/users/auth',auth,(req,res) =>{
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 True
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0? false : true,
        isAuth: true,
        email: req.user.email,
        name : req.user.name,
        lastname:req.user.lastname,
        role:req.user.role,
        image:req.user.image
    })
})





app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))


