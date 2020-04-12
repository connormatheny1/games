module.exports = function(){
  const express = require('express');
  const bcrypt = require('bcrypt');
  const db = require('../db');
  const router = express.Router();
  

  /* GET home page. */
  router.get('/', async (req, res, next) => {
    const query = 'select rooms.rid, rooms.room_name, users.username, users.room_id from rooms inner join users on rooms.rid = users.room_id';
    await db.query(query)
      .then(res => console.log(res))
      .catch(err => console.log(err))
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
      let error = {
        status: false,
        message: `Not all fields filled`
      }
      errors.push(error)
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
      //next()
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

  router.get('/crazy/rooms', async (req, res, next) => {
    const selectQuery = 'select * from rooms order by created_at desc';
    const result = await db.query(selectQuery)
    if(result.rows.length){
      const query = 'SELECT r.rid, COUNT(u.uid) FROM rooms r, users u WHERE r.rid = u.room_id GROUP BY r.rid;'
      const qres = await db.query(query)
      res.send({exists: true, rows: result.rows, rid: result.rows[0].rid, roomName: result.rows[0].room_name, creator: result.rows[0].creator, createdAt: result.rows[0].created_at, join: qres})
    }
    else{
      res.send({exists: false})
    }
  })

  router.post('/crazy/createRoom', async (req, res, next) => {
    const { roomName, displayName, username } = req.body
    const errors = []
    const selectQuery = 'select * from rooms where room_name = $1';
    const selectResult = await db.query(selectQuery, [roomName])
    if(selectResult.rows.length > 0){
      let error = {
        status: false,
        message: `Room with name '${roomName}' is already in use. Please choose a different name.`
      }
      errors.push(error)
    }
    if(!errors.length){
      const createQuery = 'insert into rooms (room_name, creator, created_at, updated_at) values ($1, $2, $3, $4) RETURNING rid'
      const currentDate = [new Date()]
      const insert = await db.query(createQuery, [roomName, username, currentDate, currentDate])
      if(insert.rows.length){
        console.log(insert.rows[0].rid)
        await db.query('update users set room_id = $1 where username = $2', [insert.rows[0].rid, username])
        res.send({status: true, rid: insert.rows[0].rid, message: `Room '${roomName}' created, adding you to it...`, creator: true})

      }
    }
  })

  router.post('/crazy/joinRoom', async (req, res, next) => {
    const { roomName, displayName, username } = req.body;
    const errors = []
    //if room exits
    const selectQuery = 'select * from rooms where room_name = $1';
    await db.query(selectQuery, [roomName])
      .then( async (response) => {
        const rid = response.rows[0].rid
        const updateQuery = 'update users set room_id = $1 where username = $2'
        const updateRes = await db.query(updateQuery, [rid, username])
        console.log(updateRes)
        if(updateRes.rows != null){
          res.send({rid: response.rows[0].rid, status: true, message: `Room '${roomName}' created, adding you to it...`, creator: false})
          //res.redirect(`/crazy/rooms/${roomName}`)
        }
        else{
          res.send({rid: response.rows[0].rid, status: true, message: `Room '${roomName}' created, adding you to it...`, creator: false})
        }
      })
      .catch(err => console.log(err))
    //commented was here
  })

  router.get('/crazy/rooms/:roomId', async (req, res) => {
    const { roomId } = req.params;
    const selectQuery = 'select * from rooms where rid = $1';
    const result = await db.query(selectQuery, [roomId])
    if(result.rows.length){
      const selectOthersQuery = 'SELECT u.username, u.socket_id, u.avatar, u.games_played, u.games_won, u.room_id FROM users u, rooms r WHERE u.room_id = r.rid AND u.room_id = $1;'
      const otherResult = await db.query(selectOthersQuery, [roomId])
      if(otherResult.rows.length){
        res.send({
          exists: true,
          rows: result.rows[0],
          users : otherResult.rows,
          room: req.params.roomId
        })
      }
      else{
        res.send({exists: true, rows: result.rows[0]})
      }  
    }
    else{
      res.send({exists: false})
    }
  })

  return router;
}


//module.exports = router;


// SELECT u.*
// FROM users u, rooms r
// WHERE u.room_id = r.rid AND u.room_id = $1;



//line142
//const query = 'select rooms.rid, rooms.room_name, users.username, users.room_id from rooms inner join users on rooms.rid = users.room_id';
    //const qres = await db.query(query)



    //how many people in room
// SELECT r.rid, COUNT(u.uid)
// FROM rooms r, users u
// WHERE r.rid = u.room_id
// GROUP BY r.rid;


//was in the post to /crazy/joinRoom where it says commented was here 155 rn
// if(selectResult.rows.length < 1){
  //   let error = {
  //     status: false,
  //     message: `Couldn't find room with name '${roomName}'. Either figure out what it is, or create a new one above.`
  //   }
  //   errors.push(error)
  // }
  // const rid = selectResult.rows[0].rid;
  //if user is already joined into this room for some reason
  //return and redirect
  // const selectQuery_ = 'select * from users where username = $1 AND room_id = $2';
  // const selectResult_ = await db.query(selectQuery_, [username, rid])
  // if(selectResult_.rows.length > 0){
  //   let error = {
  //     status: false,
  //     message: `User '${username}' has already joined room ${roomName}`
  //   }
    // errors.push(error)
    // res.redirect(`/crazy/rooms/${rid}`)
  //}
  
  // if(!errors.length){
  //   const updateQuery = 'update users set room_id = $1 where username = $2'
  //   const updateRes = await db.query(updateQuery, [rid, username])
  //   if(updateRes.rows.length > 0){
  //     console.log("foo")
  //     res.send({rid: selectResult.rows[0].rid, status: true, message: `Room '${roomName}' created, adding you to it...`, creator: false})
  //   }
  // }
  // else{
  //   res.send({ errors })
  // }