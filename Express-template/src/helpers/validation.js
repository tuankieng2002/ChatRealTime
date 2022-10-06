const joi = require('joi');

//validation user
const userValidate = (data) => {
    const schema = joi.object({
        full_name: joi.string().min(3).required(),
        email: joi.string().pattern(new RegExp('gmail.com$')).email().lowercase().required(),
        phone: joi.string().min(10).required(),
        password: joi.string().min(6).required(),
        address: joi.string(),
        avatar: joi.string(),
        role: joi.string(),
    });
    return schema.validate(data);
}
module.exports = {
    userValidate
};