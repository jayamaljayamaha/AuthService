import Joi from "joi";

const schema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string(),
});

export default schema;
