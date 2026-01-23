import {
  fetchTasksByBoardIdService,
  createTaskByBoardIdService,
} from "../services/task.js";

export const fetchTasksByBoardIdController = async (req, res) => {
  const { boardId } = req.params;

  const tasks = await fetchTasksByBoardIdService(boardId);

  res.status(200).json({
    message: "Successfully fetched tasks",
    data: tasks,
  });
};

export const addTaskByBoardIdController = async (req, res) => {
  const { boardId } = req.params;
  const payload = req.body;

  const newTask = await createTaskByBoardIdService(boardId, payload);

  res.status(201).json({
    message: "Successfully created task",
    data: newTask,
  });
};
