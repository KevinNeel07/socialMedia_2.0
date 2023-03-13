import mongoose from 'mongoose';

const db_Conn = ()=>{
    mongoose.connect('mongodb://localhost:27017/API_User').then(()=>{
        console.log('Database Connection is SUccessfull');
    }).catch((error)=>{
        console.log(error);
    })
}

export default db_Conn;