const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const {User} = require('./models/User');
const {auth} = require('./middleware/auth');
const config = require('./config/key');
const cookieParser = require('cookie-parser');
// application/x-www-form-urlencoded 파일을 분석해서 가져온다.
app.use(bodyParser.urlencoded({extended: true}));
// application/json 파일을 분석해서 가져온다.
app.use(bodyParser.json())
app.use(cookieParser());

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected..'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World 안녕하세요 반갑습니다'))
app.get('/api/hello', (req, res) =>{
    res.send("안녕하세요!!!!")
})
app.post('/api/users/register', (req,res) => {
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
app.post('/api/users/login', (req,res) => {
    // 요청된 이메일을 데이터베이스에서있는지 찾는다
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user){      // 데이터베이스에 없다면
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) return res.json({
                loginSuccess: false,
                message: "비밀번호가 틀렸습니다."
            })
            // 비밀번호까지 맞다면 토큰을 생성하기.
            user.generateToken((err, user) =>{
                if(err) return res.status(400).send(err);

                // 토큰을 쿠키 또는 로컬스토리지에 저장한다.
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ 
                    loginSuccess: true,
                    userId : user._id
                })
            })
        })
    })
})

app.get('/api/users/auth',auth,(req,res) => {
    // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: rq.user.lastname,
        role: req.user.role,
        image: req.user.image 
    })
})
app.get('/api/users/logout', auth, (req, res) =>{
    User.findOneAndUpdate({_id: req.user._id},
        {token: ""},
        (err, user) => {
            if(err) return res.json({ success: false, err});
            return res.status(200).send({
                success: true
            })
        })
})
app.listen(port, () => console.log(`Example app listening on port ${port}`))
// npm init -> npm install express --save -> npm install mongoose --save -> npm install body-parser --save

// npm install nodemon --save dev
// pacgage.json script 내에 "start": "node index.js",
// nodemon react의 데브 서버처럼 서버를 내리지 않아도 출력결과에 바로 적용되도록 하는 모듈이다
// script 내에 "backend" : "nodemon index.js"

// npm install bcrypt --save
// bcrypt는 데이터를 암호화해주는 모듈이다

// npm i jsonwebtoken --save
// jsonwebtoken은 토큰을 생성해주는 모듈이다.

// npm i cookie-parser --save
// cookie-parser은 쿠키에 저장할 수 있게 해주는 모듈이다.

// npm i concurrently --save
// concurrently은 서버와 클라이언트가 동시에 작동되도록 도와주는 모듈이다.
// concurrently 링크 참조 : https://www.inflearn.com/course/%EB%94%B0%EB%9D%BC%ED%95%98%EB%A9%B0-%EB%B0%B0%EC%9A%B0%EB%8A%94-%EB%85%B8%EB%93%9C-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EA%B8%B0%EB%B3%B8/lecture/37086?tab=curriculum
// concurrently는 터미널경로가 루트 서버이여야 한다.