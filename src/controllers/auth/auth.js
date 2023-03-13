import User from '../../models/User.js'
import bcrypt from 'bcryptjs';
import { application } from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export const loginPage = async (req, res) => {
    try {
        res.status(200).render('index')
    } catch (error) {
        console.log(error);
    }
}

export const getPasswordPage = async (req, res) => {
    try {
        res.status(200).render('forgetPassword')
    } catch (error) {
        console.log(error);
    }
}


export const loginUser = async (req, res) => {
    try {
        let data = req.body;
        const user = await User.findOne({ email: data.email }).lean();
        if (!user) {
            return res.status(409).send('Invalid Credentials');
        } else {
            let comfirmPass = await bcrypt.compare(data.password, user.password);
            if (comfirmPass) {
                res.status(200).redirect(`/user/${user._id}`)
            } else {
                return res.status(409).send('Invalid Credentials');
            }
        }

    } catch (error) {
        console.log(error);
    }
}

export const signUpPage = async (req, res) => {
    try {
        res.status(200).render('signUp')
    } catch (error) {
        console.log(error);
    }
}

export const signUp_User = async (req, res) => {
    try {
        let data = req.body;
        console.log(data);
        const user = await User.findOne({ email: data.email }).lean();
        if (user) {
            return res.status(409).send('User Alrady Exist!');
        } else if (data.password === data.confirmPassword) {
            let hashedPassword = await bcrypt.hash(data.password, 10)
            console.log(hashedPassword);
            const saveUser = await User.create({ name: data.name, email: data.email, password: hashedPassword, friendList: [] });
            saveUser.save();
            res.status(201).redirect('/');
        }
    } catch (error) {
        console.log(error);
    }
}


export const sendVerificationMail = async (req, res) => {
    try {
        const email = req.body.email;
        console.log(process.env.GMAIL);
        console.log(process.env.PASSWORD);
        const user = await User.findOne({ email: email }).lean();
        if (!user) {
            res.status(409).send('User does not exist!')
        } else {
            console.log(user._id);
            let accessToken = jwt.sign(email, process.env.JWTKEY);
            const url = `http://localhost:8000/changePassword/${user._id}?accesstoken=${accessToken}`;

            const sendMail = (res, options) => {
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.GMAIL,
                        pass: process.env.PASSWORD,
                    }
                })

                transporter.sendMail(options, (err, info) => {
                    console.log(options);
                    console.log('sendMial');
                    if (err) {
                        console.log(err);
                        return
                    }
                    console.log('Mail send Successfully');
                    return res.status(200).send('Mail sent Successfully')
                })
            }

            const options = {
                from: process.env.GMAIL,
                to: email,
                subject: 'Password Chage',
                html: `<h1>Password Change</h1>
                       <a href="${url}">Verify</a>`
            }

            sendMail(res, options);

        }


    } catch (error) {
        console.log(error);
    }
}

export const changePasswordPage = async (req, res) => {
    try {
        res.status(200).render('changePassword')
    } catch (error) {
        console.log(error);
    }
}

export const changePassword = async (req, res) => {
    try {
        const id = req.params.userID;
        const accessToken = req.query.accesstoken;

        const user = await User.findOne({ id: id }).lean()
        const verifyToken = jwt.verify(accessToken, process.env.JWTKEY);
        if (!user || !verifyToken) {
            return res.status(409).send('Invalid User!');
        } else {
            const credentials = req.body;
            console.log(credentials);
            if (credentials.password !== credentials.confirmPassword) {
                return res.status(409).send('Password not matched!');
            } else {
                const newHashPassowrd = await bcrypt.hash(credentials.password, 10);
                console.log(newHashPassowrd);
                const updatedPassword = await User.findByIdAndUpdate({ _id: id }, { password: newHashPassowrd });
                res.redirect('/');
            }
        }

    } catch (error) {
        console.log(error);
    }
}