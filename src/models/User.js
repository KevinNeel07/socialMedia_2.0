import mongoose from "mongoose";

const user_Schema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    friendList:[{
        _id:{
            type:String
        }
    }],
    pendingRequest: [{
        _id: {
            type:String
        }
    }],
    sendReq:[{
        _id: {
            type:String
        }
    }],
    blockedId:[{
        _id:{
            type: String
        }
    }],
    blockCount:{
        type: Number,
        default: 0
    }
})

const User = mongoose.model('User', user_Schema);

export default User;