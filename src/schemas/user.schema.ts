import Joi from "joi";

export const UserUpdateSchema = Joi.object({
    user: Joi.object({
        role_id: Joi.string().disallow('0001').required(),
    }).required(),
    employee: Joi.object({
        branch_company_id: Joi.string().min(36).max(36).required(),
        picture: Joi.string().allow("", null).max(100),
    })
});

export const UserSearchSchema = Joi.object({
    role_id: Joi.number().min(1).max(3),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(8).max(30),
}).unknown(true);