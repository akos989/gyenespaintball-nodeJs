const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log(req.headers.authorization)
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (!decoded.operatorId) {
            return res.status(401).json({
                error: {
                    error: 'AUTH_FAILED'
                }
            });
        }
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: {
                error: 'AUTH_FAILED',
                message: error
            }
        });
    }
};