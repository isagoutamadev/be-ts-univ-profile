import Joi from "joi";

export const CreateCreationSchema = Joi.object({
    title: Joi.string()
        .min(5)
        .max(30)
        .required(),
    cover: Joi.string()
        .min(5)
        .required(),
    to_url: Joi.string()
        .min(0)
        .allow(null),
    description: Joi.string().min(0).allow(null),
    tag_ids: Joi.array()
        .items(Joi.string().uuid().required())
        .min(1)
        .required(),
    contents: Joi.array().items(Joi.object({
        filename: Joi.string().min(5).allow(null),
        embed_code: Joi.string().min(5).allow(null),
        url: Joi.string().min(5).allow(null),
    })).min(1).required()
});
