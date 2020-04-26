module.exports = (req, res, next) => {
    res.locals.emailBody = `
    <h3> Kedves ${res.locals.reservationInfo.email}! </h3>
    `;
    return next();
}