const express = require('express');
const router = new express.Router();
const authMiddleware = require('../middleware/auth');
// const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');



router.post('/login/',
                    authMiddleware.logInUser,
                    authMiddleware.ensureCorrectUser);

// 
/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
*
**/

router.post('/register', authMiddleware.registerUser);

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
module.exports = router;