import Joi from "joi";

export const FaqSchema = Joi.object({
    question: Joi.string()
        .min(5)
        .max(30)
        .required(),
    answer: Joi.string()
        .min(5)
        .max(30)
        .required(),
});
