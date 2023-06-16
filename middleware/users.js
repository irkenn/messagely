const User = require('../models/user');
const Message = require('../models/message');
const jwt = require("jsonwebtoken");
const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");


async function getUsers(req, res, next){
    try{
        let result = await User.all();        
        return res.status(200).json(result);
    }
    catch(e){
        return next(e);
    }

}

async function getSingleUser(req, res, next){
    try{
        let result = await User.get(req.params.username);
        return res.status(200).json(result);

    }catch(e){
        return next(e);
    }
}

async function msgToUser(req,res,next){
    try{
        let result = await User.messagesTo(req.params.username);
        return res.status(200).json(result);
    }catch(e){
        return next(e);
    }
    
}

async function msgFromUser(req, res, next){
    try{
        let result = await User.messagesFrom(req.params.username);
        return res.status(200).json(result);
    }catch(e){
        return next(e);
    }
}

module.exports = { getUsers, getSingleUser, msgToUser, msgFromUser };