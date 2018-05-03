const express = require('express')
const app = express()
// var router = express.Router();
const {router} = require('./controllers/api')
require('dotenv').config();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// authen header token 
// req.headers.authorization===users[i].token
// app.get('/api/users', require('./middlewares/auth.js'));
// app.put('/api/users', require('./middlewares/auth.js'));
// get user curent
// app.use('/api', require('./controllers/api.js')(router)); // => goi controller  ./controllers/api.js

app.use('/api', router); // => goi controller  ./controllers/api.js

// app.get()

app.listen(process.env.POST,()=>console.log("run with mongoo on post " + process.env.POST ))