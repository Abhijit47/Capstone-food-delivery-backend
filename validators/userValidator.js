const Joi = require("joi");

exports.signUpValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).trim().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in', 'org', 'edu'] }
      })
      .required(),
    phone: Joi.string().max(10).min(10).required(),
    role: Joi.string(),
    password: Joi.string().required()
  });

  return schema.validateAsync(data);
};

exports.signInValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in', 'org', 'edu'] }
      })
      .required(),
    password: Joi.string().required()
  });

  return schema.validateAsync(data);
};