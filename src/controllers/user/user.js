import User from '../../models/User.js';

export const getUsers = async (req, res) => {
    try {
        let userId = req.params.id;
        console.log('inside user');
        const user_Owner = await User.findById({ _id: userId });
        console.log(user_Owner.id);
        const users = await User.find({
            _id: { $ne: userId }
        });


        if (user_Owner.blockCount >= 2) {
            res.status(409).send('You are Blocked please change the passworda')
        }

        res.status(200).render('userProfile', { user_Owner: user_Owner, usersDetails: users })
    } catch (error) {
        console.log(error);
    }
}

export const sendRequest = async (req, res) => {
    try {
        let userID = req.params.userID;
        let reqID = req.params.reqID;
        let sendReq = await User.findByIdAndUpdate({ _id: userID }, { $push: { sendReq: { _id: reqID } } })
        let pendingReq = await User.findByIdAndUpdate({ _id: reqID }, { $push: { pendingRequest: { _id: userID } } })

        res.status(200).redirect(`/user/${userID}`)

    } catch (error) {
        console.log(error);
    }
}

export const getPendingRequests = async (req, res) => {
    try {
        let userList = [];
        let userID = req.params.id;
        let user = await User.findById({ _id: userID });
        console.log('working')

        // user.pendingRequest.forEach(async(req)=>{
        //     let userDetails = await User.findById({_id: req._id})
        //     console.log(userDetails, ' User Details');

        //     usersList.push(userDetails.name, userDetails.email)
        //     console.log(usersList);
        // })
        for (var i of user.pendingRequest) {
            let userDetails = await User.findById({ _id: i._id })
            i = {
                id: userDetails.id,
                name: userDetails.name,
                email: userDetails.email
            }
            userList.push(i);
        }

        res.status(200).render('pendingReq', { userID: userID, userList: userList })
    } catch (error) {
        console.log(error);
    }
}

export const accept_User_Req = async (req, res) => {
    try {
        let userID = req.params.userID
        let acceptID = req.params.acceptID
        console.log(acceptID);

        const addUser = await User.findByIdAndUpdate({ _id: userID },
            { $push: { friendList: { _id: acceptID } } },
            { new: true })

        const removeUser = await User.findByIdAndUpdate({ _id: userID },
            { $pull: { pendingRequest: { _id: acceptID } } },
            { new: true })


        const addInSender = await User.findByIdAndUpdate({ _id: acceptID }, {
            $push: {
                friendList: {
                    _id: userID
                }
            }
        })

        const removeFromSender = await User.findByIdAndUpdate({ _id: acceptID }, {
            $pull: {
                sendReq: {
                    _id: userID
                }
            }
        })
        res.status(200).redirect(`/user/${userID}`)
        console.log(updatedUser);

    } catch (error) {
        console.log(error);
    }
}

export const blockUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const blockId = req.params.blockId;

        const userExist = await User.findOne({ id: userId }).lean();
        const blockUser = await User.findOne({ id: blockId }).lean();

        if (!userExist || !blockUser) {
            return res.status(409).send('Invalid ID');
        } else {
            const updateUser = await User.findByIdAndUpdate({ _id: userId }, { $push: { blockedId: { _id: blockId } } })
            const updatedBlockUser = await User.findByIdAndUpdate({ _id: blockId }, { $inc: { blockCount: 1 } });
            res.status(200).redirect(`/user/${userId}`);
        }


    } catch (error) {
        console.log(error);
    }
}

export const get_All_friends = async (req, res) => {
    try {

        let userFrnds = [];
        const userID = req.params.id;

        const user = await User.findOne({ _id: userID }).lean();
        console.log(user.friendList);
        console.log('---------------------');
        const abc = await User.find({ _id: { $in: [...user.friendList] } });

        console.log(abc);

        // for(var i of user.friendList){

        //     let user 

        // }


    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

export const unblockUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const blockId = req.params.blockId;
        const user = await User.findOne({ _id: userId }).lean();
        const blockUser = await User.findOne({ _id: blockId }).lean();
        if (!user || !blockUser) {
            res.status(404).send("Invalid ID's");
        } else {
            console.log('adf');
            const updatedUser = await User.findByIdAndUpdate({ _id: userId }, {
                $pull: {
                    blockedId: { _id: blockId }
                }
            });
            const updatedBlockedUser = await User.findByIdAndUpdate({ _id: blockId }, {
                $inc: {
                    blockCount: -1
                }
            })
            res.status(200).redirect(`/user/${userId}`);
        }
    } catch (error) {
        console.log(error);
    }
}