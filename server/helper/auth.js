const authorizationRequired = 'Authorization required'
const invalidCredentials = 'Invalid credentials'

const auth = (req,res,next) =>{
if(!req.headers.authorization){
   res.statusMessage = authorizationRequired
   res.status(401).json({message:authorizationRequired})

}
else{
    try{
        const token = req.headers.authorization
        next()
    } catch(err){
        res.statusMEssage = invalidCredentials
        res.status(403).json({message:invalidCredentials})
    }
}
}

export {auth}