const jwt=require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ message: "Token required" });
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
  
      req.user = user; // Ensure req.user is correctly assigned
      next();
    });
  }
  
module.exports={
    authenticateToken
};