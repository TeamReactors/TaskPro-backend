import Joi from "joi";

export const addBoardSchema = Joi.object({
  title: Joi.string().required(),
  user_id: Joi.number().required(),
});
