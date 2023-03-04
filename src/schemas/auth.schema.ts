import Joi from "joi";

export const LoginSchema = Joi.object({
    username_or_email: Joi.string().min(3).required(), // actually email or username
    password: Joi.string().min(5).required()
});

export const RegisterSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(8).max(30).required(),
    password: Joi.string().alphanum().min(5).max(30).required()
});

export const FcmSchema = Joi.object({
    device_id: Joi.string().min(10).required(),
    fcm_token: Joi.string().min(10).required(),
}).unknown(true);