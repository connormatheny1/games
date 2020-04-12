const express = require('express');
const socketIO = require("socket.io");

const app = express();
const server = require("http").Server(app);
const io = socketIO(server)

var port = process.env.PORT || '5000';
app.set('port', port);

const db = require('./db');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//const indexRouter = require('./routes/index')(io);
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api')

app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

//app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter)



const rooms = { }

/* GET home page. */
app.get('/', async (req, res, next) => {
  const query = 'select rooms.rid, rooms.room_name, users.username, users.room_id from rooms inner join users on rooms.rid = users.room_id';
  await db.query(query)
    .then(res => console.log(res))
    .catch(err => console.log(err))
});

// app.get('/crazy/rooms', async (req, res, next) => {
//   const selectQuery = 'select * from rooms order by created_at desc';
//   const result = await db.query(selectQuery)
//   if(result.rows.length){
//     const query = 'SELECT r.rid, COUNT(u.uid) FROM rooms r, users u WHERE r.rid = u.room_id GROUP BY r.rid;'
//     const qres = await db.query(query)
//     res.send({exists: true, rows: result.rows, rid: result.rows[0].rid, roomName: result.rows[0].room_name, creator: result.rows[0].creator, createdAt: result.rows[0].created_at, join: qres})
//   }
//   else{
//     res.send({exists: false})
//   }
// })

app.post('/crazy/createRoom', async (req, res, next) => {
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

app.post('/crazy/joinRoom', async (req, res, next) => {
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

//create room
app.post('/crazy/rooms', (req, res) => {
  if(rooms[req.body.room] != null){
    return res.redirect("/")
  }
  rooms[req.body.room] = { users: {} }
  //res.redirect(`/crazy/rooms/${req.body.room}`)
  res.status(200).send({roomCreated: true})
  io.emit('room-created', req.body.room)
  //send mesg new room created
})

app.get('/crazy/rooms/:room', (req, res) => {

})

/**
 * 
 app.get('/crazy/rooms/:room', (req, res) => {
  if(rooms[req.params.room] == null){
    return res.status(400).send({roomExists: false, message: `The room you tried to join, ${req.params.room}, does not currently exist. Maybe it was closed. Maybe it was never created. I don't know. This is on you. Create fuckin ${req.params.room} I don't give a shit. Have it be the most popular shit this goof ass site has ever seen. Hell, have it break. Have this room, this this this fuggin ${req.params.room} literally burn me to the ground. I fuckin dare you. I'll even give you a link to the page. Holy screech batman ill even let you create your precious ${req.params.room} right here, right in whatever the fuck this is in rn. Are you having second thoughts about the room name. ${req.params.room}. There it is. In all its ${req.params.room}-y glory. I've already filled it in for you but go ahead and change it if you want, that is, if you can lol.`})
  }
  io.emit()
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
 */



io.of("/crazy/rooms").on('connection', (socket) => {
  socket.on('user-on-rooms', (data) => {
    console.log(`User logged in, username: ${data}, socket id=${socket.id}`)
  })

  socket.on('new-user', (room, username) => {
    socket.join(room)
    rooms[room].users[socket.id] = username
    socket.to(room).emit('user-connected', name)
    console.log(rooms)
  })
  
  socket.on('send-chat-message', (room, message) => {
    socket.to(room).emit('chat-message', { message: message, username: rooms[room].users[socket.id] })
  })
   
  socket.on("disconnect", () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).emit('user-disconnected', rooms[room].users[socket.id])
      delete users[socket.id]
    })
    console.log(`user disconnected, id=${socket.id}`)
  })

  function getUserRooms(socket){
    return Object.entries(rooms).reduce((names, [name, room]) => {
      if(room.users[socket.id] != null){
        names.push(name)
      }
      return names
    }, [])
  }
})

server.listen(port, () => console.log(`Listening on port ${port}`));