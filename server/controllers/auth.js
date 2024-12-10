import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/userModel'

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