import mongoose from "mongoose";

const block_User_Schema = mongoose.Schema({
    _id:{
        type:String
    },
    count:{
        type: Number
    }
})

const Block_User = mongoose.model('blockedUser', block_User_Schema);

export default Block_User;