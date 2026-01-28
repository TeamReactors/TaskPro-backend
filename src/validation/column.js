import Joi from "joi";

export const addColumnSchema = Joi.object({
  title: Joi.string().required(),
  board_id: Joi.string().required(),
});
export const updateColumnSchema = Joi.object({
  title: Joi.string(),
});
