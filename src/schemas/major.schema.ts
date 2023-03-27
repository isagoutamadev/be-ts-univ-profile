import Joi from "joi";

export const MajorSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
});