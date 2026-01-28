import {
  addColumnService,
  deleteColumnService,
  fetchColumnService,
  updateColumnService,
} from "../services/column.js";

export const addColumnController = async (req, res) => {
  const column = await addColumnService(req.body);

  res.status(201).json({
    message: "Successfully created column",
    data: column[0],
  });
};
export const fetchColumnController = async (req, res) => {
  const { boardId } = req.params;

  const columns = await fetchColumnService(boardId);

  res.status(200).json({
    message: "Successfully fetched according to boardId",
    data: columns,
  });
};
export const deleteColumnController = async (req, res) => {
  const { columnId } = req.params;

  await deleteColumnService(columnId);

  res.status(204).send();
};
export const updateColumnController = async (req, res) => {
  const { columnId } = req.params;

  const column = await updateColumnService(req.body, columnId);

  res.status(200).json({
    message: "Successfully updated according to columnId",
    data: column,
  });
};
