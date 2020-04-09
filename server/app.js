const createError = require('http-errors');
const express = require('express');
const socket_io = require("socket.io");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)

const indexRouter = require('./routes/index')(io);
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter)

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

const rooms = {}

io.of('/crazy/rooms/').on('connection', (socket) => {
  
  console.log(`user connected, id=${socket.id}`)
  // socket.broadcast.emit("userConnected", { id: socket.id })
  socket.on('user-joined-room', (data) => {
    const { roomId, username } = data
    rooms[roomId] = { users: {} }
    socket.join(roomId)
    console.log(`roomid: ${roomId}`)
    rooms[roomId].users[socket.id] = username
    console.log(Object.keys(io.sockets.sockets))
    console.log(rooms)
    //console.log(io.of('/crazy/rooms').clients())
    //console.log(io.of('/crazy/rooms').clients(roomId))
    socket.emit('user-connected', {id: socket.id, room: rooms[roomId]})
  })

    
  socket.on("disconnect", (data) => {
    console.log(`user disconnect, id=${socket.id}`)
  })
  

})


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  //debug('Listening on ' + bind);
}


module.exports = app;
