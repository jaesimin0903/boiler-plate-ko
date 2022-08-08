const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://jaesimin:aA5535067!@boiler-plate.tymjh8t.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser : true, useUnifiedTopology:true
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/',(req,res) => res.send('Hello World'))

app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))