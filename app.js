require('dotenv').config()
const express = require('express');
const app = express()
const PORT = process.env.PORT || 5000
const helmet = require('helmet');
const morgan = require('morgan');
const chalk = require('chalk');
const logger = require('./middleware/logger');
const authRouter = require('./api/auth/authRouter');
const usersRouter = require('./api/users/usersRouter');
const authorizeToken = require('./middleware/authorizeToken');

app.use(helmet())
app.use(logger)
app.use(morgan('short'))
app.use(express.json())

app.use('/api/users', authorizeToken, usersRouter)
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
  res.status(200).json({ message: `Server is Live` })
})

app.listen(PORT, () => {
  console.log(`\n ${chalk.yellowBright('%%')} Server Running on port: ${PORT} ${chalk.yellowBright('%%')} \n`)
})