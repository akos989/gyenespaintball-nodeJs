module.exports = (req, res, next) => {
    if (req.userData.operatorId !== req.body.operatorId) {
        return res.status(401).json({
            error: {
                error: 'NOT_SAME_USER'
            }
        });
    } else {
        return next();
    }
};