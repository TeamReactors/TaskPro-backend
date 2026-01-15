import {
  addBoardService,
  deleteBoardService,
  fetchBoardService,
} from "../services/board.js";

export const addBoardController = async (req, res) => {
  const { id: userId } = req.user;

  const board = await addBoardService({ ...req.body, user_id: userId });

  res.status(201).json({
    message: "Successfully add board",
    data: board[0],
  });
};

export const fetchBoardController = async (req, res) => {
  const { id: userId } = req.user;
  const board = await fetchBoardService(userId);

  res.status(200).json({
    message: "Successfully fetched",
    data: board,
  });
};

export const deleteBoardController = async (req, res) => {
  const { boardId } = req.params;
  const { id: userId } = req.user; 

  await deleteBoardService(boardId, userId);

  res.status(204).send();
};