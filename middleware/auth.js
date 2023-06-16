/** Middleware for handling req authorization for routes. */
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");
// const { response } = require('../app');

/** Middleware: Authenticate user. */

//I created this function, I'm not quite sure what's suppose to happen



/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */


async function registerUser(req, res, next){
  try{    
    const result = await User.register(req.body);
    const  username  = { username:result.username};
    const token = jwt.sign(username, SECRET_KEY);
    return res.status(200).json({token});
  }
  catch(e){ 
    return next(e);
  }
}

function authenticateJWT(req, res, next) {
  try {
    
    const tokenFromBody = req.body._token;
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
    
    User.updateLoginTimestamp(payload.username);
    req.user = payload; // create a current user that can be access in every route handler
    
    return next();
  } catch (err) {
    return next();
  }
}

async function logInUser(req, res, next){
  //receive user and password, and should return a token
  try{
    let result = await User.authenticate(req.body.username, req.body.password);
    if(result){
      const  username  = { username:req.body.username};
      req.user = username;
      return next();
    }
    else {
      return next({ status: 400, message: "Unauthorized" });
    } 
  }catch(e){
    
    return next({status: 400, message: "Not matching password/username"});
  }
}
/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  
  if (!req.user) { //if req.user is not here, means that there is no auth
    return next({ status: 401, message: "Unauthorized" });
  } else {
    return next();
  }
}
/** Middleware: Requires correct username. */

function ensureCorrectUser(req, res, next) {
  try {
    
    if (req.user.username === req.body.username) {
      const token = jwt.sign(req.user, SECRET_KEY);
      return res.status(200).json({token});
      
    } else {
      return next({ status: 401, message: "Unauthorized" });
    }
  } catch (err) {
    return next({ status: 401, message: "Unauthorized" });
  }
}

function ensureSameUser(req, res, next){
  try{
    if (req.user.username === req.params.username) {
      return next();
    }
    else{
      return next({ status: 401, message: "Unauthorized" });
    }
    


  }catch(e){
    return next({ status: 401, message: "Unauthorized" });
  }
}

// end

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  registerUser,
  logInUser, 
  ensureSameUser
};
