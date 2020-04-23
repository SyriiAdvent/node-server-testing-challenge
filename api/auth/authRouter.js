const router = require('express').Router();
const bcrypt = require('bcrypt');
const Users = require('../users/usersmodel');
const jwt = require('jsonwebtoken');
const secrets = require('../utils');

router.post('/register', (req, res) => {
  const user = req.body;
  const rounds = process.env.HASH_ROUNDS || 10
  const hash = bcrypt.hashSync(user.password, +rounds)
  user.password = hash

  Users.add(user)
    .then(([addedUser]) => {
      console.log(addedUser)
      res.status(201).json(addedUser)
    })
    .catch(err => res.status(500).json({ errorMessage: `Internal server error`, err }))
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      if(user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)
        res.status(200).json({ message: `Permitted Access.`, token });
      } else {
        res.status(401).json({ message: `Unauthorized Access, please login.` })
      }
    })
    .catch(err => res.status(500).json({ errorMessage: `Internal server error`, err }))
});

module.exports = router;

function generateToken(user) {
  // the data
  const payload = {
    userId: user.id,
    username: user.username,
  };
  const secret = secrets.jwtSecret;
  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}