const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength:50
    },
    email: {
        type: String,
        trim: true, //스페이스바를 지워주는 역할
        // unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname:{
        type: String,
        minlength:5
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next) {     // 유저정보를 저장하기전에 이 함수를 실행시킨다.
    let user = this;

    if(user.isModified('password')){
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)        //next를 해주면 바로 index.js에 user.save() 함수를 실행시킨다.
            bcrypt.hash(user.password, salt, function (err, hash) { // hash는 암호화된 인자이다
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})
userSchema.methods.comparePassword = function (plainPassword, cb) {

    // plainPassword 입력한 비밀번호와 DB에 저장된 암호화된 비밀번호가 서로 맞는지 확인
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if(err) return cb(err);
            cb(null, isMatch);
    })

}
userSchema.methods.generateToken = function (cb) {
    let user = this;
    // 제이슨토큰을 생성해서 이용하기
    let token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token
    // -> 'secretToken' -> user._id
    user.token = token
    user.save(function (err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function (token, cb) {
    let user = this;

    // user._id + '' = token
    // 토큰을 decode한다.
    jwt.verify(token, 'secretToken', function (err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function (err,user) {
            if(err) return cb(err)
            cb(null, user)
        })
    })
    
}
const User = mongoose.model('User', userSchema)

module.exports = { User }