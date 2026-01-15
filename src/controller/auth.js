import { registerUser, loginUser } from "../services/auth.js";

export const registerController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    message: "Successfully registered",
    data: user,
  });
};

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);

  res.status(200).json({
    message: "Successfully logged in",
    data: {
      accessToken: session.token,
      user: session.user,
    },
  });
};