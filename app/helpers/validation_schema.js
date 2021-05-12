const Joi = require('@hapi/joi')
const registerSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    gender: Joi.string(),
    dateOfBirth: Joi.string(),
    expertises: Joi.array().required(),
    tutoringDays: Joi.array().required(),
    tutoringHours: Joi.array().required(),
    aboutMe: Joi.required(),
    eduBackground: Joi.required(),
    monthlyRate: Joi.required(),
    achievement: Joi.required(),
});
const updateSchema = Joi.object({
    fullName: Joi.string(),
    email: Joi.string().email(),
    phoneNumber: Joi.string(),
    expertises: Joi.array(),
    gender: Joi.string(),
    dateOfBirth: Joi.string(),
    tutoringDays: Joi.array(),
    tutoringHours: Joi.array(),
    aboutMe: Joi.string(),
    eduBackground: Joi.string(),
    monthlyRate: Joi.string(),
    achievement: Joi.string(),
    read: Joi.boolean(),
});
module.exports = {
    registerSchema,
    updateSchema
}