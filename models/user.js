/** User class for message.ly */
const ExpressError = require("../expressError");
let client = require('../db'); //this should be equal to db
const jwt = require("jsonwebtoken");
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config");
const bcrypt = require('bcrypt');

/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {
    try{
    
      let date = new Date();
      let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
      //if the username is already taken it will trigger an error
      const result = await client.query(
        `INSERT INTO users (username, 
                            password, 
                            first_name, 
                            last_name, 
                            phone, 
                            join_at 
                            ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING username, password, first_name, last_name, phone, join_at, last_login_at`,
        [username, hashedPassword, first_name, last_name, phone, date]);
        this.updateLoginTimestamp(username);
      // RETURNING username, password, first_name, last_name, phone, join_at, last_login_at`,
      return result.rows[0];
    }
    catch(e){
        throw new ExpressError(`The username ${username} is already taken`, 422);
     }
  }


  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticateUser(username, password) { 
    try{
      const result = await client.query(
      `SELECT username, password FROM users WHERE username=$1`, 
      [username]);
      let output = await result.rows[0].password === password;
      return output;
    }
    catch(e){
      throw new ExpressError(`No match username/password`, 400);
    }
  }
    //in the middleware I'll have to use a .then() method because this function will return a promise
    /** Update last_login_at for user */
    
  static async updateLoginTimestamp(username) { 
       let date = new Date();
       const update = await client.query(
         `UPDATE users SET last_login_at=$2 WHERE username=$1
         RETURNING username`,
         [username, date]);
   
  }

  static async authenticate(username, password){
    
      const hashedPassword = await client.query(
        `SELECT password FROM users WHERE username=$1`, 
        [username]);
      if (hashedPassword.rows[0].password != undefined){
        let result = await bcrypt.compare(password, hashedPassword.rows[0].password);  
        if(result === true){
          await this.updateLoginTimestamp(username);
          return result;
          }
      }
      return false;
    }
  
  
  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { 
    let allUsers = await client.query(
      `SELECT username, first_name, last_name, phone FROM users`
    )
    return allUsers.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { 
    let user = await client.query(
      `SELECT username, 
              first_name, 
              last_name, 
              phone, 
              join_at, 
              last_login_at 
      FROM users
      WHERE username=$1`,[username]
    );

    if(user.rows.length === 0){
      throw new ExpressError(`Theres no current username that matches the criteria. Username: ${username}`, 400);
    }

    return user.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { 
    let messages = await client.query(
      `SELECT id, 
              users.username, 
              users.first_name, 
              users.last_name, 
              users.phone, 
              body, 
              sent_at, 
              read_at
        FROM messages
        JOIN users ON (messages.to_username = users.username)
        WHERE from_username=$1`,
        [username]);
    if(messages.rows.length === 0){
      throw new ExpressError(`Theres no current username that matches the criteria. Username: ${username}`, 400);      
    }

    function nestedJSON(m){
      return {
        id:m.id,
        to_user:{
          username:m.username,
          first_name:m.first_name,
          last_name:m.last_name,
          phone:m.phone,
        },
        body:m.body,
        sent_at:m.sent_at,
        read_at:m.read_at
      }
    }


    return messages.rows.map(m =>nestedJSON(m));
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    let messages = await client.query(
      `SELECT id, 
              users.username, 
              users.first_name, 
              users.last_name, 
              users.phone, 
              body, 
              sent_at, 
              read_at
        FROM messages
        JOIN users ON (messages.from_username = users.username)
        WHERE to_username=$1`,
        [username]);
    if(messages.rows.length === 0){
      throw new ExpressError(`Theres no current username that matches the criteria. Username: ${username}`, 400);      
    }
    function nestedJSON(m){
      return {
        id:m.id,
        from_user:{
          username:m.username,
          first_name:m.first_name,
          last_name:m.last_name,
          phone:m.phone,
        },
        body:m.body,
        sent_at:m.sent_at,
        read_at:m.read_at
      }
    }
    return messages.rows.map(m =>nestedJSON(m));
   }
}


module.exports = User;