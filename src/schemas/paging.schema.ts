import Joi from "joi";

export const PagingSchema = Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(10),
    sort: Joi.string().valid("asc", "desc"),
}).unknown(true);