import {
  addBoardService,
  deleteBoardService,
  fetchBoardService,
} from "../services/board.js";

export const addBoardController = async (req, res) => {
  const board = await addBoardService(req.body);

  res.status(201).json({
    message: "Successfully add board",
    data: board[0],
  });
};
export const fetchBoardController = async (req, res) => {
  const board = await fetchBoardService();

  res.status(200).json({
    message: "Successfully fetched",
    data: board,
  });
};
export const deleteBoardController = async (req, res) => {
  const { boardId } = req.params;

  await deleteBoardService(boardId);

  res.status(204).send();
};
