const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).json({ error: 'unauthorized' });
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
      const decoded = jwt.verify(token,  process.env.JWTKEY);
      console.log(decoded);
      req.userId = decoded.id;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };


  module.exports  = authenticateUser