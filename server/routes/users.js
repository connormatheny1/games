const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/logout', async (req, res, next) => {
  const { username, rid, creator } = req.body;
  const update = 'update users set logged_in = false, room_id = 0 where username = $1'
  let deletedRoom = false;
  await db.query(update, [username])
    .then(async (response) => {
      if(creator){
        const deleteRoom = 'delete from rooms where rid = $1'
        await db.query(deleteRoom, [rid])
          .then(() => deletedRoom = true)
          .catch(err => console.log(err))
      }
      res.send({ loggedOut: true, res: response, deletedRoom })
    })
    .catch(err => console.log(err))
})

module.exports = router;
