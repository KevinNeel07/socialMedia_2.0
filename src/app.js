import express from 'express';
const app = express();
import dotenv from 'dotenv';

dotenv.config();
import { fileURLToPath } from 'url';
import path, { dirname } from 'path'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const views_Path = path.join(__dirname, "../public/views");

// const __filename = fileURLToPath('../public');

// 👇️ "/home/john/Desktop/javascript"
// const __dirname = path.dirname(__filename);
// console.log('directory-name 👉️', __dirname);

const PORT = 5000 || process.env.port;

import user from './routes/user.js';

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}));
app.set('views', views_Path)

app.use(express.static('./public'));


import db_Conn from './db_Conn/db_Conn.js'
db_Conn();

import {loginPage, loginUser, signUpPage, signUp_User, getPasswordPage, sendVerificationMail, changePasswordPage, changePassword} from './controllers/auth/auth.js'

app.get('/', loginPage);
app.post('/', loginUser);
app.get('/signUp', signUpPage);
app.post('/signUp', signUp_User)
app.get('/forgetPassword', getPasswordPage)
app.post('/forgetPassword', sendVerificationMail)
app.get('/changePassword/:userID', changePasswordPage)
app.post('/changePassword/:userID', changePassword)

app.use('/user', user)

app.listen(PORT, ()=>{
    console.log(`Server is running at port:${PORT}`);
})