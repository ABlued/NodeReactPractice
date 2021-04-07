const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://ablue:cookie1234@cluster0.c7f9u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected..'))
.catch(err => console.log(err))

app.get('/', (reeq, res) => res.send('Hello World'))

app.listen(port, () => console.log(`Example app listening on port ${port}`))
// npm init -> npm install express --save -> npm install mongoose --save
// pacgage.json script 내에 "start": "node index.js",