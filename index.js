const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const {User} = require('./models/User')

const config = require('./config/key')
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')

mongoose.connect(config.mongoURI,{
    useNewUrlParser : true, useUnifiedTopology:true
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/',(req,res) => res.send('Hello World 123'))

app.post('/register',(req,res)=> {
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

app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))