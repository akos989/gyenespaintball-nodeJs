const Operator = require('../../models/operator');

module.exports = async () => {
    const operators = await Operator.findAll({
        where: {admin: true}
    });
    return operators.map(operator => operator.phoneNumber);
};
