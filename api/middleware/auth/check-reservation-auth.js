const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        if ((decoded.reservationId && req.params.reservationId === decoded.reservationId)
            || (decoded.operatorId)) {
            return next();
        }
        return res.status(401).json({
            error: {
                error: 'AUTH_FAILED'
            }
        });
    } catch (error) {
        return res.status(401).json({
            error: {
                error: 'AUTH_FAILED',
                message: error
            }
        });
    }
};