const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  
  module.exports = router;
  