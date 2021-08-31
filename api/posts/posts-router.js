// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')
const router = express.Router()
router.use(express.json())



//GET 
    //Returns **an array of all the post objects** contained in the database
router.get('/', async (req, res) => {
    try{
        const posts = await Posts.find()
        res.status(200).json(posts)
    }catch{
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})
    //Returns the post object with the specified
router.get('/:id', async (req, res) => {
    try{
        const post = await Posts.findById(req.params.id)
        if(post){
            res.status(200).json(post)
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    }catch{
        res.status(500).json({ message: "internal server error" })
    }
})
    //Returns an array of all the comment objects associated with the post with the specified id
router.get('/:id/comments', async (req, res) => {
    try{
        const comments = await Posts.findPostComments(req.params.id)
        const post = await Posts.findById(req.params.id)
        if(post){
            res.status(200).json(comments)
        }else{
            res.status(404).json({message: "The post with the specified ID does not exist" })
        }
    }
    catch{
        res.status(500).json({ message: "The comments information could not be retrieved" })
    }
})

//POST
    // Creates a post using the information sent inside the request body and returns the newly created post object
router.post('/', async (req, res) => {
    if(req.body.title !== undefined && req.body.contents !== undefined){
        try{
            const newPostId = await Posts.insert(req.body)
            const newPost = await Posts.findById(newPostId.id)
            res.status(201).json(newPost)
            console.log(newPost)
        }catch{
            res.status(500).json({ message: "There was an error while saving the post to the database" })
        }
    }else{
        res.status(400).json({ message: "Please provide title and contents for the post" })
    }
})

//PUT
    // Updates the post with the specified id using data from the request body and returns the modified document, not the original
router.put('/:id', async (req, res) => {
    // if(!req.body.title || !req.body.contents){
    //     res.status(404).json({ message: "The post with the specified ID does not exist" })
    // }
    try{
        const postToUpdate = await Posts.findById(req.params.id)
        if(postToUpdate){
            const updatedPost = {title: req.body.title, contents: req.body.contents}
            await Posts.update(req.params.id, updatedPost)
            const post = await Posts.findById(req.params.id)
            res.status(201).json(post)
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    }catch{
        res.status(500).json({ message: "The post information could not be modified" })
    }
})

//DELETE
    // Removes the post with the specified id and returns the deleted post object
router.delete('/:id', async (req, res) => {
    try{
        const deletedPost = await Posts.findById(req.params.id)
        if(deletedPost){
            const post = await Posts.remove(req.params.id)
            res.status(200).send(deletedPost)
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    }catch{
        res.status(500).json({ message: "The post could not be removed" })
    }
})


//Export 
module.exports = router