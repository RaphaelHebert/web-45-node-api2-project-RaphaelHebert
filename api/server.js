// implement your server here
const express = require('express')
const postRouter = require('./posts/posts-router')

const server = express()
server.use(express.json())

server.use('/api/posts', postRouter);


server.get('/', (req, res) => {
    res.status(200).send("hello you")
})

server.get('/api/posts', (req, res) => {
    res.json({ message: "yes yes yes"});
  });

// require your posts router and connect it here
module.exports = server