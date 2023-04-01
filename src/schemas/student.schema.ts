import Joi from "joi";

export const UpdateStudentSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    major_id: Joi.string().uuid().required(),
    avatar: Joi.string().min(3),
    nim: Joi.number().min(5).allow(null),
    bio: Joi.string().min(0).required(),
    registered_at: Joi.string().isoDate().required(),
    graduated_at: Joi.string().isoDate().allow(null),
    website_url: Joi.string().allow(null),
    website_screenshot: Joi.string().allow(null),
    interest_tag_ids: Joi.array().items(
        Joi.string().uuid().required()
    ).min(1).required(),
});