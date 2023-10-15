const Joi = require("joi");

exports.queryValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).trim().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in', 'org', 'edu'] }
      })
      .required(),
    message: Joi.string().min(20).max(255).trim().required()
  });

  return schema.validateAsync(data);
};