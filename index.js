const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const {User} = require('./models/User');
const config = require('./config/key');

// application/x-www-form-urlencoded 파일을 분석해서 가져온다.
app.use(bodyParser.urlencoded({extended: true}));
// application/json 파일을 분석해서 가져온다.
app.use(bodyParser.json())


mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected..'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World 안녕하세요 반갑습니다'))

app.post('/register', (req,res) => {
    // 회원 가입 할 대 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터베이스에 넣어준다.

    const user = new User(req.body)
    // req.body에 회원아이디와 비번 등 정보가 들어간다.
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err})     // 실패할 시
        return res.status(200).json({       // 성공할 시
            success:true
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}`))
// npm init -> npm install express --save -> npm install mongoose --save -> npm install body-parser --save -> npm install nodemon --save dev
// pacgage.json script 내에 "start": "node index.js",
// nodemon react의 데브 서버처럼 서버를 내리지 않아도 출력결과에 바로 적용되도록 하는 모듈이다
// script 내에 "backend" : "nodemon index.js"