import Post from '../models/postModel.js'
import User from '../models/userModel.js'

//CREATE
export const createPost = async (req, res) => {
    try {
        //Garbbing the details given in the request body that will be entered into the post
        const { userId, description, picturePath } = req.body
        //Grabbing a user by the userId of the body
        const user = await User.findById(userId)
        //Creating a new post with these fields and entering the alredy given user details into the specific fields
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        })
        //Saves the new post that was made
        await newPost.save()
        // Creating a variable that finds all post and then sends them to the frontend with a 200 status
        const post = await Post.find()
        res.status(200).json(post)
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

//READ
export const getFeedPosts = async (req, res) => {
    try {
        //Creates a variable finding all posts and sending them to frontend with a 200 status
        const post = await Post.find()
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ error: error.message }) 
    }
}

export const getUserPosts = async (req, res) => {
    try {
        //Getting the userId from the params and finding all posts from that id
        const { userId } = req.params
        const post = await Post.find({userId})
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ error: error.message }) 
    }
}

//UPDATE
export const likePost = async (req, res) => {
    try {
        //Grabbing id from the params and getting the userId from the body
        const { id } = req.params
        const { userId } = req.body
        //A post variable is made of the post by id
        const post = await Post.findById(id)
        //isLiked variable made that means that a user is in the likes field for a post meaning they have liked it already
        const isLiked = post.likes.get(userid)
        // If a post is liked, delete that userId from the likes field
        // If it does not exist, it sets it
        // -- Think like a button --
        if(isLiked) {
            post.likes.delete(userId)
        } else {
            post.likes.set(userId, true);
        }
        //Variable finds a post by the id in the params that I destructured 
        // Updates likes based on what happened in the previous "if" statement
        //New will instead give you the object after update was applied because findByIdAndUpdate() usually returns document before it was updated
        const updatedPost = await Post.findByIdAndUpdate(
            id, 
            { likes: post.likes },
            { new: true }
        )
        //Return all the updated posts to the frontend
        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(404).json({ error: error.message }) 
    }
}