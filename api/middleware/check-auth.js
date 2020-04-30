const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.DEF_JWT_PRIVATE_KEY);
        req.userData = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            message: 'Auth failed Failed'
        });
    }
};
