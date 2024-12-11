import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';

//REGISTER USER
export const register = async (req, res) => {
    try {
        // Destructuring user model fields
        const {
            firstName, 
            lastName, 
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        //Using bcrypt to hash a password
        // Creating a salt value, hashing the password from req.body with the salt value
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        //Creating new user and setting the password as the new hashed password
        //Math.floor is temp data for the tutorail purpose
        const newUser = new User({
            firstName, 
            lastName, 
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        //Take the user we made and saving it and sending it as json with a 201 status
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//LOGIN USER
export const login = async (req, res) => {
    try {
        //Taking the email and password enetred in the body
        const { email, password } = req.body

        //Finding a user in the Db by the email value
        const user = await User.findOne({ email: email })
        if(!user) {
            return res.status(400).json({ msg: "User does not exists"})
        }

        //Compare whether the entered password and the user's Db password are the same
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials"})
        }

        //Creating a token by taking user id and a secret from .env file
        //Deleting the user password so it is not sent to frontend
        //Sending token and user on a status of 200
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        delete user.password
        res.status(200).json({ token, user })

    } catch (error) {
        res.status(500).json({ error: error.message }) 
    }
}