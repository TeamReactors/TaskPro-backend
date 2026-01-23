import Joi from "joi";

export const addTaskSchema = Joi.object({
  title: Joi.string().required("Title is required"),
  description: Joi.string().max(500).required("Description is required"),
  priority: Joi.string()
    .valid("low", "medium", "high")
    .required("Priority is required"),
  columnId: Joi.string().required("Column ID is required"),
  deadline: Joi.date().required("Deadline is required"),
});
