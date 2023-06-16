const User = require('../models/user');
const Message = require('../models/message');
const jwt = require("jsonwebtoken");
const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");


async function getMessageDetail(req, res, next){
    try{
        const result = await Message.get(req.params.id);
        console.log('result', result, 'result.rows', result.rows);
        
        //Make sure that the currently-logged-in users is either the to or from user.
        //So we need to work on auth in here, right?
        return res.status(200).json(result);
    }
    catch(e){
        return next(e);
    }


}


async function registerUser(req, res, next){
    try{
      const result = await User.register(req.body)
      return res.status(201).json(result.rows[0]);
      }
      catch(e){ 
        return next(e);
        }
      }
  
module.exports = { getMessageDetail, registerUser };