const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res, next) => {
  const { username, email, avatar, password, passwordConf } = req.body
  const usernameParam = [username]
  const emailParam = [email]
  const passParam = [password]
  const passConfParam = [passwordConf]
  const avatarParam = [avatar]
  const errors = []

  if(!(email && username && password && passwordConf && avatar)){
    if(!email){
      let error;
      error = {
        status: false,
        message: `email bad`
      }
      errors.push(error)
    }
    else if(!username){
      let error;
      error = {
        status: false,
        message: `Not all fields filled`
      }
      errors.push(error)
    }
    else if(!password){
      let error;
      error = {
        status: false,
        message: `password bad`
      }
      errors.push(error)
    }  
    else if(!passwordConf){
      let error;
      error = {
        status: false,
        message: `passwordConf bad`
      }
      errors.push(error)
    }  
    else if(!avatar){
      let error;
      error = {
        status: false,
        message: `avatar bad`
      }
      errors.push(error)
    }
  }

  if(password !== passwordConf){
    let error = {
      status: false,
      message: `Passwords didn't match`
    }
    errors.push(error)
  }

  const usernameQuery = 'select * from users where username = $1';
  const usernameResult = await db.query(usernameQuery, usernameParam)
  if(usernameResult.rows.length > 0){
    let error = {
      status: false,
      message: `Username '${username}' is already in use by someone, either be more creative or settle for a different username.`
    }
    errors.push(error)
  }

  const emailQuery = 'select * from users where email = $1';
  const emailResult = await db.query(emailQuery, emailParam)
  if(emailResult.rows.length > 0){
    let error = {
      status: false,
      message: `Email '${email}' is already in use by someone, use your hotmail if you have to.`
    }
    errors.push(error)
  }

  if(!errors.length){
    const insertQuery = 'insert into users (username, password, email, avatar) values ($1, $2, $3, $4)'
    const hashedPassword = await bcrypt.hash(password, 10);
    const params = [username, hashedPassword, email, avatar];
    await db.query(insertQuery, params)
      res.send({registered: true})
  }
  else{
    console.log(errors)
  }
})

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  const errors = []
  if(req.body.registered) console.log('wowowowow')
  const selectQuery = 'select * from users where username = $1';
  const selectResult = await db.query(selectQuery, [username]);
  if(selectResult.rows.length === 1){
    const auth = await bcrypt.compare(password, selectResult.rows[0].password)
    if(auth){
      await db.query('update users set logged_in = true where username = $1', [username])
        .then(async () => {
          const newQ = 'select * from users where username = $1';
          const newResult = await db.query(newQ, [username]);
          if(newResult.rows.length === 1){
            res.send({auth: auth, rows: newResult.rows[0]})
          }
        })
        .catch(err => console.log(err))
    }
    else{
      let error = {
        status: false,
        message: 'Login failed'
      }
      errors.push(error)
      res.send({errors})
    }
  }
})

router.post('/logout', async (req, res, next) => {
  const { username, rid, creator } = req.body;
  const update = 'update users set logged_in = false where username = $1'
  let deletedRoom = false;
  await db.query(update, [username])
    res.send({ loggedOut: true, deletedRoom })

})

module.exports = router;
