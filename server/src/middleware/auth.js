const jwt = require('jsonwebtoken');

function authMiddleware(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message : 'Not authenticated'});
    }

    try {
        const decode = jwt.verify(token,process.env.JWT_ACCESS_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(403).json({message : 'Invalid token'});
    }
}


module.exports = authMiddleware;