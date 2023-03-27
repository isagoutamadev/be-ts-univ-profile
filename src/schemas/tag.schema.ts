import Joi from "joi";

export const CreateTagSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
});