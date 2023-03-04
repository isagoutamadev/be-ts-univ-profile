import Joi from "joi";

export const GetFileSchema = Joi.object({
    filename: Joi.string().min(5).required()
});