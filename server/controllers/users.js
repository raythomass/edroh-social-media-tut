import User from "../models/userModel.js";

//READ
export const getUser = async (req, res) => {
    try {
        //Grabs the id from the url parameters and finds the user based on that id
        const { id } = req.params
        const user = await User.findById(id)
        //Sends information to the frontend of that user back as json
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const getUserFriends = async (req, res) => {
    try {
        //Grabs the id from the url parameters and finds the user based on that id
        const { id } = req.params
        const user = await User.findById(id)

        //Gets all the friends ids based on the id of the User
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        //Maps the friend information fields and returns all those fields
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath}
            }
        );
        //Sends the formatted friends back on a status of 200
        res.status(200).json(formattedFriends)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

//UPDATE
export const addRemoveFriend = async (req, res) => {
    try {
        //Grabbing the id and friend id from the url params
        const { id, friendId } = req.params
        const user = await User.findById(id)
        const friend = await User.findById(friendId)

        //IF = REMOVE       ELSE = ADD
        //If a users friends list has that friend id in it, filter out that user from both the user and the friend
        //If they dont have each others ids in their friends list, they get pushed into each others friends list
        // -- Think of this like a button that adds or removes based on if they are added or not --
        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId)
            friend.friend = friend.friends.filter((id) => id !== id)
        } else {
            user.friends.push(friendId)
            friend.friends.push(id)
        }

        //Saves the changes made to the user and friend
        await user.save()
        await friend.save()

        //Formats the friends again
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath}
            }
        );

        //Send back formatted friends
        res.status(200).json(formattedFriends)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}