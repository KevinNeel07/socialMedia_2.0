import express from 'express'
const user = express.Router();

import { getUsers, sendRequest, getPendingRequests, get_All_friends, accept_User_Req, blockUser, unblockUser } from '../controllers/user/user.js';

user.get('/:id/pendingRequests', getPendingRequests)
user.get('/:id', getUsers)
user.get('/:id/friendList', get_All_friends)
user.post('/sendReq/:userID/:reqID', sendRequest)
user.post('/acceptReq/:userID/:acceptID', accept_User_Req)
user.post('/blockUser/:userId/:blockId', blockUser)
user.post('/unblockUser/:userId/:blockId', unblockUser)

export default user;