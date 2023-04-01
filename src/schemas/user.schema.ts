import Joi from "joi";

export const CreateUserSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(8).max(30).required(),
    username: Joi.string().alphanum().min(8).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'student').required(),
    name: Joi.string().min(3).required(),
    nim: Joi.number().min(5).required(),
});
export const UpdateUserSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(8).max(30).required(),
    username: Joi.string().alphanum().min(8).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'student').required()
});

export const UserSearchSchema = Joi.object({
    role_id: Joi.number().min(1).max(3),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(8).max(30),
}).unknown(true);