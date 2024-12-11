import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
    try {
        //Grabbing the token from the Authorization part of the req.header 
       let token = req.header("Authorization") ;

       //If token does not exist deny access
       if(!token) {
        return res.status(403).json("Access denied")
       }

       //If token start with Bearer (from frontend) take everything after the space and trim 7 places to the left
       //This takes away Bearer and the space after it and leaves us with the token
       if(token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft()
       }

       //Verifying the token by adding the secret in the .env file and setting it to the req.user
       const verified = jwt.verify(token, process.env.JWT_SECRET)
       req.user = verified
       next()
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

export default verifyToken
