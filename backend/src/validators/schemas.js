const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(), // Relaxed to allow generic strings like 'admin'
    password: Joi.string().required(), // Removed minimum length
    role: Joi.string().valid('Viewer', 'Analyst', 'Admin').optional()
});

const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

const recordSchema = Joi.object({
    amount: Joi.number().required(),
    type: Joi.string().valid('income', 'expense').required(),
    category: Joi.string().required(),
    notes: Joi.string().optional()
});

const updateRecordSchema = Joi.object({
    amount: Joi.number().optional(),
    type: Joi.string().valid('income', 'expense').optional(),
    category: Joi.string().optional(),
    notes: Joi.string().optional()
}).min(1);

module.exports = {
    registerSchema,
    loginSchema,
    recordSchema,
    updateRecordSchema
};
