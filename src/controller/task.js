import {
  fetchTasksByBoardIdService,
  createTaskByBoardIdService,
  deleteTaskByIdService,
  moveTaskByIdService,
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

export const deleteTaskByIdController = async (req, res) => {
  const { taskId, boardId } = req.params;
  await deleteTaskByIdService(taskId, boardId);

  res.status(204).send();
};


export const moveTaskByIdController = async (req, res) => {
  const { taskId, boardId } = req.params;
  const { column_id: columnId } = req.body;
  const updatedTask = await moveTaskByIdService(taskId, boardId, columnId);

  res.status(200).json({
    message: "Successfully moved task",
    data: updatedTask,
  });
};
